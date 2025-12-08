# ID Card & Certificate QR Verification System

> **Version:** 2.0  
> **Last Updated:** December 8, 2025  
> **Author:** EduHub Development Team

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Token Generation (AES-256-GCM)](#3-token-generation-aes-256-gcm)
4. [QR Code Generation](#4-qr-code-generation)
5. [URL Structure](#5-url-structure)
6. [Verification Flow](#6-verification-flow)
7. [Security Features](#7-security-features)
8. [API Endpoints](#8-api-endpoints)
9. [Database Schema](#9-database-schema)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

The EduHub QR Verification System provides secure, tamper-proof verification of student ID cards and certificates. When scanned, QR codes lead to a verification page that displays authentic student/certificate information.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔐 AES-256-GCM Encryption | Military-grade authenticated encryption |
| 🌐 Base64URL Encoding | URL-safe tokens without special characters |
| ⏱️ Time-Limited | Tokens expire after configurable period (default: 1 year) |
| 🛡️ Tamper-Proof | GCM authentication tag prevents modification |
| 📱 Mobile-Friendly | Verification pages work on all devices |
| 🔄 Dual Token Support | Supports both AES tokens and legacy database tokens |

---

## 2. System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Admin Panel   │────▶│  Token Generator │────▶│   QR Code API   │
│  (JavaScript)   │     │    (Servlet)     │     │  (External)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  Encrypted URL   │
                        │  with Token      │
                        └──────────────────┘
                                │
                                ▼ (QR Scan)
                        ┌──────────────────┐
                        │  Verify Servlet  │
                        │  - Decode Token  │
                        │  - Validate      │
                        │  - Fetch Data    │
                        └──────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  Verification    │
                        │  Result Page     │
                        └──────────────────┘
```

### Components

| Component | File | Purpose |
|-----------|------|---------|
| Token Utility | `AESTokenUtil.java` | AES-256-GCM encrypt & decrypt tokens |
| ID Token API | `GenerateQRTokenServlet.java` | Generate ID card tokens |
| Cert Token API | `GenerateCertTokenServlet.java` | Generate certificate tokens |
| ID Verifier | `VerifyIdServlet.java` | Verify ID card tokens |
| Cert Verifier | `VerifyCertificateServlet.java` | Verify certificate tokens |
| ID Card JSP | `verify-id.jsp` | Display ID verification result |
| Certificate JSP | `verify-certificate.jsp` | Display certificate verification result |

---

## 3. Token Generation (AES-256-GCM)

### 3.1 Encryption Algorithm

We use **AES-256-GCM** (Galois/Counter Mode), which provides:
- **Confidentiality**: Data is encrypted and unreadable without the key
- **Authenticity**: Built-in authentication tag detects tampering
- **Integrity**: Any modification invalidates the token

### 3.2 Token Structure

```
[IV (12 bytes)][Encrypted Data][Auth Tag (16 bytes)]
        ↓              ↓                  ↓
    Random         Ciphertext        Verification
```

**Before Encryption (Plaintext):**

| Type | Format |
|------|--------|
| ID Card | `ID\|studentId\|expiryTimestamp` |
| Certificate | `CERT\|studentId\|certId\|courseName\|expiryTimestamp` |

**After Encryption (Base64URL):**
```
Example: n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg...
```

### 3.3 Encryption Process

```java
// 1. Generate random IV (12 bytes)
byte[] iv = new byte[12];
secureRandom.nextBytes(iv);

// 2. Create AES-GCM cipher
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(128, iv));

// 3. Encrypt plaintext
byte[] ciphertext = cipher.doFinal(plaintext.getBytes());

// 4. Combine: IV + Ciphertext (includes auth tag)
byte[] combined = concat(iv, ciphertext);

// 5. Base64URL encode (URL-safe, no padding)
String token = Base64.getUrlEncoder().withoutPadding().encodeToString(combined);
```

### 3.4 Token Expiry

| Token Type | Default Expiry |
|------------|----------------|
| ID Card | 1 year (365 days) |
| Certificate | 1 year (365 days) |

### 3.5 Secret Key Configuration

```bash
# Production: Set environment variable (32 characters for AES-256)
export AES_SECRET_KEY="your-32-character-secret-key-here"
```

---

## 4. QR Code Generation

### 4.1 Flow

```
1. User clicks "Generate ID Card" or "Generate Certificate"
2. JavaScript calls token API (/api/generate-qr-token or /api/generate-cert-token)
3. API returns encrypted token + full verification URL
4. JavaScript generates QR code using external API
5. QR code is embedded in the ID card/certificate image
```

### 4.2 QR Code API

We use the **QR Server API** for generating QR images:

```
https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={URL}
```

### 4.3 JavaScript Implementation

```javascript
// ID Card QR Generation (id-certificates.js)
async function generateIdCard(studentId) {
    // Call token API
    const response = await fetch(`/api/generate-qr-token?studentId=${studentId}`);
    const data = await response.json();
    
    if (data.success) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.verificationUrl)}`;
        // Embed QR in ID card...
    } else {
        // Show error placeholder - NO fallback to plain IDs
    }
}
```

### 4.4 Security: No Insecure Fallbacks

❌ **NEVER** use plain student IDs in URLs  
✅ **ALWAYS** use encrypted tokens  

If token generation fails, the system shows an error instead of falling back to insecure URLs.

---

## 5. URL Structure

### 5.1 Verification URLs

| Type | URL Pattern | Example |
|------|-------------|---------|
| ID Card | `/verify/id/{token}` | `/verify/id/U1RVMDA...` |
| Certificate | `/verify/certificate/{token}` | `/verify/certificate/Q0VSV...` |

### 5.2 Backwards Compatibility

Old URL patterns are still supported:

| Old Pattern | New Pattern |
|-------------|-------------|
| `/verify-id/{token}` | `/verify/id/{token}` |
| `/verify-certificate/{token}` | `/verify/certificate/{token}` |

### 5.3 URL Mapping (web.xml)

```xml
<!-- ID Card Verification -->
<servlet-mapping>
    <servlet-name>VerifyIdServlet</servlet-name>
    <url-pattern>/verify/id/*</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>VerifyIdServlet</servlet-name>
    <url-pattern>/verify-id/*</url-pattern>
</servlet-mapping>

<!-- Certificate Verification -->
<servlet-mapping>
    <servlet-name>VerifyCertificateServlet</servlet-name>
    <url-pattern>/verify/certificate/*</url-pattern>
</servlet-mapping>
<servlet-mapping>
    <servlet-name>VerifyCertificateServlet</servlet-name>
    <url-pattern>/verify-certificate/*</url-pattern>
</servlet-mapping>
```

---

## 6. Verification Flow

### 6.1 ID Card Verification

```
┌─────────────────────────────────────────────────────────────────┐
│                    ID CARD VERIFICATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

User Scans QR Code
        │
        ▼
┌───────────────────┐
│ VerifyIdServlet   │
│ receives token    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     YES    ┌───────────────────┐
│ Try AES-256-GCM   │───────────▶│ Decrypt token     │
│ decryption        │            │ Extract studentId │
└─────────┬─────────┘            │ Fetch live data   │
          │ NO                   └─────────┬─────────┘
          ▼                                ▼
┌───────────────────┐            ┌───────────────────┐
│ Try Database      │            │ Display verified  │
│ lookup by token   │            │ ID card info      │
└─────────┬─────────┘            └───────────────────┘
          │
          ▼
┌───────────────────┐     YES    ┌───────────────────┐
│ Token found in    │───────────▶│ Check if active   │
│ id_cards table?   │            │ Display result    │
└─────────┬─────────┘            └───────────────────┘
          │ NO
          ▼
┌───────────────────┐
│ Show error:       │
│ "Invalid or       │
│  expired token"   │
└───────────────────┘
```

### 6.2 Certificate Verification

Similar flow with additional checks:
- Certificate revocation status
- Course details and duration
- Issue date validation

### 6.3 Token Validation Priority

| Priority | Method | Description |
|----------|--------|-------------|
| 1 | AES-256-GCM | Decrypt token, verify auth tag, check expiry |
| 2 | Database | Lookup token in `verification_token` column |

---

## 7. Security Features

### 7.1 Encryption Details

| Feature | Value |
|---------|-------|
| Algorithm | AES-256-GCM |
| Key Size | 256 bits (32 bytes) |
| IV Size | 96 bits (12 bytes) |
| Auth Tag | 128 bits (16 bytes) |
| Encoding | Base64URL (RFC 4648) |

### 7.2 Why AES-256-GCM?

| Advantage | Description |
|-----------|-------------|
| **Authenticated** | Built-in integrity check via GCM tag |
| **Fast** | Hardware acceleration on modern CPUs |
| **Secure** | No known practical attacks |
| **Standard** | NIST approved, widely used |

### 7.3 Security Measures

✅ **Implemented:**
- AES-256-GCM authenticated encryption
- Random IV for each token (prevents replay attacks)
- Base64URL encoding (URL-safe)
- Token expiration (1 year default)
- Server-side decryption only
- No plain IDs in URLs ever

❌ **Prevented:**
- Token guessing (encrypted, not hashed)
- Token tampering (GCM auth tag fails)
- Replay attacks (unique IV per token)
- URL encoding issues (Base64URL safe)

### 7.4 Authentication Filter

Verification URLs are **public** (no login required):

```java
// AuthenticationFilter.java - These paths are excluded:
// /verify/id/*
// /verify/certificate/*
// /verify-id/*
// /verify-certificate/*
```

---

## 8. API Endpoints

### 8.1 Generate ID Card Token

```
GET /api/generate-qr-token?studentId={studentId}
```

**Response:**
```json
{
    "success": true,
    "token": "U1RVMDA...",
    "verificationUrl": "https://example.com/verify/id/U1RVMDA..."
}
```

### 8.2 Generate Certificate Token

```
GET /api/generate-cert-token?studentId={studentId}&certId={certId}&courseName={courseName}
```

**Response:**
```json
{
    "success": true,
    "token": "Q0VSV...",
    "verificationUrl": "https://example.com/verify/certificate/Q0VSV..."
}
```

### 8.3 Error Response

```json
{
    "success": false,
    "error": "Student ID is required"
}
```

---

## 9. Database Schema

### 9.1 ID Cards Table

```sql
CREATE TABLE id_cards (
    id_card_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    institute_id VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    verification_token VARCHAR(64),  -- Database token (HMAC hash)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9.2 Certificates Table

```sql
CREATE TABLE certificates (
    certificate_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    institute_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50),
    course_name VARCHAR(200),
    issue_date DATE NOT NULL,
    verification_token VARCHAR(64),  -- Database token (HMAC hash)
    is_revoked BOOLEAN DEFAULT FALSE,
    revocation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. Troubleshooting

### 10.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid or expired" | Token expired (>24hrs) | Generate new QR code |
| "Invalid or expired" | Token tampered | Use original QR code |
| "Student not found" | Student deleted | Check student exists |
| QR code not generating | API error | Check network/API status |
| N/A for duration | Course not linked | Ensure batch has courseId |

### 10.2 Debug Logging

Enable debug logging by checking server logs for:

```
=== ID VERIFICATION DEBUG ===
Token received: U1RVMDA... (length: 64)
Attempting QRTokenUtil validation...
QRTokenUtil SUCCESS - studentId: STU001
```

### 10.3 Testing Verification

1. Generate an ID card/certificate from admin panel
2. Scan the QR code or copy the URL
3. Verify the page shows correct student information
4. Check that expired tokens show appropriate error

---

## Quick Reference

### Token Generation Class

```
com.eduhub.util.AESTokenUtil
├── generateIdToken(studentId)              → AES encrypted ID card token
├── validateIdToken(token)                  → Returns studentId or null
├── generateCertificateToken(...)           → AES encrypted certificate token
├── validateCertificateToken(token)         → Returns [studentId, certId, courseName] or null
├── getRemainingDays(token)                 → Days until expiry
└── isAESToken(token)                       → Check if token is AES format
```

### Servlet Endpoints

```
/api/generate-qr-token      → GenerateQRTokenServlet (ID cards)
/api/generate-cert-token    → GenerateCertTokenServlet (Certificates)
/verify/id/*                → VerifyIdServlet
/verify/certificate/*       → VerifyCertificateServlet
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AES_SECRET_KEY` | 32-char secret for AES-256 | Development key (change in prod!) |
| `APP_BASE_URL` | Base URL for verification links | `http://localhost:8080/eduhub` |

---

*Document maintained by EduHub Development Team*
