# Design System

A clean, light, modern design language for the Slack Blocks to JSX playground.

## Architecture

```
styles/tokens.css    → CSS custom properties (single source of truth)
tailwind.config.ts   → Maps tokens to Tailwind utilities (ds-* prefix)
styles/globals.css   → Component classes (.ds-card, .ds-btn, etc.)
```

**To reskin the app**, edit `styles/tokens.css`. All components reference these tokens.

---

## Tokens

### Colors

| Token                 | Value                  | Usage                    |
| --------------------- | ---------------------- | ------------------------ |
| `--ds-bg-primary`     | `#ffffff`              | Page background          |
| `--ds-bg-secondary`   | `#f8f8f7`              | Section backgrounds      |
| `--ds-bg-tertiary`    | `#f1f0ee`              | Elevated sections        |
| `--ds-surface`        | `#ffffff`              | Card backgrounds         |
| `--ds-surface-hover`  | `#f8f8f7`              | Card/element hover state |
| `--ds-surface-active` | `#f1f0ee`              | Active/pressed state     |
| `--ds-border`         | `rgba(0,0,0,0.08)`    | Default borders          |
| `--ds-border-subtle`  | `rgba(0,0,0,0.04)`    | Subtle separators        |
| `--ds-border-strong`  | `rgba(0,0,0,0.15)`    | Emphasized borders       |
| `--ds-border-focus`   | `#6c5ce7`              | Focus ring color         |
| `--ds-text-primary`   | `#1a1a1a`              | Primary text             |
| `--ds-text-secondary` | `#6b6b6b`              | Secondary text           |
| `--ds-text-tertiary`  | `#999999`              | Muted text               |
| `--ds-text-disabled`  | `#bcbcbc`              | Disabled text            |
| `--ds-accent`         | `#6c5ce7`              | Accent/CTA (violet)      |
| `--ds-accent-hover`   | `#5a4bd6`              | Accent hover             |
| `--ds-accent-subtle`  | `rgba(108,92,231,0.08)`| Accent backgrounds       |

### Semantic Colors

| Token                                  | Usage          |
| -------------------------------------- | -------------- |
| `--ds-success` / `--ds-success-subtle` | Success states |
| `--ds-error` / `--ds-error-subtle`     | Error states   |
| `--ds-warning` / `--ds-warning-subtle` | Warning states |
| `--ds-info` / `--ds-info-subtle`       | Info states    |

### Typography

| Token                            | Value               | Usage              |
| -------------------------------- | ------------------- | ------------------ |
| `--ds-font-sans`                 | Inter, system-ui... | Body text          |
| `--ds-font-mono`                 | JetBrains Mono...   | Code               |
| `--ds-text-xs`                   | 0.75rem (12px)      | Captions, badges   |
| `--ds-text-sm`                   | 0.8125rem (13px)    | Labels, small text |
| `--ds-text-base`                 | 0.875rem (14px)     | Body text          |
| `--ds-text-md`                   | 1rem (16px)         | Headings           |
| `--ds-text-lg`                   | 1.125rem (18px)     | Section titles     |
| `--ds-text-xl` – `--ds-text-3xl` | 1.25–1.875rem       | Large headings     |

### Spacing

Uses a 4px base unit: `--ds-space-1` (4px) through `--ds-space-16` (64px).

### Radius

| Token              | Value  | Usage           |
| ------------------ | ------ | --------------- |
| `--ds-radius-sm`   | 6px    | Small elements  |
| `--ds-radius-md`   | 10px   | Buttons, inputs |
| `--ds-radius-lg`   | 14px   | Inner cards     |
| `--ds-radius-xl`   | 20px   | Cards           |
| `--ds-radius-2xl`  | 24px   | Hero cards      |
| `--ds-radius-full` | 9999px | Badges, pills   |

### Shadows

| Token              | Usage              |
| ------------------ | ------------------ |
| `--ds-shadow-xs`   | Subtle depth       |
| `--ds-shadow-sm`   | Cards at rest      |
| `--ds-shadow-md`   | Elevated cards     |
| `--ds-shadow-lg`   | Dropdowns, modals  |
| `--ds-shadow-glow` | Accent glow effect |

### Transitions

| Token                | Value                        |
| -------------------- | ---------------------------- |
| `--ds-duration-fast` | 100ms                        |
| `--ds-duration-base` | 200ms                        |
| `--ds-duration-slow` | 300ms                        |
| `--ds-ease-default`  | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Component Classes

Defined in `styles/globals.css` under `@layer components`:

| Class                            | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `.ds-card`                       | Card container with surface bg, border, radius, shadow |
| `.ds-btn`                        | Base button with flex layout, transitions              |
| `.ds-btn-primary`                | Accent-colored solid button                            |
| `.ds-btn-ghost`                  | Transparent button with border                         |
| `.ds-btn-subtle`                 | Low-emphasis button                                    |
| `.ds-input`                      | Text input with focus ring                             |
| `.ds-select`                     | Styled select dropdown                                 |
| `.ds-checkbox`                   | Accent-colored checkbox                                |
| `.ds-label`                      | Form label                                             |
| `.ds-tab` / `.ds-tab-active`     | Tab navigation                                         |
| `.ds-badge` / `.ds-badge-accent` | Inline badge/pill                                      |
| `.ds-divider`                    | Horizontal rule                                        |
| `.ds-focus-ring`                 | Focus-visible outline utility                          |

---

## Tailwind Usage

All tokens are available as Tailwind utilities with the `ds-` prefix:

```jsx
// Colors
<div className="bg-ds-surface text-ds-text-primary border-ds-border" />

// Typography
<p className="text-ds-sm font-sans" />

// Spacing
<div className="p-ds-4 gap-ds-2" />

// Radius & Shadow
<div className="rounded-ds-xl shadow-ds-sm" />
```

---

## Design Principles

1. **Clarity** — Clean whites and soft off-whites. Content takes center stage on an uncluttered canvas.
2. **Restraint** — Minimal borders, subtle shadows, generous whitespace. Let content breathe.
3. **Hierarchy** — Three text tiers (primary → secondary → tertiary) create clear visual order.
4. **Consistency** — Every surface, input, and button uses the same token vocabulary.
5. **Accessibility** — Focus rings on all interactive elements. High contrast text on light surfaces.
