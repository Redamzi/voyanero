---
trigger: always_on
---

# Code-Ownership-Regeln

**Activation:** Always On

## VERBOTE

- Geschäftslogik NICHT ändern (Berechnungen, Validierungen, Workflows)
- Refactoring nur nach Rückfrage
- Projektstruktur nicht ändern (Ordner, Dateien verschieben)
- Bei Unklarheit: STOPPEN und fragen

## ERLAUBT ohne Rückfrage

- Typen hinzufügen
- Kommentare ergänzen
- ESLint auto-fix
- Import-Sortierung
- Formatierung

## RÜCKFRAGE bei

- Logik-Änderungen (auch wenn "besser")
- Datei/Ordner verschieben
- API Response-Struktur ändern
- Feature entfernen
- Validierungs-Regeln anpassen

## Workflow

1. STOPPEN - Bei Unsicherheit nicht fortfahren
2. FRAGEN - "Darf ich [X] ändern/verschieben?"
3. WARTEN - Auf Erlaubnis warten
4. DOKUMENTIEREN - Änderungen begründen