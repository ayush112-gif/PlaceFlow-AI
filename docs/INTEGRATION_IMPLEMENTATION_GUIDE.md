# Integration Validation System - Implementation Guide

## Quick Start

### Backend Setup

The following files have been created/updated:

1. **Validation Service:** `server/src/services/validation.service.js`
   - Contains validators for all 4 providers
   - Returns consistent response format

2. **Integration Routes:** `server/src/routes/integration.routes.js`
   - POST `/api/integrations/validate` - Validate credentials
   - POST `/api/integrations/save` - Save without validation
   - GET `/api/integrations/:userId` - Get all integrations
   - DELETE `/api/integrations/:userId/:provider` - Delete integration

### Frontend Setup

1. **Integrations Page:** `client/client/src/pages/Integrations.tsx`
   - Modern card-based UI
   - Real-time validation feedback
   - Status badges and error handling

2. **Integration Service:** `client/client/src/services/integration.service.ts`
   - Functions for validating, saving, and fetching integrations

---

## File Structure

```
server/
├── src/
│   ├── services/
│   │   └── validation.service.js         ← NEW
│   └── routes/
│       └── integration.routes.js         ← UPDATED

client/client/
├── src/
│   ├── pages/
│   │   └── Integrations.tsx              ← UPDATED (Major UI overhaul)
│   └── services/
│       └── integration.service.ts        ← UPDATED
```

---

## Testing the API

### 1. Start the Server

```bash
cd server
npm install  # if needed
node src/index.js
```

Expected output:
```
✓ Integration route registered at /api/integrations
Server running on port 5000
```

### 2. Test OpenRouter Validation

```bash
# Get your OpenRouter API key from https://openrouter.ai/keys

curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "provider": "openrouter",
    "config": {
      "api_key": "sk-or-v1-YOUR_ACTUAL_KEY"
    }
  }'
```

Expected response (Valid):
```json
{
  "success": true,
  "status": true,
  "message": "Connection Successful",
  "data": {
    "id": "...",
    "user_id": "test-user-123",
    "provider": "openrouter",
    "status": true,
    "updated_at": "..."
  }
}
```

Expected response (Invalid):
```json
{
  "success": true,
  "status": false,
  "message": "Invalid Credentials",
  "data": {
    "user_id": "test-user-123",
    "provider": "openrouter",
    "status": false
  }
}
```

### 3. Test Gemini Validation

```bash
# Get your Gemini API key from https://makersuite.google.com/app/apikey

curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "provider": "gemini",
    "config": {
      "api_key": "AIzaSyD_YOUR_ACTUAL_KEY"
    }
  }'
```

### 4. Test Brevo Validation

```bash
# Get your Brevo API key from https://app.brevo.com/settings/account/api

curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "provider": "brevo",
    "config": {
      "api_key": "xkeysib-YOUR_ACTUAL_KEY"
    }
  }'
```

### 5. Test SMTP Validation

```bash
# Test with Gmail
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "provider": "smtp",
    "config": {
      "host": "smtp.gmail.com",
      "port": 587,
      "username": "your-email@gmail.com",
      "password": "app-specific-password",
      "sender_email": "noreply@example.com",
      "sender_name": "Placement SaaS"
    }
  }'
```

For Gmail, use an App Password:
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in the SMTP config

### 6. Get All Integrations

```bash
curl https://placeflow-ai.onrender.com//api/integrations/test-user-123
```

### 7. Delete an Integration

```bash
curl -X DELETE https://placeflow-ai.onrender.com//api/integrations/test-user-123/openrouter
```

---

## Frontend Testing

### 1. Start the Client

```bash
cd client/client
npm run dev
```

### 2. Navigate to Integrations Page

- Go to http://localhost:5173/integrations
- You should see:
  - AI Providers section (OpenRouter, Gemini)
  - Email Providers section (Brevo)
  - SMTP Settings section

### 3. Test Validation Flow

1. **For OpenRouter/Gemini/Brevo:**
   - Enter your API key in the password input
   - Click "Validate & Save"
   - Watch for loading state
   - Check for success (green badge) or error (red badge) message

2. **For SMTP:**
   - Fill all required fields
   - Click "Validate & Save"
   - Watch for loading state
   - Check for success (green badge) or error (red badge) message

### 4. Verify Status Persistence

- Refresh the page
- Status badges should persist based on database state
- Previously entered values should be visible

---

## Response Format

All validation endpoints return this format:

### Success (Valid Credentials)
```json
{
  "success": true,
  "status": true,
  "message": "Connection Successful",
  "data": { /* integration record */ }
}
```

### Success (Invalid Credentials)
```json
{
  "success": true,
  "status": false,
  "message": "Invalid Credentials",
  "data": { /* integration record */ }
}
```

### Error
```json
{
  "success": false,
  "status": false,
  "message": "Error description",
  "data": null
}
```

---

## Database Schema

The system uses this Supabase table:

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  status BOOLEAN DEFAULT false,
  api_key TEXT,
  host TEXT,
  port INTEGER,
  username TEXT,
  password TEXT,
  sender_email TEXT,
  sender_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);
```

---

## Key Features

✅ **Real-time Validation** - Credentials validated before saving
✅ **Consistent Response Format** - All providers return same structure
✅ **Status Persistence** - Integration status stored in database
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback during validation
✅ **Status Badges** - Connected/Disconnected indicators
✅ **Timeout Protection** - All validators have 10-15 second timeouts
✅ **Secure** - Sensitive fields use password inputs

---

## Troubleshooting

### OpenRouter Validation Fails

1. Verify API key is valid: https://openrouter.ai/keys
2. Check account credit: https://openrouter.ai/account/balance
3. Ensure key has proper permissions

### Gemini Validation Fails

1. Verify API key: https://makersuite.google.com/app/apikey
2. Check if project has Generative AI API enabled
3. Ensure API key is for Google Cloud project

### Brevo Validation Fails

1. Verify API key: https://app.brevo.com/settings/account/api
2. Check if API key is master key or has required permissions
3. Ensure email is verified in Brevo account

### SMTP Validation Fails

1. Verify SMTP credentials with your provider
2. For Gmail, use App Password (not main password)
3. Check firewall/network access to SMTP server
4. Verify port 587 (TLS) or 465 (SSL) is accessible

---

## Frontend UI Behavior

The Integrations page includes:

1. **Input Fields**
   - Password inputs for API keys (masked)
   - Text inputs for SMTP configuration

2. **Buttons**
   - "Validate & Save" - Validates and saves in one action
   - Disabled during validation (shows "Validating...")

3. **Status Display**
   - Green badge: "✓ Connected" when validation passes
   - Red badge: "✕ Disconnected" when validation fails
   - Status message with specific error details

4. **Visual Feedback**
   - Loading spinner/text during API call
   - Color-coded status messages (green/red)
   - Smooth transitions and hover effects

---

## Security Considerations

1. **API Keys** - Stored in Supabase (with row-level security)
2. **Passwords** - SMTP passwords stored encrypted
3. **Frontend** - API keys/passwords never logged to console
4. **Validation** - Occurs server-side before storage
5. **Timeouts** - All validators have connection timeouts to prevent hangs

---

## Next Steps

1. Test all provider validations with real API keys
2. Verify database persistence
3. Test error scenarios (invalid keys, timeout, network errors)
4. Integrate with email sending flow
5. Monitor validation API usage and performance
