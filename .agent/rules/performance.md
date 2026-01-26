---
trigger: always_on
---

# Performance-Modus

**Activation:** Model Decision
**Trigger:** Performance-Optimierung, Bundle-Size, Laufzeit

## HAUPTREGEL

Funktionalität MUSS identisch bleiben
- Gleicher Output
- Gleiche Tests
- Gleiche User Experience

## Stack

Next.js 14+, Express, Prisma, Tailwind, TypeScript

## Thresholds

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- API P95 < 200ms
- DB P95 < 50ms
- Bundle < 200KB

## Next.js

**Erlaubt:**
- Server Components statt Client Components (wenn keine Interaktivität)
- Dynamic Imports für Komponenten > 50KB
- `next/image` für alle Bilder (Pflicht)
- Parallel Fetching mit `Promise.all()`

**Verboten:**
- Unnötige Client Components
- Standard `<img>` Tag
- Sequential Fetching

## Express

**Pflicht:**
- Compression aktivieren
- Rate Limiting
- Response Caching (GET)
- Streaming für Dateien > 1MB

## Prisma

**Regel:**
- `select` statt `include` (nur nötige Felder)
- N+1 Queries vermeiden (Batch/Include)
- Transactions für Multi-Ops
- Indexes auf WHERE-Felder

**Verboten:**
- Overfetching mit `include`
- Queries in Loops

## Tailwind

**Regel:**
- Nur statische Klassen
- Keine Template Literals: `text-${color}-500`
- CSS Bundle < 20KB

## TypeScript

**Pflicht:**
- Strict Mode aktiv
- Type-only imports
- Keine `any` types
- Incremental builds

## Bei Unsicherheit

Frage wenn:
- Geschäftslogik betroffen
- Transaktions-Verhalten unklar
- Cache könnte Daten verfälschen