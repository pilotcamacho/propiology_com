import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { currentStreak, bestStreak } from '@/lib/habits/streaks';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
);

const HABITS_TABLE = () => process.env.HABIT_DEFINITION_TABLE_NAME!;
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

// GET /api/habits — list active habits with current streak
export async function GET(req: NextRequest) {
  const userId = extractUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceStr = since.toISOString().split('T')[0]!;

  const habitsRes = await dynamo.send(
    new QueryCommand({
      TableName: HABITS_TABLE(),
      IndexName: 'byOwner',
      KeyConditionExpression: '#owner = :owner',
      FilterExpression: 'isActive = :active',
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':owner': userId, ':active': true },
    })
  );

  const habits = habitsRes.Items ?? [];

  const results = await Promise.all(
    habits.map(async (habit) => {
      const logsRes = await dynamo.send(
        new QueryCommand({
          TableName: LOGS_TABLE(),
          IndexName: 'byHabitAndDate',
          KeyConditionExpression: 'habitId = :hid AND logDate >= :since',
          ExpressionAttributeValues: { ':hid': habit.id, ':since': sinceStr },
        })
      );
      const logs = (logsRes.Items ?? []).map((l) => ({
        logDate: l.logDate as string,
        completed: l.completed as boolean,
      }));
      return {
        ...habit,
        currentStreak: currentStreak(logs),
        bestStreak: bestStreak(logs),
      };
    })
  );

  return NextResponse.json({ habits: results });
}

// POST /api/habits — create a new habit
export async function POST(req: NextRequest) {
  const userId = extractUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as {
    name: string;
    category?: string;
    frequency?: 'daily' | 'weekly';
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = randomUUID();

  await dynamo.send(
    new PutCommand({
      TableName: HABITS_TABLE(),
      Item: {
        id,
        owner: userId,
        name: body.name.trim(),
        category: body.category ?? null,
        frequency: body.frequency ?? 'daily',
        isActive: true,
        createdAt: now,
        updatedAt: now,
        __typename: 'HabitDefinition',
      },
    })
  );

  return NextResponse.json({ id }, { status: 201 });
}
