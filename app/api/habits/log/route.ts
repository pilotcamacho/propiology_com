import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
);

const LOGS_TABLE = () => process.env.HABIT_LOG_TABLE_NAME!;

function extractUserId(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(auth.slice(7).split('.')[1]!, 'base64url').toString()
    );
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

// POST /api/habits/log — log a habit completion (used by WhatsApp webhook)
export async function POST(req: NextRequest) {
  const userId = extractUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as {
    habitId: string;
    logDate?: string; // YYYY-MM-DD, defaults to today
    completed: boolean;
    notes?: string;
    source?: 'app' | 'whatsapp';
  };

  if (!body.habitId) {
    return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
  }

  const logDate = body.logDate ?? new Date().toISOString().split('T')[0]!;
  const now = new Date().toISOString();

  await dynamo.send(
    new PutCommand({
      TableName: LOGS_TABLE(),
      Item: {
        id: randomUUID(),
        owner: userId,
        habitId: body.habitId,
        logDate,
        completed: body.completed,
        notes: body.notes ?? null,
        source: body.source ?? 'app',
        createdAt: now,
        updatedAt: now,
        __typename: 'HabitLog',
      },
    })
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
