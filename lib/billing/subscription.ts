import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
);

const TABLE = () => process.env.USER_SUBSCRIPTION_TABLE_NAME!;

export type SubscriptionTier = 'trial' | 'basic' | 'pro';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled';

export interface SubscriptionRecord {
  id: string;
  owner: string;
  userId: string;
  __typename: 'UserSubscription';
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  interval?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getSubscriptionByUserId(userId: string): Promise<SubscriptionRecord | null> {
  const res = await dynamo.send(new GetCommand({ TableName: TABLE(), Key: { id: userId } }));
  return (res.Item as SubscriptionRecord | undefined) ?? null;
}

export async function upsertSubscription(
  userId: string,
  patch: Partial<Omit<SubscriptionRecord, 'id' | 'owner' | 'userId' | '__typename' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await getSubscriptionByUserId(userId);

  // Build merged item, preserving existing values for unspecified fields
  const item: Record<string, unknown> = {
    id: userId,
    owner: userId,
    userId,
    __typename: 'UserSubscription',
    tier: patch.tier ?? existing?.tier ?? 'trial',
    status: patch.status ?? existing?.status ?? 'trialing',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  // Only include optional string fields if they have a value
  const optionalFields: (keyof typeof patch)[] = [
    'stripeCustomerId',
    'stripeSubscriptionId',
    'interval',
    'currentPeriodEnd',
  ];
  for (const field of optionalFields) {
    const value = patch[field] ?? (existing as Record<string, unknown> | null)?.[field];
    if (value != null) item[field] = value;
  }

  if ((patch.cancelAtPeriodEnd ?? existing?.cancelAtPeriodEnd) != null) {
    item.cancelAtPeriodEnd = patch.cancelAtPeriodEnd ?? existing?.cancelAtPeriodEnd;
  }

  await dynamo.send(new PutCommand({ TableName: TABLE(), Item: item }));
}
