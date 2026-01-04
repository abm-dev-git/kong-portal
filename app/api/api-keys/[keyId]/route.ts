import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { kongClient, KongApiError, KeyAuthNotFoundError } from '@/lib/kong';
import { deleteKeyMetadata, getKeyMetadata, type RevokeApiKeyResponse } from '@/lib/api-keys';

interface RouteParams {
  params: Promise<{ keyId: string }>;
}

/**
 * DELETE /api/api-keys/[keyId] - Revoke (delete) an API key
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { keyId } = await params;

    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      );
    }

    // Verify this key belongs to the user
    const metadata = await getKeyMetadata(keyId);
    if (metadata && metadata.userId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to revoke this key' },
        { status: 403 }
      );
    }

    // Get consumer for this user
    const consumer = await kongClient.getConsumer(userId);

    if (!consumer) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    // Delete key from Kong
    await kongClient.deleteKeyAuth(consumer.id, keyId);

    // Delete local metadata
    await deleteKeyMetadata(keyId);

    const response: RevokeApiKeyResponse = {
      success: true,
      message: 'API key revoked successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error revoking API key:', error);

    if (error instanceof KeyAuthNotFoundError) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    if (error instanceof KongApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
