# Checktable Agent Instructions

## Protected Files

- Do not modify `server.py`.
- Do not change backend behavior or the existing API contract unless the user explicitly requests it.
- Do not modify user changes that are unrelated to the current request.

## Scope Boundaries

- Only modify files necessary for the current request.
- Do not implement features that were not requested.
- Do not add optional improvements, speculative behavior, or unrelated refactors.
- Do not add dependencies unless the current requirement cannot reasonably be completed without them.
- Treat planning documents as context and references, not as permission to implement every item in them.

## Decision Ownership

- Product priorities, UX decisions, implementation order, and trade-offs belong to the user.
- Do not make product or scope decisions on behalf of the user.
- Do not replace an explicit user decision with a preferred architecture or workflow.
- When a requirement is ambiguous and the decision affects scope, ask the user before editing.
- When presenting an assumption that affects behavior, state it clearly instead of silently turning it into a requirement.

## Code Boundaries

- Keep API and SSE handling separate from presentation components where practical.
- Avoid duplicating backend response parsing across UI components.
- Preserve existing public interfaces unless the current request requires changing them.

## Coding Quality

- Prefer clear, readable code over clever or overly compressed code.
- Give variables, functions, components, and types meaningful names that describe their purpose.
- Keep each function focused on one primary responsibility. Split a function when it mixes unrelated concerns such as validation, transformation, API communication, and UI state updates.
- Before adding new code, inspect the nearby implementation and search for existing related functions, components, types, utilities, or adapters.
- Reuse existing code when it is an appropriate fit instead of creating a parallel implementation.
- Do not introduce an abstraction solely to remove a small amount of duplication.
- Follow the existing project style and avoid reformatting unrelated code.
- Use comments sparingly and explain intent or non-obvious decisions rather than restating the code.
- Avoid one-letter or vague names such as `data`, `item`, `temp`, or `result` when a more specific name is practical.
- Keep business logic, data transformation, API communication, and presentation responsibilities separate where practical.

## Change Discipline

- Do not commit, reset, or revert changes.
- Keep changes minimal and focused.
- Do not reformat unrelated code.
- After editing, run the narrowest relevant validation available for the requested change.
