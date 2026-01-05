/**
 * CRM Integration Types
 * Based on PORTAL-001 HubSpot Integration Specification
 */

export type IntegrationType = 'hubspot' | 'salesforce' | 'dynamics' | 'webflow';

export type TestStatus = 'success' | 'failed' | 'pending' | 'not_configured';

/**
 * Full integration object returned from API
 */
export interface Integration {
  id: string;
  integration_type: IntegrationType;
  display_name: string;
  portal_id: string | null;
  is_active: boolean;
  enable_person_enrichment: boolean;
  enable_company_enrichment: boolean;
  auto_writeback_enabled: boolean;
  test_status: TestStatus;
  test_error_message: string | null;
  last_tested_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Rate limit information
 */
export interface RateLimit {
  remaining: number;
  limit: number;
  resets_at?: string;
}

/**
 * Result from testing a connection before saving
 */
export interface ConnectionTestResult {
  connected: boolean;
  integration_type: string;
  portal_id: string | null;
  test_status: string;
  error_message: string | null;
  rate_limit: RateLimit | null;
}

/**
 * Health check response for an integration platform
 */
export interface ConnectionHealth {
  connected: boolean;
  is_connected?: boolean; // Backend may return either
  integration_id: string | null;
  integration_type: string;
  portal_id: string | null;
  account_name: string | null;
  last_tested_at: string | null;
  test_status: string;
  error_message: string | null;
  rate_limit: RateLimit | null;
  timestamp: string;
}

/**
 * Request to test a connection before saving
 */
export interface TestConnectionRequest {
  integrationType: IntegrationType;
  apiKey: string;
}

/**
 * Request to create/save an integration
 */
export interface CreateIntegrationRequest {
  integrationType: IntegrationType;
  displayName: string;
  apiKey: string;
  portalId?: string;
  isActive?: boolean;
}

/**
 * Response from creating an integration
 */
export interface CreateIntegrationResponse {
  id: string;
  integration_type: IntegrationType;
  display_name: string;
  portal_id: string | null;
  is_active: boolean;
  test_status: TestStatus;
  created_at: string;
}

/**
 * List integrations response
 */
export interface IntegrationsListResponse {
  integrations: Integration[];
  total_count: number;
}

/**
 * HubSpot-specific status for the settings card
 */
export interface HubSpotStatus {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  integrationId?: string;
  portalId?: string;
  accountName?: string;
  displayName?: string;
  lastTestedAt?: string;
  testStatus?: TestStatus;
  rateLimit?: RateLimit;
  enablePersonEnrichment?: boolean;
  enableCompanyEnrichment?: boolean;
  autoWritebackEnabled?: boolean;
}
