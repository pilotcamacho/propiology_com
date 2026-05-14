import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { getAnthropicClient, AI_MODEL } from '@/lib/ai/client';
import { COGNITIVE_SHIELD_SYSTEM, type AiLocale } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/ai/ratelimit';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
);

function extractJwt(req: NextRequest): { sub: string; tier: string } | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(auth.slice(7).split('.')[1]!, 'base64url').toString()
    ) as Record<string, unknown>;
    return {
      sub: (payload.sub as string) ?? '',
      tier: (payload['custom:subscription_tier'] as string) ?? 'basic',
    };
  } catch {
    return null;
  }
}

export interface BiasResult {
  name: string;
  explanation: string;
  reframe: string;
}

export interface AnalysisResult {
  biases: BiasResult[];
  summaryInsight: string;
  microAction: string;
}

export async function POST(req: NextRequest) {
  const jwt = extractJwt(req);
  if (!jwt?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tier = (jwt.tier as 'trial' | 'basic' | 'pro') ?? 'basic';
  const { allowed } = await checkRateLimit(jwt.sub, tier);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Daily limit reached. Upgrade to Pro for unlimited access.' },
      { status: 429 }
    );
  }

  const body = (await req.json()) as { thought: string; locale: AiLocale };
  const { thought, locale = 'en' } = body;

  if (!thought?.trim()) {
    return NextResponse.json({ error: 'thought is required' }, { status: 400 });
  }

  const systemText = COGNITIVE_SHIELD_SYSTEM[locale] ?? COGNITIVE_SHIELD_SYSTEM.en;
  const anthropic = getAnthropicClient();

  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: thought }],
    });

    const rawText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch?.[0]) {
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]) as AnalysisResult;

    const tableName = process.env.AI_CONVERSATION_TABLE_NAME;
    if (tableName) {
      await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            id: randomUUID(),
            owner: jwt.sub,
            tool: 'cognitive_shield',
            messagesJson: JSON.stringify([{ role: 'user', content: thought }]),
            summaryInsight: analysis.summaryInsight,
            microAction: analysis.microAction,
            createdAt: new Date().toISOString(),
          },
        })
      );
    }

    return NextResponse.json(analysis);
  } catch (err) {
    console.error('[cognitive-shield] error', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
