import { NextRequest } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { getAnthropicClient, AI_MODEL } from '@/lib/ai/client';
import { CARE_MULTIPLIER_SYSTEM, type AiLocale } from '@/lib/ai/prompts';
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

export async function POST(req: NextRequest) {
  const jwt = extractJwt(req);
  if (!jwt?.sub) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const tier = (jwt.tier as 'trial' | 'basic' | 'pro') ?? 'basic';
  const { allowed, remaining } = await checkRateLimit(jwt.sub, tier);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily limit reached. Upgrade to Pro for unlimited access.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = (await req.json()) as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    locale: AiLocale;
  };
  const { messages, locale = 'en' } = body;
  const systemText = CARE_MULTIPLIER_SYSTEM[locale] ?? CARE_MULTIPLIER_SYSTEM.en;
  const anthropic = getAnthropicClient();

  const stream = new ReadableStream({
    async start(controller) {
      let assistantText = '';
      try {
        const response = anthropic.messages.stream({
          model: AI_MODEL,
          max_tokens: 1024,
          system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
          messages,
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            assistantText += event.delta.text;
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }

        const tableName = process.env.AI_CONVERSATION_TABLE_NAME;
        if (tableName && assistantText) {
          await dynamo.send(
            new PutCommand({
              TableName: tableName,
              Item: {
                id: randomUUID(),
                owner: jwt.sub,
                tool: 'care_multiplier',
                messagesJson: JSON.stringify([
                  ...messages,
                  { role: 'assistant', content: assistantText },
                ]),
                createdAt: new Date().toISOString(),
              },
            })
          );
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-RateLimit-Remaining': String(remaining),
    },
  });
}
