/**
 * Universal API client for portal-to-backend communication
 * Handles authentication, organization context, and error handling consistently
 *
 * Usage:
 * ```typescript
 * import { createApiClient } from '@/lib/api-client';
 *
 * const api = createApiClient(token, orgId);
 * const result = await api.get<MyType>('/v1/some-endpoint');
 * if (result.success) {
 *   // handle result.data
 * } else {
 *   // handle result.error
 * }
 * ```
 */

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api';

export interface ApiClientConfig {
  token?: string;
  orgId?: string;
  /** DevLogin key for E2E testing bypass */
  devLoginKey?: string;
  /** Custom headers to include in all requests */
  customHeaders?: Record<string, string>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    correlationId?: string;
    timestamp?: string;
    apiVersion?: string;
  };
}

export class ApiClient {
  private token?: string;
  private orgId?: string;
  private devLoginKey?: string;
  private customHeaders?: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.token = config.token;
    this.orgId = config.orgId;
    this.devLoginKey = config.devLoginKey;
    this.customHeaders = config.customHeaders;
  }

  /**
   * Update the authentication token
   */
  setToken(token: string | undefined): void {
    this.token = token;
  }

  /**
   * Update the organization ID
   */
  setOrgId(orgId: string | undefined): void {
    this.orgId = orgId;
  }

  /**
   * Update the DevLogin key (for E2E testing)
   */
  setDevLoginKey(key: string | undefined): void {
    this.devLoginKey = key;
  }

  /**
   * Set custom headers
   */
  setCustomHeaders(headers: Record<string, string> | undefined): void {
    this.customHeaders = headers;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Use Bearer token if available, otherwise use DevLogin key
    if (this.token && this.token !== 'DEVLOGIN') {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else if (this.devLoginKey) {
      headers['X-DevLogin-Key'] = this.devLoginKey;
    }

    if (this.orgId) {
      headers['x-org-id'] = this.orgId;
    }

    // Apply any custom headers
    if (this.customHeaders) {
      Object.assign(headers, this.customHeaders);
    }

    return headers;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Handle empty responses (e.g., 204 No Content)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: `HTTP_${response.status}`,
          message: data.message || response.statusText || 'Request failed',
        },
        metadata: data.metadata,
      };
    }

    // Backend returns { success, data, error, metadata } format
    if (typeof data.success === 'boolean') {
      return {
        success: data.success,
        data: data.data || data,
        error: data.error,
        metadata: data.metadata,
      };
    }

    // Direct data response
    return {
      success: true,
      data: data as T,
    };
  }

  private handleNetworkError<T>(error: unknown): ApiResponse<T> {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
}

/**
 * Create an API client instance (for use in components)
 */
export function createApiClient(token?: string, orgId?: string, devLoginKey?: string): ApiClient {
  return new ApiClient({ token, orgId, devLoginKey });
}

/**
 * Default API client instance (for use without auth context)
 */
export const apiClient = new ApiClient();
