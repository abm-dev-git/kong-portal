import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kongClient, KongApiError } from '@/lib/kong';
import {
  saveKeyMetadata,
  getKeysForUser,
  getKeyPrefix,
  type ApiKey,
  type CreateApiKeyRequest,
  type CreateApiKeyResponse,
  type ListApiKeysResponse,
} from '@/lib/api-keys';

/**
 * GET /api/api-keys - List all API keys for the authenticated user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Kong is available first
    const kongAvailable = await kongClient.healthCheck();
    if (!kongAvailable) {
      // Kong is not running - return empty list with warning
      console.warn('Kong Admin API is not available');
      return NextResponse.json<ListApiKeysResponse & { warning?: string }>({
        keys: [],
        warning: 'API key service is temporarily unavailable',
      });
    }

    // Get consumer for this user (if exists)
    const consumer = await kongClient.getConsumer(userId);

    if (!consumer) {
      // User has no consumer/keys yet
      return NextResponse.json<ListApiKeysResponse>({ keys: [] });
    }

    // Get keys from Kong
    const kongKeys = await kongClient.listKeyAuth(consumer.id);

    // Get local metadata for user's keys
    const metadata = await getKeysForUser(userId);

    // Combine Kong keys with local metadata
    const keys: ApiKey[] = kongKeys.map((kongKey) => {
      const keyMeta = metadata[kongKey.id];
      return {
        id: kongKey.id,
        name: keyMeta?.name || 'Unnamed Key',
        keyPrefix: keyMeta?.keyPrefix || kongKey.key.substring(0, 8),
        createdAt: keyMeta?.createdAt || new Date(kongKey.created_at * 1000).toISOString(),
        lastUsed: null, // Kong doesn't track this natively
        status: 'active' as const,
      };
    });

    return NextResponse.json<ListApiKeysResponse>({ keys });
  } catch (error) {
    console.error('Error listing API keys:', error);

    if (error instanceof KongApiError) {
      // Connection errors (status 0) mean Kong is not reachable
      if (error.statusCode === 0) {
        return NextResponse.json<ListApiKeysResponse & { warning?: string }>({
          keys: [],
          warning: 'API key service is temporarily unavailable',
        });
      }
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/api-keys - Create a new API key
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Kong is available first
    const kongAvailable = await kongClient.healthCheck();
    if (!kongAvailable) {
      return NextResponse.json(
        { error: 'API key service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json() as CreateApiKeyRequest;

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    if (body.name.length > 50) {
      return NextResponse.json(
        { error: 'Key name must be 50 characters or less' },
        { status: 400 }
      );
    }

    // Get or create Kong consumer for this user
    const consumer = await kongClient.getOrCreateConsumer(userId);

    // Create key-auth credential in Kong
    const kongKey = await kongClient.createKeyAuth(consumer.id);

    // Save metadata locally
    const createdAt = new Date().toISOString();
    const keyPrefix = getKeyPrefix(kongKey.key);

    await saveKeyMetadata(kongKey.id, {
      name: body.name.trim(),
      keyPrefix,
      createdAt,
      userId,
    });

    // Return the full key (only time it's visible!)
    const response: CreateApiKeyResponse = {
      id: kongKey.id,
      name: body.name.trim(),
      key: kongKey.key,
      keyPrefix,
      createdAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);

    if (error instanceof KongApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
