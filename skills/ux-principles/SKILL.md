---
name: ux-principles
description: 'Generate a concise UX Principles document (principios de UX / principios UX) for a software product from product context that already exists. Use when asked to derive, write, update or review transversal UX principles, experience-level design rules, or a UX principles guide for a product, feature set or roadmap phase — and to evaluate design decisions against them. Produces a lightweight markdown document with roughly 5–10 principles. Do not use for UX specifications, UI specs, design systems, user flows or functional requirements.'
argument-hint: '[product name or path to product context]'
---

# UX Principles Generator

## When to Use

- A product needs its transversal UX principles defined.
- Existing principles must be reviewed or updated after a new phase.
- Design decisions across features or phases need a common reference.

**Not this artifact:** UX specification, UI specification, design system, user flows, or functional requirements. Screen-level detail belongs elsewhere.

## Inputs

Assume the following are already available (documents, structured requirements, specs, or conversation): product vision/purpose, target users, roadmap or initial scope, use cases or functional requirements, and known cross-cutting constraints.

Do not request information that can be derived from what is on hand. If a genuinely essential input is missing, name the gap — never invent it.

## Procedure

1. **Establish product context.** Identify what the product is, what problem it solves, who uses it, what users try to accomplish, and what makes its interaction model distinctive. Do not infer user traits the source does not support.
2. **Extract experience constraints.** Keep only those relevant to this product, e.g. information fidelity, privacy, safety, accessibility, trust, user control, transparency, conversational interaction, error handling, data precision, domain or regulatory rules.
3. **Scan use cases and requirements** for recurring experience decisions: how users initiate actions, how the system responds, how ambiguity is handled, how errors are communicated, what is exposed versus hidden, what users must understand, what the system must never assume, where users retain control, how success and failure are communicated. Do not promote every requirement into a principle.
4. **Form candidate principles** by grouping related requirements into a broader experience rule. Prefer the reusable rule over the narrow one.
5. **Remove redundancy.** Merge principles that express the same idea.
6. **Test each candidate:** (a) relevant to more than one feature? (b) can a designer choose between two alternatives with it? (c) supported by the available information? (d) independent of a specific implementation? (e) durable as the product evolves? Drop candidates where most answers are no.
7. **Prioritize** by breadth of product impact, protection of important user needs, resolution of recurring design decisions, and strength of evidence. No numeric scoring or ranking unless explicitly requested.
8. **Write the document** using [the template](./assets/ux-principles-template.md): Purpose, Scope, Principles, Application. Do not add sections merely to look complete.

## What Qualifies as a Principle

Transversal · actionable · stable · concise · product-specific enough to be useful · independent of a screen or component.

Example forms (illustrations of style, not principles to copy):

- "The user should not need to understand the system's internal structure to accomplish a task."
- "When information is ambiguous, the product should clarify rather than silently assume."
- "The interface should expose complexity progressively rather than presenting all available information at once."

## What Does Not Qualify

| Anti-example | Belongs in |
|---|---|
| "The system shall allow the user to export a report." | Requirements / use cases |
| "The frontend shall use React components." | Technical architecture |
| "The primary button shall have a 12 px border radius." | UI specification / design system |
| "After submitting the form, show a confirmation dialog." | User flow / interaction spec — unless it reflects a product-wide rule |
| "Make the interface intuitive." / "Use consistent colors." | Nowhere — generic advice without product relevance |

## Principle Format

```markdown
## UX-01 — Short principle name

One concise paragraph stating the principle.

### Implication

Include only when the principle admits two or more plausible interpretations
that would lead to different design decisions. Otherwise omit it.
```

## Writing Rules

- Use clear, direct language from the user's or product-experience perspective.
- Prefer "The product should ask for clarification when the user's intent is ambiguous." over "The product should strive to provide an intuitive and seamless experience."
- No marketing language. No unsupported claims about users. No principle added merely because it is common industry practice.
- Avoid implementation-specific language unless the implementation itself is an explicit product constraint.

## Boundaries

Artifact chain:

```
Product vision → UX Principles → Use cases / requirements
→ User flows / interaction design → UI design / design system → Implementation
```

The relationship is not strictly sequential: existing use cases may reveal principles, and implementation experience may refine them. Treat the document as a living product-level artifact, not a one-time deliverable.

## Evolution

When a new phase introduces a recurring experience concern:

1. Check whether an existing principle already covers it.
2. If so, apply the existing principle.
3. If not, judge whether the concern is transversal enough to justify a new principle.
4. Add one only when it provides reusable guidance beyond the current feature.

Do not modify principles merely because an individual screen or use case changes.

## Output Requirements

- Written in English unless the user specifies another language.
- Self-contained, using the project's terminology.
- Only principles supported by the available information — never invent one.
- Approximately 5–10 principles, but fewer when appropriate; the count is not a target.
- No duplicated requirements or UI specifications.
- Concise enough to serve as a practical reference for designers and developers.
- Clearly distinguishes principles from implementation decisions.
