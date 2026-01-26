---
trigger: always_on
---

# Architektur-Regeln

**Activation:** Always On

## Projektstruktur

### Next.js (Frontend)
```
/app                    # Next.js App Router
  /api                  # API Routes
  /(routes)             # Page Routes
  /layout.tsx           # Root Layout
  
/components             # React Komponenten
  /ui                   # Basis UI (Button, Input, Card)
  /features             # Feature-spezifisch (Dashboard, Auth)
  /shared               # Wiederverwendbar
  
/lib                    # Utilities & Configs
  /utils                # Helper Functions
  /hooks                # Custom React Hooks
  /constants            # Konstanten
  /types                # Shared TypeScript Types
  
/public                 # Static Assets
  /images
  /icons
```

### Backend (Express - falls separates Backend)
```
/src
  /api                  # API Routes
    /routes             # Route Definitionen
    /controllers        # Business Logic
    /middleware         # Middleware Functions
  
  /services             # Service Layer
    /prisma             # DB Service
    /external           # External APIs
  
  /lib                  # Utilities
    /validation         # Input Validation
    /auth               # Auth Helpers
  
  /types                # TypeScript Types
```

### Database (Prisma)
```
/prisma
  /schema.prisma        # DB Schema
  /migrations           # DB Migrations
  /seed.ts              # Seed Data
```

## Regeln pro Ordner

### `/app` - Next.js Routes
**Erlaubt:**
- Page Components (Server Components bevorzugt)
- Layout Components
- Loading/Error States
- Route Handlers (API)

**Verboten:**
- Business Logic (→ `/lib`)
- Wiederverwendbare Komponenten (→ `/components`)
- Utilities (→ `/lib/utils`)

### `/components` - React Komponenten
**Struktur:**
- `/ui` - Basis-Komponenten (Button, Input, Modal)
- `/features` - Feature-spezifisch (UserProfile, OrderList)
- `/shared` - Übergreifend (Header, Footer, Navigation)

**Regel:**
- Ein Ordner pro Komponente wenn >1 Datei
- `index.ts` für Exports
- Co-located Tests: `Button.tsx` + `Button.test.tsx`

**Beispiel:**
```
/components
  /ui
    /Button
      Button.tsx
      Button.test.tsx
      index.ts
```

### `/lib` - Business Logic & Utilities
**Erlaubt:**
- Helper Functions
- Custom Hooks
- Validations
- Formatters
- Constants
- Type Definitions

**Verboten:**
- React Components (→ `/components`)
- API Routes (→ `/app/api`)

### `/prisma` - Database
**Erlaubt:**
- Schema Definitionen
- Migrations
- Seed Scripts

**Verboten:**
- Business Logic (→ `/lib` oder `/services`)
- Direct Queries in Components (→ API Routes)

## Naming Conventions

### Dateien
- Komponenten: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`
- Types: `PascalCase.types.ts`
- Tests: `*.test.ts` oder `*.spec.ts`

### Ordner
- `kebab-case` oder `camelCase`
- Feature-basiert, nicht technisch

**Gut:**
```
/features/user-profile
/features/order-management
```

**Schlecht:**
```
/hooks
/contexts
/redux
```

## Import-Regeln

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

### Import-Reihenfolge
1. External Libraries (react, next)
2. Internal Aliases (@/components)
3. Relative Imports (../utils)
4. Styles/CSS

**Beispiel:**
```typescript
import { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

import styles from './Page.module.css'
```

## Dependency-Flow
```
Components → Lib/Utils
     ↓
API Routes → Services → Prisma
```

**Regel:**
- Components rufen API Routes
- API Routes nutzen Services
- Services nutzen Prisma/External APIs
- Keine direkten DB-Calls in Components

## Verbotene Patterns

### ❌ Business Logic in Components
```typescript
// ❌ VERBOTEN
export default function OrderPage() {
  const total = items.reduce((sum, item) => {
    const discount = item.quantity > 10 ? 0.1 : 0
    return sum + (item.price * item.quantity * (1 - discount))
  }, 0)
}

// ✅ ERLAUBT - Logic in /lib
import { calculateOrderTotal } from '@/lib/orders'

export default function OrderPage() {
  const total = calculateOrderTotal(items)
}
```

### ❌ Direct DB in Components
```typescript
// ❌ VERBOTEN
'use client'
export default function Users() {
  const users = await prisma.user.findMany() // Nicht in Client!
}

// ✅ ERLAUBT - Via API
export default async function Users() {
  const res = await fetch('/api/users')
  const users = await res.json()
}
```

### ❌ Utils in falschen Ordnern
```typescript
// ❌ VERBOTEN
// /components/utils/formatDate.ts

// ✅ ERLAUBT
// /lib/utils/formatDate.ts
```

## Feature-Organisation

**Bei neuen Features:**
```
/features/user-auth
  /components          # Feature-spezifische Components
  /lib                 # Feature-spezifische Utils
  /types               # Feature-spezifische Types
  index.ts             # Public API
```

**Beispiel:**
```
/features/checkout
  /components
    CheckoutForm.tsx
    PaymentMethod.tsx
  /lib
    validation.ts
    pricing.ts
  /types
    checkout.types.ts
  index.ts
```

## Deployment-Struktur
```
/.env.local             # Local Secrets (gitignored)
/.env.example           # Example ohne Secrets
/next.config.js         # Next.js Config
/tsconfig.json          # TypeScript Config
/tailwind.config.js     # Tailwind Config
/package.json           # Dependencies
/.gitignore             # Git Ignore
```

## Bei Strukturänderungen

**IMMER fragen bei:**
- Neuer Top-Level Ordner
- Dateien zwischen Ordnern verschieben
- Import-Aliases ändern
- Dependency-Flow ändern

**Ohne Rückfrage:**
- Neue Komponente in `/components/ui`
- Neue Utility in `/lib/utils`
- Neue Type in `/lib/types`

## Checklist

- [ ] Dateien im richtigen Ordner?
- [ ] Naming Convention eingehalten?
- [ ] Import-Reihenfolge korrekt?
- [ ] Keine Business Logic in Components?
- [ ] Keine Direct DB Calls in Components?
- [ ] Path Aliases genutzt?