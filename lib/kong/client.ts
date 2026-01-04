/**
 * Kong Admin API Client
 *
 * Provides methods for managing Kong consumers and key-auth credentials.
 * Uses the Kong Admin API (default: http://localhost:8001).
 */

import type {
  KongConsumer,
  KongKeyAuthCredential,
  KongListResponse,
  CreateConsumerRequest,
  CreateKeyAuthRequest,
} from './types';
import { KongApiError, ConsumerNotFoundError, KeyAuthNotFoundError } from './errors';

const KONG_ADMIN_URL = process.env.KONG_ADMIN_URL || 'http://localhost:8001';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export class KongAdminClient {
  private baseUrl: string;

  constructor(baseUrl: string = KONG_ADMIN_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Make a request to the Kong Admin API
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          // Body might not be JSON
        }
        throw KongApiError.fromResponse(response, body);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof KongApiError) {
        throw error;
      }
      throw KongApiError.connectionError(error);
    }
  }

  // ============================================
  // Consumer Operations
  // ============================================

  /**
   * Get a consumer by username or ID
   */
  async getConsumer(usernameOrId: string): Promise<KongConsumer | null> {
    try {
      return await this.request<KongConsumer>(`/consumers/${encodeURIComponent(usernameOrId)}`);
    } catch (error) {
      if (error instanceof KongApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new consumer
   */
  async createConsumer(data: CreateConsumerRequest): Promise<KongConsumer> {
    return this.request<KongConsumer>('/consumers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get or create a consumer for a Clerk user ID
   * Uses the Clerk userId as the Kong consumer username
   */
  async getOrCreateConsumer(clerkUserId: string): Promise<KongConsumer> {
    // Try to get existing consumer
    const existing = await this.getConsumer(clerkUserId);
    if (existing) {
      return existing;
    }

    // Create new consumer with Clerk userId as username
    return this.createConsumer({
      username: clerkUserId,
      custom_id: clerkUserId,
      tags: ['clerk-user', 'kong-portal'],
    });
  }

  /**
   * Delete a consumer
   */
  async deleteConsumer(usernameOrId: string): Promise<void> {
    try {
      await this.request<void>(`/consumers/${encodeURIComponent(usernameOrId)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (error instanceof KongApiError && error.statusCode === 404) {
        throw new ConsumerNotFoundError(usernameOrId);
      }
      throw error;
    }
  }

  // ============================================
  // Key-Auth Operations
  // ============================================

  /**
   * Create a key-auth credential for a consumer
   * Kong will generate the API key
   */
  async createKeyAuth(
    consumerId: string,
    data: CreateKeyAuthRequest = {}
  ): Promise<KongKeyAuthCredential> {
    return this.request<KongKeyAuthCredential>(
      `/consumers/${encodeURIComponent(consumerId)}/key-auth`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * List all key-auth credentials for a consumer
   */
  async listKeyAuth(consumerId: string): Promise<KongKeyAuthCredential[]> {
    try {
      const response = await this.request<KongListResponse<KongKeyAuthCredential>>(
        `/consumers/${encodeURIComponent(consumerId)}/key-auth`
      );
      return response.data || [];
    } catch (error) {
      if (error instanceof KongApiError && error.statusCode === 404) {
        // Consumer doesn't exist, return empty list
        return [];
      }
      throw error;
    }
  }

  /**
   * Get a specific key-auth credential
   */
  async getKeyAuth(
    consumerId: string,
    keyId: string
  ): Promise<KongKeyAuthCredential | null> {
    try {
      return await this.request<KongKeyAuthCredential>(
        `/consumers/${encodeURIComponent(consumerId)}/key-auth/${encodeURIComponent(keyId)}`
      );
    } catch (error) {
      if (error instanceof KongApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete a key-auth credential (revoke the API key)
   */
  async deleteKeyAuth(consumerId: string, keyId: string): Promise<void> {
    try {
      await this.request<void>(
        `/consumers/${encodeURIComponent(consumerId)}/key-auth/${encodeURIComponent(keyId)}`,
        {
          method: 'DELETE',
        }
      );
    } catch (error) {
      if (error instanceof KongApiError && error.statusCode === 404) {
        throw new KeyAuthNotFoundError(keyId);
      }
      throw error;
    }
  }

  // ============================================
  // Health Check
  // ============================================

  /**
   * Check if Kong Admin API is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request<{ tagline: string }>('/');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const kongClient = new KongAdminClient();
