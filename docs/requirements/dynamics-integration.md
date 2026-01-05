# MS Dynamics 365 Integration Requirements

> **GitHub Issues**: [#63 UI](https://github.com/abm-dev-git/kong-portal/issues/63), [#64 Backend](https://github.com/abm-dev-git/kong-portal/issues/64)
> **Epic**: [#62 CRM Integrations](https://github.com/abm-dev-git/kong-portal/issues/62)

## Overview

Enable users to connect their Microsoft Dynamics 365 CRM to sync contacts, accounts, and leads with ABM.dev.

## Authentication

### Method: Azure AD OAuth 2.0 (Application)

Dynamics 365 uses Azure Active Directory for authentication. We support Application (Service Principal) authentication.

**Required Azure AD Setup:**
1. Register Application in Azure Portal
2. Add Dynamics 365 API permissions
3. Generate Client Secret
4. Grant admin consent

### Credentials Required
| Field | Description |
|-------|-------------|
| Tenant ID | Azure AD tenant identifier |
| Client ID | Application (client) ID |
| Client Secret | Application secret |
| Environment URL | e.g., `https://org.crm.dynamics.com` |

### OAuth Flow
```
POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token

grant_type=client_credentials
client_id={client_id}
client_secret={client_secret}
scope=https://{org}.crm.dynamics.com/.default
```

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/crm/config/integrations` | Store Dynamics credentials |
| `GET` | `/v1/crm/config/platforms/dynamics/health` | Check connection status |
| `DELETE` | `/v1/crm/config/integrations/{id}` | Disconnect integration |
| `POST` | `/v1/crm/sync/dynamics/contacts` | Sync contacts |
| `POST` | `/v1/crm/sync/dynamics/accounts` | Sync accounts |
| `POST` | `/v1/crm/sync/dynamics/leads` | Sync leads |

### Request/Response Examples

**Connect Integration:**
```json
POST /v1/crm/config/integrations
{
  "integration_type": "dynamics",
  "display_name": "Contoso Dynamics",
  "credentials": {
    "tenant_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "client_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "client_secret": "xxxxxxxxxxxxxxxxxxxxx",
    "environment_url": "https://contoso.crm.dynamics.com"
  },
  "is_active": true
}

Response:
{
  "success": true,
  "data": {
    "id": "int_456",
    "integration_type": "dynamics",
    "is_active": true,
    "created_at": "2024-01-05T00:00:00Z"
  }
}
```

**Health Check:**
```json
GET /v1/crm/config/platforms/dynamics/health

Response:
{
  "success": true,
  "data": {
    "connected": true,
    "integration_id": "int_456",
    "organization_name": "Contoso",
    "environment": "Production",
    "environment_url": "https://contoso.crm.dynamics.com",
    "last_sync": "2024-01-05T12:00:00Z",
    "version": "9.2.0"
  }
}
```

## Dynamics Web API Reference

### Base URL
```
https://{org}.api.crm.dynamics.com/api/data/v9.2/
```

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /contacts` | List contacts |
| `GET /accounts` | List accounts |
| `GET /leads` | List leads |
| `GET /WhoAmI` | Validate connection |
| `GET /RetrieveVersion` | Get system version |

### OData Query Examples

**Get Contacts:**
```
GET /api/data/v9.2/contacts?$select=fullname,emailaddress1,telephone1,jobtitle&$top=100
```

**Get Accounts:**
```
GET /api/data/v9.2/accounts?$select=name,websiteurl,numberofemployees,industrycode&$top=100
```

## UI Components

### New Components Required

| Component | File | Description |
|-----------|------|-------------|
| Settings Card | `components/settings/DynamicsSettingsCard.tsx` | Connection status and actions |
| Connect Modal | `components/settings/ConnectDynamicsModal.tsx` | Credential input form |
| Status Hook | `lib/hooks/useDynamicsStatus.ts` | Status polling |
| Settings Page | `app/(protected)/settings/dynamics/page.tsx` | Page wrapper |

### Connect Modal Fields
1. **Tenant ID** - Azure AD tenant
2. **Client ID** - Application ID
3. **Client Secret** - Password field with visibility toggle
4. **Environment URL** - Dropdown or text input

### Status Display
When connected:
- Organization name
- Environment type (Production/Sandbox)
- Environment URL
- Last sync timestamp
- Dynamics version

### Brand Styling
- **Color**: `#002050` (MS Dynamics dark blue)
- **Icon**: Microsoft Dynamics logo or generic CRM icon

## Data Sync

### Contact Fields
| Dynamics Field | ABM.dev Field |
|----------------|---------------|
| `fullname` | `full_name` |
| `emailaddress1` | `email` |
| `telephone1` | `phone` |
| `jobtitle` | `job_title` |
| `parentcustomerid` | `company_id` |

### Account Fields
| Dynamics Field | ABM.dev Field |
|----------------|---------------|
| `name` | `company_name` |
| `websiteurl` | `website` |
| `numberofemployees` | `employee_count` |
| `industrycode` | `industry` |
| `address1_city` | `city` |

### Lead Fields
| Dynamics Field | ABM.dev Field |
|----------------|---------------|
| `fullname` | `full_name` |
| `emailaddress1` | `email` |
| `companyname` | `company_name` |
| `leadqualitycode` | `quality_score` |

## Error Handling

| Error | Meaning | User Message |
|-------|---------|--------------|
| `AADSTS700016` | Invalid client ID | "Invalid Application ID. Please check your Azure AD app registration." |
| `AADSTS7000215` | Invalid client secret | "Invalid Client Secret. Please generate a new one in Azure Portal." |
| `AADSTS90002` | Invalid tenant | "Tenant not found. Please verify your Tenant ID." |
| `403 Forbidden` | Missing permissions | "Missing required permissions. Please grant admin consent in Azure Portal." |

## Security Considerations

1. **Credential Encryption**: Client secrets encrypted at rest
2. **Token Caching**: Cache access tokens (60 min expiry)
3. **Minimal Permissions**: Request only required Dynamics scopes
4. **Audit Logging**: Log all sync operations

## Environment Variables

```env
# Optional: Default tenant for single-tenant setups
DYNAMICS_DEFAULT_TENANT_ID=
```

## Testing

### E2E Test Cases
1. Connect with valid credentials
2. Reject invalid tenant ID
3. Display organization info when connected
4. Handle token refresh correctly
5. Disconnect and cleanup tokens

### Mock Credentials
For development:
```json
{
  "tenant_id": "test-tenant-id",
  "client_id": "test-client-id",
  "client_secret": "test-secret",
  "environment_url": "https://test.crm.dynamics.com"
}
```

## Implementation Checklist

- [ ] Settings page at `/settings/dynamics`
- [ ] DynamicsSettingsCard component
- [ ] ConnectDynamicsModal component
- [ ] useDynamicsStatus hook
- [ ] Backend OAuth token acquisition
- [ ] Dynamics Web API client
- [ ] Contact sync endpoint
- [ ] Account sync endpoint
- [ ] E2E tests

## References

- [Dynamics 365 Web API](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/web-api-reference)
- [Azure AD OAuth 2.0](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow)
- [Dynamics 365 Permissions](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/use-multi-tenant-server-to-server-authentication)
