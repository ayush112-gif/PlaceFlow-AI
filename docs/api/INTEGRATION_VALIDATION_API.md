# Integration Validation API Documentation

## Overview
This document describes the complete Integration Validation System API for the Placement Communication SaaS platform.

---

## API Endpoints

### 1. Validate Integration
**Endpoint:** `POST /api/integrations/validate`

Validates provider credentials and automatically saves the result to the database.

**Request:**
```bash
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "374cebeb-51d6-4e2e-89c4-147ad4fe1781",
    "provider": "openrouter",
    "config": {
      "api_key": "sk-or-v1-..."
    }
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "status": true,
  "message": "Connection Successful",
  "data": {
    "id": "uuid",
    "user_id": "user-id",
    "provider": "openrouter",
    "api_key": "sk-or-v1-...",
    "status": true,
    "created_at": "2026-06-25T08:00:00.000Z",
    "updated_at": "2026-06-25T08:00:00.000Z"
  }
}
```

**Response (Invalid):**
```json
{
  "success": true,
  "status": false,
  "message": "Invalid Credentials",
  "data": {
    "id": "uuid",
    "user_id": "user-id",
    "provider": "openrouter",
    "status": false,
    "updated_at": "2026-06-25T08:00:00.000Z"
  }
}
```

---

## Provider Configuration

### OpenRouter

**Config Structure:**
```json
{
  "api_key": "sk-or-v1-..."
}
```

**Validation Process:**
1. Sends test request to OpenRouter API
2. Tests with `openai/gpt-4o-mini` model
3. Max tokens: 10

**Status Codes:**
- 200 → Valid
- 401 → Invalid API Key
- 402 → Insufficient Credits
- Other → Connection Failed

**Example:**
```bash
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "provider": "openrouter",
    "config": {
      "api_key": "sk-or-v1-abc123xyz"
    }
  }'
```

---

### Google Gemini

**Config Structure:**
```json
{
  "api_key": "AIzaSyD..."
}
```

**Validation Process:**
1. Sends test request to Gemini API
2. Tests with `gemini-pro` model
3. Test prompt: "Hello"

**Status Codes:**
- 200 → Valid
- 401/403 → Invalid API Key
- Other → Connection Failed

**Example:**
```bash
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "provider": "gemini",
    "config": {
      "api_key": "AIzaSyD..."
    }
  }'
```

---

### Brevo

**Config Structure:**
```json
{
  "api_key": "xkeysib-..."
}
```

**Validation Process:**
1. Fetches account information from Brevo API
2. Endpoint: `https://api.brevo.com/v3/account`
3. Uses `api-key` header

**Status Codes:**
- 200 → Valid
- 401 → Invalid API Key
- Other → Connection Failed

**Example:**
```bash
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "provider": "brevo",
    "config": {
      "api_key": "xkeysib-..."
    }
  }'
```

---

### SMTP

**Config Structure:**
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "your-email@gmail.com",
  "password": "app-password",
  "sender_email": "noreply@yourdomain.com",
  "sender_name": "Your App"
}
```

**Validation Process:**
1. Creates nodemailer transporter
2. Runs `transporter.verify()`
3. Tests connection to SMTP server

**Timeout:** 10 seconds

**Example:**
```bash
curl -X POST https://placeflow-ai.onrender.com//api/integrations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "provider": "smtp",
    "config": {
      "host": "smtp.gmail.com",
      "port": 587,
      "username": "user@gmail.com",
      "password": "app-specific-password",
      "sender_email": "noreply@example.com",
      "sender_name": "Support"
    }
  }'
