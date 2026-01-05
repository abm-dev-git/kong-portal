/**
 * Kong Admin API Type Definitions
 */

// Kong Consumer - represents a user/application that can consume APIs
export interface KongConsumer {
  id: string;
  username: string;
  custom_id?: string;
  tags?: string[];
  created_at: number;
}

// Kong Key-Auth Credential - an API key for a consumer
export interface KongKeyAuthCredential {
  id: string;
  key: string; // The actual API key (only returned on creation)
  consumer: { id: string };
  created_at: number;
  tags?: string[];
  ttl?: number | null;
}

// Kong API List Response wrapper
export interface KongListResponse<T> {
  data: T[];
  next?: string | null;
}

// Kong Error Response
export interface KongErrorResponse {
  message: string;
  name?: string;
  code?: number;
  fields?: Record<string, string>;
}

// Request types
export interface CreateConsumerRequest {
  username: string;
  custom_id?: string;
  tags?: string[];
}

export interface CreateKeyAuthRequest {
  key?: string; // Optional - Kong will generate if not provided
  tags?: string[];
  ttl?: number;
}
