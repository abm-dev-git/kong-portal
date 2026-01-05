/**
 * API Key Types for the Application
 */

// Metadata stored locally for each API key
export interface ApiKeyMetadata {
  name: string;
  keyPrefix: string; // First 8 characters of the key
  createdAt: string; // ISO timestamp
  userId: string; // Clerk user ID
}

// Full API key data combining Kong data with local metadata
export interface ApiKey {
  id: string; // Kong key-auth ID
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

// API key with full key (only used immediately after creation)
export interface ApiKeyWithSecret extends ApiKey {
  key: string; // The full API key - only available once!
}

// Request to create a new API key
export interface CreateApiKeyRequest {
  name: string;
}

// Response from creating an API key
export interface CreateApiKeyResponse {
  id: string;
  name: string;
  key: string; // Full key - only returned once!
  keyPrefix: string;
  createdAt: string;
}

// Response from listing API keys
export interface ListApiKeysResponse {
  keys: ApiKey[];
}

// Response from revoking an API key
export interface RevokeApiKeyResponse {
  success: boolean;
  message: string;
}