```

---

## Other Endpoints

### 2. Save Integration (Without Validation)
**Endpoint:** `POST /api/integrations/save`

Saves integration configuration without validation.

**Request:**
```json
{
  "userId": "user-id",
  "provider": "openrouter",
  "config": {
    "api_key": "sk-or-v1-..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Integration saved successfully",
  "data": { /* integration record */ }
}
```

---

### 3. Get All Integrations
**Endpoint:** `GET /api/integrations/:userId`

Fetches all integrations for a user.

**Request:**
```bash
curl https://placeflow-ai.onrender.com//api/integrations/user-id
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "user-id",
      "provider": "openrouter",
      "status": true,
      "api_key": "sk-or-v1-...",
      "updated_at": "2026-06-25T08:00:00.000Z"
    },
    {
      "id": "uuid",
      "user_id": "user-id",
      "provider": "smtp",
      "status": true,
      "host": "smtp.gmail.com",
      "port": 587,
      "username": "user@gmail.com",
      "password": "***",
      "sender_email": "noreply@example.com",
      "sender_name": "Support",
      "updated_at": "2026-06-25T08:00:00.000Z"
    }
  ]
}
```

---

### 4. Delete Integration
**Endpoint:** `DELETE /api/integrations/:userId/:provider`

Deletes a specific integration.

**Request:**
```bash
curl -X DELETE https://placeflow-ai.onrender.com//api/integrations/user-id/openrouter
```

**Response:**
```json
{
  "success": true,
  "message": "Integration deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "status": false,
  "message": "Missing required parameters: userId, provider, config"
}
```

### 400 Unsupported Provider
```json
{
  "success": false,
  "status": false,
  "message": "Unsupported provider: invalid_provider"
}
```

### 500 Database Error
```json
{
  "success": false,
  "status": false,
  "message": "Failed to save integration result"
}
```

### 500 Validation Error
```json
{
  "success": false,
  "status": false,
  "message": "Integration validation failed"
}
```

---

## Frontend Integration Example

### React/TypeScript

```typescript
import { validateIntegration } from "../services/integration.service";

async function handleValidateOpenRouter() {
  try {
    const result = await validateIntegration({
      provider: "openrouter",
      api_key: "sk-or-v1-...",
    });

    if (result.status) {
      console.log("✓ Connected:", result.message);
      setConnected(true);
    } else {
      console.error("✕ Failed:", result.message);
      setConnected(false);
    }
  } catch (error) {
    console.error("Validation error:", error.message);
  }
}
```

---

## Message Reference

### Success Messages
- `"Connection Successful"` - Credentials validated and valid
- `"Integration saved successfully"` - Configuration saved

### Error Messages
- `"Invalid Credentials"` - API key/credentials are incorrect
- `"Insufficient Credits"` - OpenRouter account has insufficient credits
- `"Connection Failed"` - Network or connection error
- `"SMTP credentials are incomplete"` - Missing required SMTP fields
- `"Field API key is required"` - Required field missing

---

## Best Practices

1. **Always validate before saving** - Use `/validate` endpoint which both validates and saves
2. **Handle timeouts gracefully** - 15-second timeout for API validation
3. **Show user feedback** - Display validation status and messages
4. **Secure sensitive data** - Use password inputs for API keys and passwords
5. **Test after update** - Always re-validate after changing credentials

---

## Timeout Specifications

| Provider | Timeout |
|----------|---------|
| OpenRouter | 15 seconds |
| Gemini | 15 seconds |
| Brevo | 15 seconds |
| SMTP | 10 seconds |

---

## Database Schema

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  provider TEXT NOT NULL,
  status BOOLEAN DEFAULT false,
  api_key TEXT,
  host TEXT,
  port INTEGER,
  username TEXT,
  password TEXT,
  sender_email TEXT,
  sender_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider)
);
```

---

## Testing Checklist

- [ ] OpenRouter validation with valid/invalid keys
- [ ] Gemini validation with valid/invalid keys
- [ ] Brevo validation with valid/invalid keys
- [ ] SMTP validation with correct/incorrect credentials
- [ ] Database upsert on validation
- [ ] Frontend UI updates after validation
- [ ] Status badges display correctly
- [ ] Error messages display correctly
- [ ] Loading states show during validation
- [ ] Integrations persist after refresh
