---
name: use-case-writer
description: 'Formalize informal requirements into a use case (UC-XXX.md) and executable BDD acceptance criteria (UC-XXX-acceptance-criteria.md). Use when the user asks to create, draft, or reverse-engineer a use case / "caso de uso", acceptance criteria, BDD, or Given/When/Then scenarios, mentions "UC-001", or needs requirements extracted from existing code. Interviews for missing information before writing and keeps both documents functional, observable, and free of implementation detail.'
argument-hint: '[feature, requirement, or code area to formalize]'
---

# Use Case Writer

Turn vague, partial, or code-only input into a formal, reviewable use case document.

## When to Use
- Acceptance criteria must be derived from a use case in BDD/Gherkin-compatible form.

- A user describes a feature informally and wants it formalized.
- Use cases must be reverse-engineered from an existing codebase.
- An existing use-case document must be created, completed, or cleaned up.
- A team needs a consistent `UC-XXX.md` format.

## Core Rules
These are not negotiable. If a rule conflicts with the user's request, surface the conflict instead of breaking the rule.

1. **Interview before writing.** Never formalize a use case with missing critical information. Ask first.
2. **Business language only.** No endpoints, class names, CSS/HTML tags, framework or configuration terms, no implementation verbs ("cache", "render", "serialize").
3. **One goal per use case.** Same actor + same goal + same trigger ⇒ one use case.
4. **The use case is purely functional.** It contains no technical detail anywhere, under any section.
5. **Output language follows the user.** Write the document in the language the user is working in (commonly Spanish); keep this skill's structure.
6. **Generate both artifacts.** A use case named `UC-XXX.md` must have a sibling `UC-XXX-acceptance-criteria.md` in the same directory.
7. **Acceptance criteria are deterministic.** Translate only behavior stated or directly implied by the use case; do not add assumptions silently.
8. **Acceptance criteria are executable.** Use `Given`, `When`, `Then`, and `And` with observable business behavior, without choosing a test framework or naming implementation details.

## Procedure

### Step 1 — Classify the input

| Input type | First move |
| --- | --- |
| Informal requirement | Extract candidate actor, goal, trigger; list the gaps. |
| Existing code to reverse-engineer | Read only the entry points (routes, controllers, screens) to recover observable behavior. Do not read internal layers yet. |
| Partial or messy use-case doc | Identify which sections are missing and which contain implementation leakage. |
| Nothing concrete | Ask what outcome the use case must produce. |

### Step 2 — Interview (mandatory)

Use the ask-questions tool when available; otherwise ask a compact numbered list. Ask **only** what cannot be inferred from the input, and never more than one round of questions before drafting.

Cover these groups:

1. **Actor and goal** — who gets the value, and what do they want, in their own words?
2. **Trigger and preconditions** — what starts it, what must already be true?
3. **Observable outcome** — how does the actor know they succeeded?
4. **Main flow** — which steps does the actor take, and what does the system answer?
5. **Alternates and errors** — what valid variations exist? What happens when it fails?
6. **Business rules** — domain constraints the behavior must respect.
7. **Quality expectations** — express as verifiable business qualities (e.g. "dates must look the same regardless of where the user is"), never as techniques.
8. **Out of scope** — what this use case deliberately excludes.
9. **Identity and destination** — ID, name, priority, state, target file path.

If the user cannot or will not answer a question, propose a concrete answer and mark it explicitly as an assumption for confirmation. Do not leave silent blanks.

### Step 3 — Decide granularity

Split into separate use cases when **any** of these change:

- actor
- goal
- trigger
- observable result
- independent value (one can exist without the other)
- nature of the interaction (read vs write)

Merge into **one** use case when actor, goal, and trigger are the same, even if the surface has several screens or views — those are alternate presentation courses, not new use cases.

Anything that only makes sense inside another use case is a **subfunction**, not a use case. Domain rules, schema, and validation constraints are not use cases either.

Assign the next free `UC-XXX` ID by checking the existing use-case folder before naming the file.

### Step 4 — Draft from the template

Copy [the template](./assets/use-case-template.md) and fill it. Keep the main flow written as **actor → system → response**, and never name a class, route, or tag anywhere in the document.

### Step 5 — Derive acceptance criteria

Copy [the acceptance criteria template](./assets/acceptance-criteria-template.md) and derive a companion document from the completed use case.

- Create one happy-path scenario from the main flow.
- Create one scenario for each alternate flow (`A#`).
- Create one scenario for each exception (`E#`) and each explicitly applicable edge case.
- Derive `Given` steps from preconditions and relevant business rules.
- Derive `When` steps from the actor action or trigger that starts the flow.
- Derive `Then` steps from observable responses and postconditions.
- Use `And` only to split independent conditions or outcomes in the same scenario.
- Add a `Ref` to the source flow, exception, edge case, or rule for traceability.
- When a category does not apply, state that explicitly in the document; never invent a scenario.

Each scenario must be independently understandable, deterministic, and convertible into an automated test without adding missing business decisions.

### Step 6 — Validate before delivering

- [ ] Actor, objective, trigger and observable result are all present.
- [ ] The body contains no implementation detail (no endpoints, no classes, no markup, no framework terms).
- [ ] Every alternate is coded `A#`, every exception `E#`, and each appears in the postconditions.
- [ ] Main flow uses actor → system → response, and ends with an explicit result.
- [ ] Non-functional requirements are verifiable business qualities, not techniques.
- [ ] Failure postcondition is described, not only the success one.
- [ ] The document is purely functional; it stays in business language end to end.
- [ ] Language is consistent throughout and matches the user's working language.
- [ ] A sibling `UC-XXX-acceptance-criteria.md` exists beside the use-case document.
- [ ] Acceptance criteria contain `Given`, `When`, and `Then` for every scenario; `And` is used only when needed.
- [ ] The happy path, every applicable `A#`, every `E#`, and every explicitly stated edge case are covered.
- [ ] Each scenario has a `Ref` traceable to the use case and contains only observable behavior.
- [ ] Scenarios are independent, deterministic, and executable as tests without implementation details.
- [ ] Non-applicable flow categories are stated explicitly instead of being fabricated.

### Step 7 — Save and report

Default destination: `docs/use-cases/UC-XXX.md` when the repository uses that convention; otherwise use the path the user gave. Save `UC-XXX-acceptance-criteria.md` in the same directory. Then report:

- both file paths written;
- any assumption left open for confirmation;
- any flow category that does not apply;
- any criterion that cannot be made executable because the use case lacks a business decision;
- the next use case the current one implies (e.g. the write-side counterpart of a read-only use case).

## Common Pitfalls

- **Writing a UI specification.** "Shows a table with a caption" is not a use case.
- **Leaking implementation.** Endpoint paths, class names and config keys do not belong in a use case at all.
- **Cramming CRUD into one use case.** Each verb with its own actor goal is its own use case.
- **Silent assumptions.** An unmarked guess is worse than an explicit question.
- **Starting to write too early.** The most common failure is drafting before the interview.

## Resources

- [Use case template](./assets/use-case-template.md)
- [Acceptance criteria template](./assets/acceptance-criteria-template.md)
