import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
);

const DAILY_LIMIT_BASIC = 10;

function todayKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0]!;
  return `${userId}#${today}`;
}

export async function checkRateLimit(
  userId: string,
  tier: 'trial' | 'basic' | 'pro'
): Promise<{ allowed: boolean; remaining: number }> {
  if (tier === 'pro' || tier === 'trial') {
    return { allowed: true, remaining: 999 };
  }

  const tableName = process.env.AI_RATE_LIMIT_TABLE_NAME;
  if (!tableName) {
    return { allowed: true, remaining: DAILY_LIMIT_BASIC };
  }

  const ttl = Math.floor(Date.now() / 1000) + 86_400;

  const { Attributes } = await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: todayKey(userId) },
      UpdateExpression: 'ADD #count :one SET #ttl = if_not_exists(#ttl, :ttl)',
      ExpressionAttributeNames: { '#count': 'count', '#ttl': 'ttl' },
      ExpressionAttributeValues: { ':one': 1, ':ttl': ttl },
      ReturnValues: 'ALL_NEW',
    })
  );

  const count = (Attributes?.count as number) ?? 1;
  return {
    allowed: count <= DAILY_LIMIT_BASIC,
    remaining: Math.max(0, DAILY_LIMIT_BASIC - count),
  };
}
