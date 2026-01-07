# Dashboard Real Data API Specification

**Related Issue**: [#71 - Dashboard Real Data Integration](https://github.com/abm-dev-git/kong-portal/issues/71)
**Status**: Draft
**Author**: Claude Code
**Date**: 2026-01-07

---

## Overview

The dashboard currently displays hardcoded placeholder data. This specification defines the backend API endpoints needed to populate the dashboard with real user data.

## Endpoints Required

### 1. GET /v1/usage/stats

Returns API usage statistics for the authenticated organization.

**Authentication**: Required (Bearer token with org_id claim)

**Request**:
```http
GET /v1/usage/stats
Authorization: Bearer <token>
x-org-id: <organization_id>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "api_calls": {
      "today": 150,
      "this_week": 1250,
      "this_month": 4500,
      "change_percent": 12.5
    },
    "enrichments": {
      "total": 89,
      "successful": 85,
      "failed": 4,
      "pending": 0
    },
    "success_rate": 95.5,
    "period_start": "2026-01-01T00:00:00Z",
    "period_end": "2026-01-07T23:59:59Z"
  }
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Token lacks required org_id claim
- 500 Internal Server Error

---

### 2. GET /v1/api-keys/summary

Returns a summary of API keys for the organization.

**Note**: This complements the existing `/v1/api-keys` endpoint which returns full key details.

**Request**:
```http
GET /v1/api-keys/summary
Authorization: Bearer <token>
x-org-id: <organization_id>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "active_count": 3,
    "total_count": 5,
    "recently_used_count": 2,
    "keys": [
      {
        "name": "Production",
        "last_used_at": "2026-01-07T10:30:00Z",
        "is_active": true
      }
    ]
  }
}
```

---

### 3. GET /v1/enrichments/recent

Returns recent enrichment jobs for the organization.

**Request**:
```http
GET /v1/enrichments/recent?limit=5
Authorization: Bearer <token>
x-org-id: <organization_id>
```

**Query Parameters**:
- `limit` (optional, default: 5, max: 20): Number of results to return

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "enrichments": [
      {
        "id": "enrich-p-abc123",
        "entity_type": "person",
        "entity_name": "Jane Smith",
        "entity_identifier": "jane.smith@acme.com",
        "status": "completed",
        "confidence_score": 0.92,
        "sources_used": ["linkedin", "clearbit"],
        "created_at": "2026-01-07T10:30:00Z",
        "completed_at": "2026-01-07T10:30:15Z"
      },
      {
        "id": "enrich-c-def456",
        "entity_type": "company",
        "entity_name": "Acme Corp",
        "entity_identifier": "acme.com",
        "status": "processing",
        "created_at": "2026-01-07T10:35:00Z"
      }
    ],
    "total_count": 89
  }
}
```

**Status Values**: `pending`, `processing`, `completed`, `failed`

---

### 4. GET /v1/integrations/status

Returns the connection status of all integrations for the organization.

**Request**:
```http
GET /v1/integrations/status
Authorization: Bearer <token>
x-org-id: <organization_id>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "integrations": {
      "linkedin": {
        "status": "connected",
        "connected_at": "2026-01-05T14:30:00Z",
        "profile_name": "John Doe",
        "last_verified_at": "2026-01-07T08:00:00Z"
      },
      "hubspot": {
        "status": "connected",
        "connected_at": "2026-01-03T10:00:00Z",
        "portal_id": "12345678",
        "sync_enabled": true
      },
      "salesforce": {
        "status": "disconnected"
      },
      "dynamics": {
        "status": "disconnected"
      }
    }
  }
}
```

**Status Values**: `connected`, `disconnected`, `pending`, `error`

---

## Frontend Integration

### New Hook: useDashboardStats

Location: `lib/hooks/useDashboardStats.ts`

```typescript
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createApiClient } from "@/lib/api-client";

interface DashboardStats {
  apiCalls: { today: number; thisWeek: number; thisMonth: number; changePercent: number };
  enrichments: { total: number; successful: number; failed: number };
  successRate: number;
  activeKeys: number;
  recentEnrichments: Array<{
    id: string;
    entityType: "person" | "company";
    entityName: string;
    status: string;
    createdAt: string;
  }>;
  integrations: {
    linkedin: { status: string };
    hubspot: { status: string };
    salesforce: { status: string };
    dynamics: { status: string };
  };
}

export function useDashboardStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await getToken();
        const api = createApiClient(token);

        const [usageResult, keysResult, enrichmentsResult, integrationsResult] =
          await Promise.all([
            api.get("/v1/usage/stats"),
            api.get("/v1/api-keys/summary"),
            api.get("/v1/enrichments/recent?limit=5"),
            api.get("/v1/integrations/status"),
          ]);

        // Transform and combine results
        setStats({
          apiCalls: usageResult.data?.api_calls || { today: 0, thisWeek: 0, thisMonth: 0, changePercent: 0 },
          enrichments: usageResult.data?.enrichments || { total: 0, successful: 0, failed: 0 },
          successRate: usageResult.data?.success_rate || 0,
          activeKeys: keysResult.data?.active_count || 0,
          recentEnrichments: enrichmentsResult.data?.enrichments || [],
          integrations: integrationsResult.data?.integrations || {},
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [getToken]);

  return { stats, isLoading, error };
}
```

---

## Kong Gateway Routes

Add these routes to Kong configuration:

```yaml
# Dashboard Stats Routes
- name: usage-stats
  paths:
    - ~/v1/usage/stats$
  service: abm-dev-api
  methods:
    - GET

- name: api-keys-summary
  paths:
    - ~/v1/api-keys/summary$
  service: abm-dev-api
  methods:
    - GET

- name: enrichments-recent
  paths:
    - ~/v1/enrichments/recent$
  service: abm-dev-api
  methods:
    - GET

- name: integrations-status
  paths:
    - ~/v1/integrations/status$
  service: abm-dev-api
  methods:
    - GET
```

---

## Database Queries (Reference)

### Usage Stats Query
```sql
SELECT
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as this_week,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as this_month
FROM halo.api_requests
WHERE org_id = $1;
```

### Enrichments Query
```sql
SELECT
  id, entity_type, entity_name, entity_identifier, status,
  confidence_score, sources_used, created_at, completed_at
FROM halo.enrichment_jobs
WHERE org_id = $1
ORDER BY created_at DESC
LIMIT $2;
```

---

## Implementation Priority

1. **GET /v1/usage/stats** - Core dashboard metric
2. **GET /v1/enrichments/recent** - Activity feed
3. **GET /v1/integrations/status** - Already partially exists via individual endpoints
4. **GET /v1/api-keys/summary** - Enhancement to existing endpoint

---

## Related Documents
- [#71 Dashboard Real Data Integration](https://github.com/abm-dev-git/kong-portal/issues/71)
- [Dashboard Components](/data/code/kong-portal/components/dashboard/)
- [API Client](/data/code/kong-portal/lib/api-client.ts)
