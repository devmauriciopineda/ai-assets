---
name: universal-deck
description: Build, restyle, validate and project a presentation deck on any topic (full-screen HTML slides plus the Spanish support report and the sources file) in the current workspace. Use when creating a new presentation under decks/, applying the documented visual system, checking the deliverables against the acceptance criteria, or serving the deck on localhost.
---

# Universal deck

Procedure to produce one presentation on **any topic**: folder scaffolding, HTML deck, support
report and sources file. The visual system and the slide templates are assets of this skill.

## Where the pieces live

This skill ships inside the `deck-studio` plugin, together with its companion agents
(`deck-builder` for the interview and the plan, `topic-researcher` for the evidence). Resolve every
asset of this skill from the folder that contains this `SKILL.md` — `./templates/`, `./references/`,
`./scripts/` — never from a fixed `.github/...` path: that layout only exists in the source
repository, not in an installed plugin. All generated output goes to `decks/<slug>/` **inside the
user's workspace**.

## When to use

- A presentation (deck + report) must be created, restyled, extended or edited under `decks/`.
- The deck must be checked against its structural acceptance criteria.
- The deck must be projected: served on localhost.

## Deliverable contract

```text
decks/<topic-slug>/
├─ presentacion/
│  ├─ index.html       # every slide, in order, in one file
│  ├─ styles.css       # palette tokens + composition + microanimations
│  ├─ slides.js        # index jumps, prev/next, keyboard, fullscreen
│  └─ assets/
│     ├─ people/       # portraits and images of the people or organizations mentioned
│     └─ context/      # maps, products, diagrams, photographs, period images
├─ informe-soporte.md  # prose report, same topic index as the deck
└─ fuentes.md          # sources consulted + image and quote attribution
```

Slug: lowercase, hyphens, no accents (`inteligencia-artificial`, `revolucion-industrial`).
The deliverables are closed: `presentacion/`, `informe-soporte.md` and `fuentes.md`. No manifests,
no build step, no research folder in the deliverable — research notes live in
`.tmp/research/<slug>/` and are disposable.

## Procedure

1. **Collect the decisions.** The interview belongs to the `deck-builder` agent; do not start
   building before its checklist is closed and the plan (outline + slide count + goal per slide) is
   approved.
2. **Scaffold the folder.** Copy `./templates/` into `decks/<slug>/presentacion/`, keep the file
   names, and create `assets/people/` and `assets/context/`.
3. **Fix the system.** Read `./references/visual-system.md` and set `data-palette`, `data-style`
   and `data-typography` on `<html>`, choosing the combination that fits the topic.
4. **Build the slides.** One `<section class="slide" id="sN" data-type="…" data-title="…">` per
   slide, following `./references/slide-templates.md`. Keep the deck in `index.html` order and keep
   `data-title` wording identical to the report headings. The plan's goal per slide is internal:
   write each visible `.slide-subtitle` as audience-facing prose, never the goal line.
5. **Write the index slide** with one `.index-link` per other slide, in order, including the cover.
6. **Gather the content** through the `topic-researcher` agent, **one lane per thematic core** of
   the approved outline (2 by default, 3 maximum). Each lane writes its notes under
   `.tmp/research/<slug>/`, reads that folder first when it already exists, and returns a short
   digest instead of the pages. Its budget and stop rules belong to the `topic-researcher` agent
   that ships with this plugin. Attributed images are stored under `assets/`.
7. **Check the coverage floor** (see below) and report the outcome to the user in one line.
8. **Write `informe-soporte.md`** — prose, same topic index, more detail, references at the point
   where each fact is stated. It is not a transcript of the slides.
9. **Write `fuentes.md`** — sources consulted, image attribution, quote attribution and the
   educational/divulgative use declaration.
10. **Validate** with the script below and fix everything it reports as FAIL.
11. **Serve** on localhost and hand the URL to the user.

## Coverage floor

A generic deck has no fixed syllabus, so the floor is structural: every presentation must contain
**all five blocks**, whatever the topic. The agreed outline can exceed it, never fall below it.

| Block | Minimum |
|---|---|
| **Identificación** | What the topic is: definition, scope, key names, dates or units |
| **Núcleo** | The substance: how it works, what happened, the figures or evidence that sustain it |
| **Ejemplos o casos** | At least one concrete, sourced case — dates, places or numbers |
| **Contexto o consecuencias** | Why it matters: causes, effects, limits, controversies |
| **Fuentes** | Every figure, quote and image traceable to a named source |

If a block cannot be sourced, keep the slot and **declare it absent with a reason**. Never fill it
with unsourced content.

## HTML contract

- `<html lang="es">`; visible text in Spanish, identifiers and class names in English.
- Flat `<section class="slide" id="sN" data-type="…" data-title="…">`, double-quoted attributes,
  no nested sections.
- `data-type` ∈ `cover · index · content · table · credits · person · quote · data · closing`.
  Exactly one `cover`, one `index`, one `closing`.
- Visible subtitles (`.slide-subtitle`) are audience-facing prose. Never render planning goals,
  objectives, notes or instructions.
- `<img>` always has `alt`, `data-credit` and a relative `src` under `assets/`.
- No remote media: the deck must project with no internet connection.
- Navigation: `.nav-btn--prev`, `.nav-btn--next`, optional `.nav-btn--fs`; progress via
  `.deck-progress__current` / `.deck-progress__total` and `.deck-progressbar__fill`.

## Validate

The validator ships inside this skill: `<skill-dir>/scripts/validate-deck.mjs`, where `<skill-dir>`
is the folder that contains this `SKILL.md`. Run it with the deck path relative to the workspace.

```bash
node <skill-dir>/scripts/validate-deck.mjs              # every deck under ./decks
node <skill-dir>/scripts/validate-deck.mjs decks/<slug> # one deck
```

Checks required files, `lang`, slide count/ids/`data-title`, empty slides, cover-index-closing,
index links resolving to real slides, remote media, image `alt`/`data-credit`/existence on disk,
reduced-motion fallback, keyboard and fullscreen support, report sections, topic-index parity and
sources entries. Exit code 1 on any FAIL. Warnings never block, but explain them to the user.

## Serve on localhost

From the workspace root:

```bash
python -m http.server 8080 --directory decks/<slug>/presentacion
```

Then open `http://localhost:8080`. Fullscreen with the button or `F`; navigate with `→` / `←`,
space, `Home` / `End`, `I` for the index. This is the only supported projection path — no hosting,
no packaging.

## Editing an existing deck

- Change **only** what was requested; touch nothing else.
- Reuse `.tmp/research/<slug>/`: read the existing notes before any new fetch, and stay inside the
  researcher's budget.
- Keep `data-title` and the report headings in sync when a slide is added, removed or renamed.
- Renumbering slides means fixing both the `id`/`index-num` pairs and every index link.
- Re-run the validator after the edit and report the result.

## Do not

- Do not generate PPTX, PDF or any office format.
- Do not add build tooling, frameworks, CDNs or dependencies: the deck is three static files.
- Do not invent styles, animations or palettes outside `./references/`.
- Do not leave a deck without its `informe-soporte.md` and `fuentes.md`.
