---
trigger: always_on
---

# Sicherheits-Regeln

**Activation:** Always On

## VERBOTE

**Secrets:**
- Keine API-Keys/Tokens/Passwörter im Code
- Nur Environment Variables
- `.env*` in `.gitignore`

**Logging:**
- Keine Passwörter
- Keine API-Keys
- Keine Tokens
- PII nur maskiert

**Beispiel verboten:**
```typescript
const KEY = "sk_live_abc" // ❌
console.log('PW:', password) // ❌
```

**Beispiel erlaubt:**
```typescript
const KEY = process.env.API_KEY // ✅
console.log('User:', { email }) // ✅
```

## PFLICHT

- Security Headers (helmet)
- Rate Limiting
- Input Validation
- Generische Error Messages (Production)
- CORS konfiguriert

## Checks vor Deployment

- [ ] Keine Secrets im Code
- [ ] `.env.local` in `.gitignore`
- [ ] Keine sensiblen Logs
- [ ] Security Headers aktiv
- [ ] Rate Limiting aktiv