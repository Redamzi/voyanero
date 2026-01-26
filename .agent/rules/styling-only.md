---
trigger: always_on
---

# Styling-Only-Modus

**Activation:** Manual (`@styling-only`)

## ERLAUBT

- CSS/Tailwind Klassen ändern
- Farben, Spacing, Typography
- Layouts (Grid, Flexbox)
- Animations, Transitions
- Responsive Breakpoints
- Dark Mode Styles

## VERBOTEN

- JavaScript/TypeScript Logik
- State Management
- Event Handlers
- API Calls
- Conditional Rendering (außer CSS `hidden`)
- Props/Types hinzufügen

## GRAUZONE - Immer fragen

- HTML-Struktur ändern (Wrapper hinzufügen)
- Conditional Classes mit neuer Logik
- Unterschiedlicher Content Mobile/Desktop

## Workflow

**Prüfen:**
✓ Nur Klassen/CSS? → OK
✗ Logik/State/Props? → STOPPEN

**Fragen bei:**
- "Brauche ich einen Wrapper-div?"
- "Muss ich State für Hover hinzufügen?"
- "Brauche ich conditional rendering?"

## Beispiele

**Erlaubt:**
- `className="px-4"` → `className="px-6"`
- Hover-Effekte (rein CSS)
- Media Queries

**Verboten:**
- `const [hover, setHover] = useState()`
- `{isMobile ? <A/> : <B/>}`
- `onClick={() => ...}` ändern