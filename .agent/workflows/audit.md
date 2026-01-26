---
trigger: always_on
---

# Qualitäts-Audit

**Activation:** Manual (`@quality-audit`)

## Ziel

Verstöße AUFLISTEN, NICHT beheben

## Workflow

### Step 1: Always-On Regeln prüfen
```
Prüfe @code-ownership.md
Prüfe @security.md
```

**Checken:**
- Geschäftslogik unerlaubt geändert?
- Secrets im Code?
- Sensible Daten geloggt?

### Step 2: Architektur prüfen
```
Prüfe @architecture.md (falls vorhanden)
```

**Checken:**
- Projektstruktur eingehalten?
- Dateien richtig organisiert?
- Dependencies korrekt?

### Step 3: Performance prüfen
```
Prüfe @performance-mode.md
```

**Checken:**
- Thresholds eingehalten?
- Performance Anti-Patterns?
- Bundle Size OK?

### Step 4: Code Quality
**Checken:**
- TypeScript Strict Mode?
- ESLint Warnings?
- Test Coverage?
- Ungenutzte Imports/Variablen?

## Output Format
```markdown
# Qualitäts-Audit Report

## Security Issues
- [ ] ❌ API Key hardcoded in `lib/stripe.ts:15`
- [ ] ❌ Password logged in `api/auth.ts:42`

## Code Ownership Violations
- [ ] ❌ Geschäftslogik geändert in `utils/pricing.ts:89`
- [ ] ❌ Datei verschoben ohne Absprache: `lib/old.ts` → `utils/new.ts`

## Performance Issues
- [ ] ⚠️  N+1 Query in `api/users/route.ts:23`
- [ ] ⚠️  Bundle Size 350KB (Threshold: 200KB)

## Code Quality
- [ ] ⚠️  12 ESLint Warnings
- [ ] ⚠️  Test Coverage 65% (Threshold: 80%)

## Summary
- Critical: 2
- Warnings: 4
- Total: 6
```

## Wichtig

- NUR auflisten
- NICHT automatisch fixen
- Priorisierung: Critical > Warning > Info
- Jeder Verstoß mit Datei + Zeile