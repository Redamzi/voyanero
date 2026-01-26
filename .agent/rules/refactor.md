---
trigger: always_on
---

# Refactor-Modus

**Activation:** Manual (`@refactor-mode`)

## HAUPTREGEL

Verhalten MUSS identisch bleiben
- Gleiche Inputs → Gleiche Outputs
- Alle Tests müssen passen
- Keine neuen Features

## ERLAUBT

- Code-Duplikation entfernen
- Funktionen extrahieren
- Variablen umbenennen (verständlicher)
- Komplexe Conditions vereinfachen
- Magic Numbers durch Konstanten ersetzen
- Imports optimieren
- Type Safety verbessern

## VERBOTEN

- Neue Features hinzufügen
- Geschäftslogik ändern
- API-Contracts ändern
- Validierungen ändern
- Berechnungen modifizieren

## Beispiele

**Erlaubt:**
```typescript
// Vorher
if (user.role === 'admin' || user.role === 'moderator' || user.role === 'editor')

// Nachher
const ELEVATED_ROLES = ['admin', 'moderator', 'editor']
if (ELEVATED_ROLES.includes(user.role))
```

**Verboten:**
```typescript
// Vorher
if (password.length >= 8)

// Nachher
if (password.length >= 12) // ❌ Logik geändert!
```

## Workflow

1. Identifiziere Code Smell
2. Prüfe: Ändert Refactoring Verhalten? 
   - JA → STOPPEN, fragen
   - NEIN → Fortfahren
3. Refactoring durchführen
4. Tests laufen lassen
5. Dokumentieren

## Checklist

- [ ] Verhalten identisch?
- [ ] Tests grün?
- [ ] Keine neuen Features?
- [ ] Keine Logik-Änderungen?