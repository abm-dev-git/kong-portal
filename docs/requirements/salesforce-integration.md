# Salesforce Integration Requirements

> **GitHub Issues**: [#65 UI](https://github.com/abm-dev-git/kong-portal/issues/65), [#66 Backend](https://github.com/abm-dev-git/kong-portal/issues/66)
> **Epic**: [#62 CRM Integrations](https://github.com/abm-dev-git/kong-portal/issues/62)

## Overview

Enable users to connect their Salesforce org to sync contacts, accounts, leads, and opportunities with ABM.dev.

## Authentication

### Method: OAuth 2.0 Web Server Flow

Salesforce uses OAuth 2.0 for authentication. Users authorize via Salesforce login page.

**Flow:**
1. User clicks "Connect with Salesforce"
2. Redirect to Salesforce authorization URL
3. User logs in and grants permissions
4. Callback receives authorization code
5. Exchange code for access + refresh tokens
6. Store refresh token for long-term access

### Connected App Setup
Users must create a Connected App in Salesforce:
1. Setup > App Manager > New Connected App
2. Enable OAuth Settings
3. Set callback URL: `https://dev.abm.dev/api/integrations/salesforce/callback`
4. Select OAuth scopes

### Required OAuth Scopes
- `api` - Access REST API
- `refresh_token` - Offline access
- `id` - Identity information

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/salesforce/auth/url` | Generate OAuth URL |
| `GET` | `/v1/salesforce/auth/callback` | Handle OAuth callback |
| `GET` | `/v1/crm/config/platforms/salesforce/health` | Check connection |
| `DELETE` | `/v1/crm/config/integrations/{id}` | Disconnect |
| `POST` | `/v1/crm/sync/salesforce/contacts` | Sync contacts |
| `POST` | `/v1/crm/sync/salesforce/accounts` | Sync accounts |
| `POST` | `/v1/crm/sync/salesforce/leads` | Sync leads |

### Request/Response Examples

**Get Auth URL:**
```json
GET /v1/salesforce/auth/url

Response:
{
  "success": true,
  "data": {
    "authUrl": "https://login.salesforce.com/services/oauth2/authorize?client_id=...&redirect_uri=...&response_type=code"
  }
}
```

**OAuth Callback:**
```
GET /v1/salesforce/auth/callback?code=xxxxxxxx

Redirect to: /settings/salesforce?status=connected
```

**Health Check:**
```json
GET /v1/crm/config/platforms/salesforce/health

Response:
{
  "success": true,
  "data": {
    "connected": true,
    "integration_id": "int_789",
    "organization_id": "00D000000000000",
    "instance_url": "https://na1.salesforce.com",
    "username": "admin@company.com",
    "last_sync": "2024-01-05T12:00:00Z",
    "api_usage": {
      "used": 1500,
      "limit": 15000,
      "reset_at": "2024-01-06T00:00:00Z"
    }
  }
}
```

## Salesforce REST API Reference

### Base URL
```
https://{instance}.salesforce.com/services/data/v58.0/
```

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /sobjects/Contact` | List contacts |
| `GET /sobjects/Account` | List accounts |
| `GET /sobjects/Lead` | List leads |
| `GET /sobjects/Opportunity` | List opportunities |
| `GET /limits` | API usage limits |
| `GET /services/oauth2/userinfo` | Current user info |

### SOQL Query Examples

**Get Contacts:**
```sql
SELECT Id, FirstName, LastName, Email, Phone, Title, AccountId
FROM Contact
LIMIT 100
```

**Get Accounts:**
```sql
SELECT Id, Name, Website, Industry, NumberOfEmployees, BillingCity
FROM Account
LIMIT 100
```

## UI Components

### New Components Required

| Component | File | Description |
|-----------|------|-------------|
| Settings Card | `components/settings/SalesforceSettingsCard.tsx` | Connection status |
| Connect Modal | `components/settings/ConnectSalesforceModal.tsx` | OAuth initiation |
| Status Hook | `lib/hooks/useSalesforceStatus.ts` | Status polling |
| Settings Page | `app/(protected)/settings/salesforce/page.tsx` | Page wrapper |

### Connect Modal Flow
OAuth flow is simpler than HubSpot (no token input):
1. **Idle**: "Connect with Salesforce" button
2. **Connecting**: Spinner + "Redirecting to Salesforce..."
3. **Connected**: Success message (from callback redirect)
4. **Error**: Error message with retry

### Status Display
When connected:
- Organization ID
- Instance URL
- Connected username
- Last sync timestamp
- API usage (used/limit)

### Brand Styling
- **Color**: `#00A1E0` (Salesforce cloud blue)
- **Icon**: Salesforce cloud logo

## Data Sync

### Contact Fields
| Salesforce Field | ABM.dev Field |
|------------------|---------------|
| `FirstName` | `first_name` |
| `LastName` | `last_name` |
| `Email` | `email` |
| `Phone` | `phone` |
| `Title` | `job_title` |
| `AccountId` | `company_id` |

### Account Fields
| Salesforce Field | ABM.dev Field |
|------------------|---------------|
| `Name` | `company_name` |
| `Website` | `website` |
| `Industry` | `industry` |
| `NumberOfEmployees` | `employee_count` |
| `BillingCity` | `city` |

### Lead Fields
| Salesforce Field | ABM.dev Field |
|------------------|---------------|
| `FirstName` | `first_name` |
| `LastName` | `last_name` |
| `Email` | `email` |
| `Company` | `company_name` |
| `Status` | `lead_status` |

### Opportunity Fields (Optional)
| Salesforce Field | ABM.dev Field |
|------------------|---------------|
| `Name` | `opportunity_name` |
| `Amount` | `deal_value` |
| `StageName` | `stage` |
| `CloseDate` | `expected_close` |

## Error Handling

| Error | Meaning | User Message |
|-------|---------|--------------|
| `invalid_grant` | Token expired/revoked | "Your Salesforce connection expired. Please reconnect." |
| `INVALID_SESSION_ID` | Session invalid | "Session expired. Please reconnect to Salesforce." |
| `REQUEST_LIMIT_EXCEEDED` | API limit hit | "Salesforce API limit reached. Please try again tomorrow." |
| `INSUFFICIENT_ACCESS` | Missing permissions | "Missing required permissions. Please check your Salesforce profile." |

## Token Management

### Token Lifecycle
1. **Access Token**: Valid for ~2 hours
2. **Refresh Token**: Valid indefinitely (until revoked)
3. **Token Refresh**: Automatic before expiry

### Refresh Flow
```
POST https://login.salesforce.com/services/oauth2/token

grant_type=refresh_token
refresh_token={stored_refresh_token}
client_id={client_id}
client_secret={client_secret}
```

## Security Considerations

1. **Refresh Token Storage**: Encrypted at rest
2. **PKCE Support**: Use PKCE for added security (optional)
3. **Callback Validation**: Verify state parameter
4. **Token Rotation**: Handle token revocation gracefully

## Environment Variables

```env
SALESFORCE_CLIENT_ID=3MVG9...
SALESFORCE_CLIENT_SECRET=xxxxxxxx
SALESFORCE_CALLBACK_URL=https://dev.abm.dev/api/integrations/salesforce/callback
```

## Testing

### E2E Test Cases
1. OAuth redirect opens Salesforce login
2. Callback processes code correctly
3. Refresh token persisted
4. Status displays org info
5. Disconnect revokes tokens

### Sandbox Testing
Use Salesforce Developer Edition or sandbox:
- Login URL: `https://test.salesforce.com`
- Free Developer Edition: [developer.salesforce.com](https://developer.salesforce.com)

## Implementation Checklist

- [ ] Settings page at `/settings/salesforce`
- [ ] SalesforceSettingsCard component
- [ ] ConnectSalesforceModal component
- [ ] useSalesforceStatus hook
- [ ] OAuth authorization URL generator
- [ ] OAuth callback handler
- [ ] Refresh token management
- [ ] Salesforce REST API client
- [ ] Contact sync endpoint
- [ ] Account sync endpoint
- [ ] E2E tests

## References

- [Salesforce OAuth 2.0 Web Server Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm)
- [Salesforce REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- [Connected Apps](https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm)
- [SOQL Reference](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/)
