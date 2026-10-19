---
name: readme-generator
description: Use this skill when you need to create or update a repository README.md from the actual project structure and codebase. It produces a concise, professional Markdown document covering project purpose, functionality, architecture, technology stack, APIs or services, repository layout, installation, execution, and basic usage for any type of project. The README can be generated in English or Spanish depending on the repository context and user requirement.
---

# README Generator for Any Repository

## Purpose
Create a clear, professional, and concise README.md for any project type, including frontend apps, backend services, libraries, CLIs, monorepos, scripts, and technical utilities. The generated content must reflect the repository as it actually exists and must avoid guessing or inventing details.

## When to use this skill
Use this skill when:
- a repository needs a README.md
- an existing README is outdated or incomplete
- the project description, installation flow, or architecture needs to be documented
- the repo is being handed off to another developer or contributor
- a brief but structured project overview is required for onboarding

## General rules
1. Inspect the repo structure and relevant files before writing.
2. Identify the real project type and architecture: frontend, backend, library, CLI, API, script, monorepo, or full-stack app.
3. Keep the README brief: maximum two Markdown pages.
4. Write in the language appropriate to the project context. If the repo is in English, write in English; if it is in Spanish, write in Spanish. If the user specifically requests an English README, generate the README in English even if the rest of the repo is in Spanish.
5. Base every claim on evidence from the repo. Do not invent libraries, commands, services, APIs, or folder structure.
6. If something does not apply, state it explicitly, such as “Not applicable” or “No external API used”.
7. Prefer clear headings, compact bullets, and direct technical language.
8. The README should help a developer understand the project quickly without reading the entire codebase.

## Required README sections
The generated README should include these sections, in order:

# Project Title

## Project description
Explain what the project is, what problem it solves, and why it exists.

## General functionality
Describe the main features, capabilities, or user flows.

## Architecture overview
Summarize the project structure, layers, components, services, data flow, or key responsibilities.

## Technology stack
List the actual technologies used: languages, frameworks, libraries, tooling, runtime, deployment platform, testing tools, etc.

## Use of APIs or external services
Document whether the repository consumes APIs, databases, cloud services, SDKs, or third-party integrations. If not, state that no external API is used.

## General repository structure
Describe the main folders and their purpose.

## Installation guide
Include prerequisites, dependencies, setup steps, and any configuration requirements.

## Run guide
Explain how to run the project locally, including real commands when available.

## Basic usage
Describe the main usage flow for a developer or end user.

## Additional notes
Add configuration details, constraints, licensing information, known caveats, or future improvements if relevant.

## Example output template

```md
# Project Name

## Project description
...

## General functionality
...

## Architecture overview
...

## Technology stack
- ...

## Use of APIs or external services
...

## General repository structure
```text
/
├── src/
├── app/
├── docs/
├── tests/
├── README.md
└── package.json
```

## Installation guide
1. Requirements
2. Installation
3. Environment variables (if any)

## Run guide
```bash
# real command example
```

## Basic usage
...
```

## Quality bar
- Reusable across many repository types
- Based on repository evidence, not assumptions
- Clear, concise, and easy to scan
- Technically accurate and actionable
- Free of marketing language or filler content

## Final output
Generate only the final Markdown content for the README, ready to be saved at the repository root and adapted to the project being documented.
