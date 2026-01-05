# LinkedIn Integration Requirements

> **GitHub Issue**: [#43](https://github.com/abm-dev-git/kong-portal/issues/43)
> **Epic**: [#62 CRM Integrations](https://github.com/abm-dev-git/kong-portal/issues/62)

## Overview

Enable users to connect their LinkedIn account via Browserbase for profile data access and prospecting capabilities.

## Authentication

### Method: Browserbase Session-Based Auth

LinkedIn does not provide public API access for scraping profiles. We use Browserbase to automate a browser session where users log in manually.

**Flow:**
1. User clicks "Connect LinkedIn"
2. System creates Browserbase session
3. Opens LinkedIn login in new browser window
4. User logs in manually
5. System verifies session and extracts profile data
6. Session maintained for future requests

### Why Browserbase?
- Headless browser automation
- LinkedIn login requires real browser environment
- Session persistence for ongoing access
- Handles 2FA and captchas via live view

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/linkedin-connection/initialize` | Create Browserbase session |
| `POST` | `/v1/linkedin-connection/verify` | Verify user completed login |
| `GET` | `/v1/linkedin-connection/status` | Check connection status |
| `DELETE` | `/v1/linkedin-connection` | Disconnect and close session |

### Request/Response Examples

**Initialize Session:**
```json
POST /v1/linkedin-connection/initialize

Response:
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "sessionUrl": "https://live.browserbase.io/sess_abc123",
    "status": "waiting"
  }
}
```

**Verify Session:**
```json
POST /v1/linkedin-connection/verify
{
  "sessionId": "sess_abc123"
}

Response:
{
  "success": true,
  "data": {
    "status": "connected",
    "linkedInProfileName": "John Doe",
    "linkedInProfileUrl": "https://linkedin.com/in/johndoe",
    "connectedAt": "2024-01-05T00:00:00Z"
  }
}
```

## Browserbase Integration

### SDK Setup
```typescript
import { Browserbase } from '@browserbase/sdk';

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});
```

### Session Lifecycle

| State | Description |
|-------|-------------|
| `initializing` | Session being created |
| `waiting` | Waiting for user to log in |
| `verifying` | Checking if login succeeded |
| `connected` | Successfully logged in |
| `error` | Login failed or session expired |

### Live View
Users see a real browser window at:
```
https://live.browserbase.io/{sessionId}
```

## UI Components

### Existing Components (Frontend Complete)

| Component | File | Status |
|-----------|------|--------|
| Settings Card | `components/settings/LinkedInSettingsCard.tsx` | ✅ Complete |
| Connect Modal | `components/settings/ConnectLinkedInModal.tsx` | ✅ Complete |
| Status Hook | `lib/hooks/useLinkedInStatus.ts` | ✅ Complete |
| Status Badge | `components/settings/LinkedInStatusBadge.tsx` | ✅ Complete |

### Modal Flow
1. **Idle**: "Connect LinkedIn" button
2. **Initializing**: "Creating secure browser session..."
3. **Waiting**: "Login Window Opened" + "Reopen" button
4. **Verifying**: "Verifying your login..."
5. **Connected**: Success message, auto-close
6. **Error**: Error message with retry option

### Status Display
When connected:
- Profile name
- Profile URL (clickable link)
- Connected at timestamp

## Profile Data Extraction

### Data to Scrape
| Field | Selector/Method |
|-------|-----------------|
| Name | Profile header |
| Headline | Below name |
| Profile URL | URL bar |
| Profile Photo | Avatar image |

### Scraping Considerations
- Use Playwright within Browserbase session
- Respect LinkedIn's terms of service
- Rate limit requests
- Handle session expiration gracefully

## Error Handling

| Error | Meaning | User Action |
|-------|---------|-------------|
| Session timeout | User didn't login in time | Retry with new session |
| Login failed | Invalid credentials | Try again |
| Rate limited | Too many requests | Wait and retry |
| Session expired | Long inactive period | Reconnect |

## Security Considerations

1. **No Password Storage**: We never see user credentials
2. **Session Isolation**: Each user gets separate browser session
3. **Secure Transport**: All Browserbase connections over HTTPS
4. **Session Cleanup**: Close inactive sessions after 30 minutes

## Environment Variables

```env
BROWSERBASE_API_KEY=bb_live_xxxxx
BROWSERBASE_PROJECT_ID=proj_xxxxx
```

## Testing

### E2E Test Cases
1. Initialize session creates valid Browserbase session
2. Modal shows live view URL
3. Verify detects successful login
4. Status displays profile info correctly
5. Disconnect closes session

### Mock Mode
For testing without Browserbase:
- Mock `sessionUrl` with placeholder
- Simulate `connected` state after 3 seconds

## Implementation Status

- [x] Frontend UI components
- [ ] Browserbase session creation
- [ ] Session verification logic
- [ ] Profile data extraction
- [ ] Session cleanup cron job
- [ ] E2E tests

## References

- [Browserbase Documentation](https://docs.browserbase.com)
- [Browserbase SDK](https://github.com/browserbase/sdk-node)
- [LinkedIn Profile Structure](https://www.linkedin.com/help/)
