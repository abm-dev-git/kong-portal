# HubSpot Integration Requirements

> **GitHub Issue**: [#44](https://github.com/abm-dev-git/kong-portal/issues/44)
> **Epic**: [#62 CRM Integrations](https://github.com/abm-dev-git/kong-portal/issues/62)

## Overview

Enable users to connect their HubSpot account to sync CRM data with ABM.dev for lead enrichment and content personalization.

## Authentication

### Method: Private App Tokens (PAT)

HubSpot Private Apps provide scoped API access without OAuth complexity.

**Token Format:**
```
pat-(na1|eu1|ap1)-[a-f0-9-]+
```

**Example:** `pat-na1-12345678-abcd-1234-efgh-567890abcdef`

### Required Scopes
- `crm.objects.contacts.read` - Read contact records
- `crm.objects.companies.read` - Read company records
- `crm.objects.deals.read` - Read deal records (optional)

### Setup Instructions for Users
1. Go to HubSpot > Settings > Integrations > Private Apps
2. Create new Private App with name "ABM.dev Integration"
3. Select required scopes
4. Copy the generated token

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/crm/config/integrations` | Store HubSpot token |
| `GET` | `/v1/crm/config/platforms/hubspot/health` | Check connection status |
| `DELETE` | `/v1/crm/config/integrations/{id}` | Disconnect integration |
| `POST` | `/v1/crm/sync/hubspot/contacts` | Sync contacts |
| `POST` | `/v1/crm/sync/hubspot/companies` | Sync companies |

### Request/Response Examples

**Connect Integration:**
```json
POST /v1/crm/config/integrations
{
  "integration_type": "hubspot",
  "display_name": "My HubSpot Account",
  "api_key": "pat-na1-...",
  "is_active": true
}

Response:
{
  "success": true,
  "data": {
    "id": "int_123",
    "integration_type": "hubspot",
    "is_active": true,
    "created_at": "2024-01-05T00:00:00Z"
  }
}
```

**Health Check:**
```json
GET /v1/crm/config/platforms/hubspot/health

Response:
{
  "success": true,
  "data": {
    "connected": true,
    "integration_id": "int_123",
    "portal_id": "12345678",
    "last_sync": "2024-01-05T12:00:00Z",
    "rate_limit": {
      "remaining": 4500,
      "limit": 5000,
      "reset_at": "2024-01-05T13:00:00Z"
    }
  }
}
```

## HubSpot API Reference

### Base URL
```
https://api.hubapi.com
```

### Key Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /crm/v3/objects/contacts` | List contacts |
| `GET /crm/v3/objects/companies` | List companies |
| `GET /account-info/v3/details` | Get portal info |
| `GET /oauth/v1/access-tokens/{token}` | Validate token |

### Rate Limits
- **Standard**: 100 requests/10 seconds per private app
- **Burst**: 110 requests/10 seconds
- Headers: `X-HubSpot-RateLimit-Daily-Remaining`

## UI Components

### Existing Components (Frontend Complete)

| Component | File | Status |
|-----------|------|--------|
| Settings Card | `components/settings/HubSpotSettingsCard.tsx` | ✅ Complete |
| Connect Modal | `components/settings/ConnectHubSpotModal.tsx` | ✅ Complete |
| Status Hook | `lib/hooks/useHubSpotStatus.ts` | ✅ Complete |
| Empty State | `components/ui/empty-state.tsx` | ✅ Complete |

### Status Display
When connected, display:
- Portal ID
- Last sync timestamp
- API rate limit (remaining/total)
- Connection status badge

## Data Sync

### Contact Fields Synced
| HubSpot Field | ABM.dev Field |
|---------------|---------------|
| `email` | `email` |
| `firstname` | `first_name` |
| `lastname` | `last_name` |
| `company` | `company_name` |
| `jobtitle` | `job_title` |
| `phone` | `phone` |

### Company Fields Synced
| HubSpot Field | ABM.dev Field |
|---------------|---------------|
| `name` | `company_name` |
| `domain` | `website` |
| `industry` | `industry` |
| `numberofemployees` | `employee_count` |

## Error Handling

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| `401` | Invalid token | "Invalid HubSpot token. Please check your Private App settings." |
| `403` | Insufficient scopes | "Missing required permissions. Please add the required scopes to your Private App." |
| `429` | Rate limited | "Rate limit exceeded. Please wait and try again." |

## Security Considerations

1. **Token Storage**: Encrypted at rest, never logged
2. **Token Display**: Show only last 8 characters after connection
3. **Scope Validation**: Verify required scopes before accepting token
4. **Audit Logging**: Log all connection/disconnection events

## Testing

### E2E Test Cases
1. Connect with valid token
2. Reject invalid token format
3. Display connection status correctly
4. Disconnect and confirm removal
5. Handle rate limit errors gracefully

### Mock Data
Use HubSpot's test portal ID: `12345678` for development.

## Implementation Status

- [x] Frontend UI components
- [ ] Backend API routes
- [ ] Token validation logic
- [ ] Sync endpoints
- [ ] E2E tests
