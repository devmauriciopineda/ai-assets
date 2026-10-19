# UC-XXX — {Use case name} — Acceptance Criteria

<!--
AGENT NOTES
- Replace every {placeholder}. Remove a scenario section only when its category does not apply, and state that explicitly.
- Keep narrative in the same language as the use case. Keep Given, When, Then and And unchanged for Gherkin compatibility.
- Each scenario must describe observable business behavior and be independently executable as a test.
- Do not add endpoints, class names, selectors, framework syntax or other implementation details.
-->

## Feature

**ID:** UC-XXX  
**Use case:** {Use case name}  
**Source:** [UC-XXX.md](./UC-XXX.md)

{Short statement of the value or behavior being verified.}

## Execution rules

- Scenarios are independent and may run in any order.
- `Given` describes preconditions and relevant business rules.
- `When` describes the actor's action or the triggering event.
- `Then` describes observable responses and resulting business state.
- `And` extends the preceding step without introducing a new phase.
- Each scenario must be traceable to its source flow, exception, edge case, or rule through `Ref`.

## Scenarios

### Scenario: {happy-path outcome}

**Ref:** Main flow  

Given {the required precondition}  
And {a relevant business rule, if needed}  
When {the actor performs the action or the trigger occurs}  
Then {the observable successful response}  
And {the successful postcondition, if needed}

### Scenario: {alternate outcome}

**Ref:** A1 — {alternate flow description}  

Given {the precondition that makes this alternate applicable}  
When {the actor performs the alternate action or the alternate condition occurs}  
Then {the observable alternate response}  
And {the resulting state}

### Scenario: {exception or edge-case outcome}

**Ref:** E1 / Edge case — {source description}  

Given {the precondition and boundary condition}  
When {the actor action or trigger occurs}  
Then {the observable failure or boundary response}  
And {the failure or boundary postcondition}

## Coverage notes

- **Happy path:** Covered by `{scenario name}`.
- **Alternate flows:** {List each `A#` scenario, or state `Not applicable` with a reason.}
- **Exceptions:** {List each `E#` scenario, or state `Not applicable` with a reason.}
- **Edge cases:** {List each edge-case scenario, or state `Not applicable` with a reason.}
