---
trigger: always_on
---

# Feature sicher hinzufügen

**Activation:** Manual (`@feature-workflow`)

## Workflow

### Step 1: Regeln lesen
```
Lese @code-ownership.md
Lese @architecture.md (falls vorhanden)
```

### Step 2: Erlaubte Bereiche identifizieren
- Welche Dateien/Ordner darf ich ändern?
- Welche sind geschützt?
- Wo gehört das Feature strukturell hin?

### Step 3: Implementierung planen
- Welche neuen Dateien brauche ich?
- Welche bestehenden Dateien muss ich anpassen?
- Ändere ich Geschäftslogik? → Rückfrage

### Step 4: Feature implementieren
- Nur in erlaubten Bereichen
- Bestehende Logik unverändert
- Tests schreiben

### Step 5: Verification
- [ ] Bestehende Tests grün?
- [ ] Neue Tests geschrieben?
- [ ] Code-Ownership respektiert?
- [ ] Keine unerlaubten Änderungen?

## Beispiel-Ablauf

**Feature:** "Neuer Export-Button in Dashboard"

1. Lese Rules → Dashboard erlaubt
2. Identifiziere: `/app/dashboard/page.tsx`
3. Plane: Neue Komponente `ExportButton.tsx`
4. Implementiere in `/components/ExportButton.tsx`
5. Integriere in Dashboard (nur UI)
6. Tests + Verification

## Bei Blockern

**Frage:**
- "Darf ich [Datei X] ändern für Feature Y?"
- "Muss ich dafür Geschäftslogik in [Z] anpassen?"
- "Wo soll ich Feature [Y] strukturell platzieren?"