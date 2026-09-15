# Visual system

Documented, reusable visual system for any topic. **This file is the source of truth**: the agent
never improvises styles outside this catalog. Style changes per topic are made *inside* this system.

Apply a style by setting attributes on `<html>` in `index.html`:

```html
<html lang="es" data-palette="paper" data-style="editorial" data-typography="serif-display">
```

## 1. Visual styles

| `data-style` | Character | Use when the topic is… |
|---|---|---|
| `editorial` | Calm, typographic, generous white space, few images | Explanation, history, analysis, academic or institutional talks |
| `cinematic` | Dark, high contrast, large images, wide letterboxed figures | Drama, narrative, strong imagery, a single protagonist subject |
| `poster` | Bold display titles, saturated accent blocks, poster-like headers | Pop culture, products, showcases, retrospectives |
| `archival` | Neutral, documentary, thin rules, caption-driven | Technical, scientific, regulatory, documentary subjects |

Rules: one style per deck; `data-style` changes composition and image treatment, **never** the
palette or the typography scale. Do not mix.

## 2. Named palettes

Each palette is implemented in `styles.css` as `html[data-palette="…"]` and guarantees readable
contrast between `--text` and `--bg`. They are deliberately neutral: no palette is tied to a
subject, so two decks on different topics can look different without leaving the catalog.

| `data-palette` | Feels like | `--bg` | `--text` | `--accent` | Contrast text/bg |
|---|---|---|---|---|---|
| `paper` | Clean white paper, restrained green accent | `#ffffff` | `#1b1b1b` | `#0f5c4a` | ≈ 17:1 |
| `warm` | Cream ground, terracotta accent | `#faf6ef` | `#2a2622` | `#b3541e` | ≈ 14:1 |
| `slate` | Dark blue-grey, cool blue accent | `#0e1116` | `#e8eaed` | `#5aa9e6` | ≈ 16:1 |
| `ink` | Near-black, gold accent | `#101014` | `#eceae4` | `#d9a441` | ≈ 16:1 |
| `signal` | Maximum contrast, hot accent | `#0c0c0d` | `#f7f7f5` | `#ff5a3c` | ≈ 18:1 |

Contrast rules:

- Body text ≥ **4.5:1**. Headings ≥ **3:1**.
- `--accent` is for headings, rules, numbers and highlights — not for long body runs.
- On dark palettes, `--accent-2` carries secondary highlights; on light palettes use it for table
  headers and figure captions.
- Never place `--text` on `--accent`; use `--on-accent`.

Full token set per palette: `--bg`, `--bg-soft`, `--surface`, `--text`, `--text-muted`, `--accent`,
`--accent-2`, `--line`, `--on-accent`.

**Style follows the topic.** Two decks on different topics must not look identical: propose the
palette that fits the subject. Variation happens **inside this catalog** — extending it is allowed
only if the topic justifies it, and the catalog then gets updated.

## 3. Typography

Local font stacks only — no webfonts, no CDN (the deck must project offline). `data-typography`
picks the display stack; `serif-display` is the default and `sans-display` suits technical,
product or corporate topics.

| Token | Stack | Role |
|---|---|---|
| `--font-display` | `Georgia, 'Iowan Old Style', 'Times New Roman', serif` | Cover titles, slide titles, quotes |
| `--font-body` | `'Segoe UI Variable Text', 'Segoe UI', system-ui, -apple-system, sans-serif` | Body, tables, captions |
| `--font-mono` | `ui-monospace, Consolas, 'Cascadia Mono', monospace` | Data figures, technical fields, slide numbers |

Hierarchy (fluid, projection-first):

| Level | Size | Weight | Notes |
|---|---|---|---|
| Cover title | `clamp(2.6rem, 5.4vw, 4.2rem)` | 600 | One per deck |
| Slide title | `clamp(2rem, 3.6vw, 3rem)` | 600 | Display stack |
| Slide subtitle | `clamp(1.2rem, 1.8vw, 1.55rem)` | 400 | Muted colour · audience-facing prose (never the internal plan goal) |
| Body | `clamp(1.15rem, 1.5vw, 1.35rem)` | 400 | ≥ 1.15 rem always |
| Data highlight | `clamp(2.4rem, 4vw, 3.4rem)` | 700 | Mono stack |
| Quote | `clamp(1.6rem, 2.6vw, 2.2rem)` | 400 italic | Display stack |
| Source note | `0.82rem` | 400 | Muted, never below 0.8 rem |

## 4. Composition

- **12-column grid**, 24 px gutter, `6vw` horizontal margin, `6vh` vertical margin.
- Layout primitive: one column of text (`max-width: 68ch`); `.grid-2` for figure + text; `.grid-3`
  for KPI rows.
- **One idea per slide.** 60–120 words of body text. If it does not fit, split the slide.
- Type-first: the visual supports the text, it never replaces it.
- Images: fixed aspect ratio, `object-fit: cover`, 6 px radius, hairline border, always with a
  caption carrying the attribution.
- Tables: header row in `--accent` with `--on-accent` text, zebra rows from `--bg-soft`, no
  vertical rules.
- Never scroll inside a slide. Overflow means the slide is overloaded.

## 5. Microanimations

Catalog is **closed**. Nothing outside this list.

| Class | Effect | Duration | Allowed on |
|---|---|---|---|
| `.anim--fade-up` | 12 px rise + fade | 380 ms | Titles, body blocks (default) |
| `.anim--fade-in` | Plain fade | 300 ms | Figures, captions, sources |
| `.anim--from-left` | 24 px slide from left + fade | 380 ms | Index entries, timeline items |
| `.anim--from-right` | 24 px slide from right + fade | 380 ms | Figures paired with text |
| `.anim--ken-burns` | 1.04 → 1.0 subtle scale | 8 s linear | Static images only |
| `.anim--reveal-line` | ScaleX rule reveal | 420 ms | Quote rules, section dividers |

Rules:

- Stagger with `--delay`: 0 / 120 / 240 ms. **Maximum 3 animated elements per slide.**
- Decorative only: never gate navigation, never delay reading, never loop infinitely.
- Applied as `.slide.is-active .anim` so they replay on each visit; `prefers-reduced-motion`
  turns them all off.
- No parallax, no scroll-jacking, no 3D flips, no typewriter effects.

## 6. Accessibility baseline

- `lang="es"`, one `<h1>` per slide that carries a visible title (`quote` slides use
  `<blockquote>` instead), semantic `<figure>/<figcaption>`.
- Contrast per section 2; body text never below 1.15 rem.
- Visible focus ring on every interactive element (`--accent` outline, 2 px offset).
- `alt` on every image; decorative images get `alt=""`.
- Motion respects `prefers-reduced-motion`; navigation is fully usable with keyboard alone.
