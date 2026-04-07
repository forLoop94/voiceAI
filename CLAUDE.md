# RelayPay Voice Support Agent — Project Context

## Brand

Before touching any UI — new features or existing components — read and follow `/brand/brand-guidelines.md`.

Key rules at a glance:
- **Colors:** `--primary-deep-blue: #1B2B4E` | `--secondary-teal: #2C7A7B` | `--background-off-white: #F7F9FC`
- **Font:** Inter (loaded via Google Fonts) + system UI fallback — defined in `globals.css`
- **Tone:** Professional, calm, minimal, trustworthy — B2B fintech
- **Never use:** gradients, emojis, neon colors, decorative fonts, chat-bubble-heavy designs, experimental layouts
- **Logo:** top-left, no animation — currently a placeholder in `Header.jsx`, swap when asset is provided
- If existing UI does not follow the brand, fix it while working in that area

All design tokens (colors, spacing, radii, shadows, typography) live in `src/styles/globals.css` as CSS custom properties. Always use these tokens — never hardcode values.

---

## Stack

- **React 18** + **Vite 5** — `npm run dev` starts the dev server
- **Vapi** — voice AI platform (`@vapi-ai/web`, `@vapi-ai/client-sdk-react` installed but not yet integrated)
- **CSS Modules** — per-component `.css` files imported directly, no CSS-in-JS
- No state management library — plain `useState`/`useContext`
- No router — single-page, single-screen app

### Environment Variables (`.env`)
```
VITE_VAPI_PUBLIC_KEY=
VITE_VAPI_ASSISTANT_ID=
```
Both are required. `VoiceWidget.jsx` checks for them on mount and errors if missing.

---

## Architecture

### Entry Point
```
index.html → src/main.jsx → <ToastProvider> → <App>
```

### Component Tree
```
App.jsx                         # Root — owns status + transcriptHistory state
├── Header.jsx                  # Logo + "Customer Support" title
├── SupportCard.jsx             # Centered card wrapper (max-width 800px)
│   ├── VoiceStatus.jsx         # Animated status dot + status text
│   ├── VoiceWidget.jsx         # ** Core widget — Vapi integration goes here **
│   └── TranscriptDisplay.jsx   # Scrollable transcript (hidden when status=error)
└── Footer.jsx                  # Copyright + Privacy/Terms/Contact links
```

`ToastContainer` + `ToastItem` are mounted inside `ToastProvider` (in `useToast.jsx`), rendered globally on top of all content.

### Hooks
| Hook | File | Purpose |
|---|---|---|
| `useVoiceStatus` | `src/hooks/useVoiceStatus.js` | Manages `status` + `micPermission` state |
| `useToast` / `ToastProvider` | `src/hooks/useToast.jsx` | Global toast notification context |

### State Flow
- `status` — lives in `App` via `useVoiceStatus`, passed down to `VoiceStatus` (display) and `VoiceWidget` (callback: `onStatusChange`)
- `transcriptHistory` — array of `{ role: 'user'|'assistant', text: string, timestamp: Date }`, lives in `App`, updated via `onTranscriptUpdate` callback from `VoiceWidget`
- Toasts — global context, any component can call `addToast(message, type)` where type is `'info'|'success'|'error'|'warning'`

### Status Values
`idle` → `initializing` → `ready` → `listening` → `processing` → back to `ready`  
`error` — terminal state, hides transcript, shows error in VoiceStatus dot

---

## File Map

```
src/
├── App.jsx
├── main.jsx
├── hooks/
│   ├── useVoiceStatus.js       # Note: .js extension (no JSX inside)
│   └── useToast.jsx            # .jsx — contains JSX (was renamed from .js)
├── components/
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SupportCard.jsx
│   │   └── layout.css
│   ├── Loading/
│   │   ├── SkeletonLoader.jsx  # Shown during VoiceWidget initialization
│   │   └── loading.css
│   ├── Toast/
│   │   ├── ToastContainer.jsx
│   │   └── ToastItem.jsx       # Auto-dismiss: 5s errors, 3s others
│   └── VoiceSupport/
│       ├── VoiceWidget.jsx     # ** Placeholder — Vapi not yet integrated **
│       ├── VoiceStatus.jsx
│       ├── TranscriptDisplay.jsx
│       ├── voicestatus.css
│       └── transcript.css
└── styles/
    ├── globals.css             # Design tokens + CSS reset + base styles
    └── toast.css
```

---

## Known Issues (do not reintroduce)

- `useToast.jsx` was originally `useToast.js` — Vite can't serve `.js` files containing JSX. Any new hook or utility file that contains JSX must use the `.jsx` extension.
- `checkMicPermission()` in `useVoiceStatus` is defined but never called — wire it up when implementing Vapi.
- `VoiceWidget.jsx` is a non-functional placeholder. The Vapi SDK is installed but not imported or used anywhere.
- `onTranscriptUpdate` callback is wired in `App.jsx` but never called by `VoiceWidget` — implement when integrating Vapi.
- `TranscriptDisplay` uses array `index` as React key — use a message `id` when real data flows in.
- Footer links are `href="#"` placeholders.
