# UC-XXX — {Use case name}

<!--
AGENT NOTES
- Replace every {placeholder}. Remove any section that does not apply, except 1, 2, 5, 6 and 7.
- Body language: business only. No endpoints, class names, markup, framework or config terms.
- The document is purely functional; keep the whole body in business language.
- Heading translation: if the document is in Spanish use
  1 Identificación · 2 Objetivo · 3 Precondiciones · 4 Disparador · 5 Flujo principal ·
  6 Flujos alternos y excepciones · 7 Postcondiciones · 8 Reglas de negocio ·
  9 Requisitos no funcionales relevantes · 10 Fuera de alcance
-->

## 1. Identification

| Field | Value |
| --- | --- |
| ID | UC-XXX |
| Name | {short, verb-led name} |
| Main actor | {who obtains the value} |
| Level | Summary / User goal / Subfunction |
| System | {product or service name} |
| Priority | {High / Medium / Low + why} |
| State | Proposed / Approved / Implemented |

## 2. Objective

{One or two sentences. What the actor wants to achieve and the value they get, in their own language.}

## 3. Preconditions

- {What must already be true for the use case to start.}

## 4. Trigger

{The single event that starts the interaction.}

## 5. Main flow

1. The actor {does something}.
2. The system {responds}.
3. {…}
4. **Result:** {the observable outcome for the actor}.

## 6. Alternate flows and exceptions

| Code | Situation | System response |
| --- | --- | --- |
| A1 | {valid variation} | {how the system responds} |
| E1 | {failure} | {how the system informs and what the actor can do} |

## 7. Postconditions

- **Success:** {state after a successful run. State explicitly when no data changes.}
- **Failure (E1):** {state after the failure.}

## 8. Business rules

- {Domain constraint the behavior must respect.}

## 9. Relevant non-functional requirements

- **{Quality}:** {verifiable business expectation, no technique named.}

## 10. Out of scope

- {What this use case deliberately does not cover.}


