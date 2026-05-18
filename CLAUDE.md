# Project Instructions

## Mandatory writing style

Every artifact produced in this repository must conform to `_prompt/00-writing-style-guide.md`. That includes prose in chat replies, code comments, commit messages, README copy, documentation, JSON description fields, UI strings, and slide or HTML deliverables. Apply the reviewer's checklist before any deliverable is returned to the user.

Read `_prompt/00-writing-style-guide.md` at the start of any session that touches written output. Treat its hard rules as blocking. If a draft fails the checklist, rewrite before sending.

The most common failures to guard against:

1. "Not X, but Y" constructions in any form.
2. Em dashes and en dashes.
3. Four-part parallel listings (tetracolons).
4. Banned vocabulary: leverage, unlock, navigate (as metaphor), delve, robust, seamless, crucial, essential, vital, holistic, nuanced, intricate, comprehensive, significant (as filler), ecosystem (outside biology), landscape (as metaphor), journey, tapestry, fabric, game-changing, cutting-edge, state-of-the-art, world-class, best-in-class, next-generation.
5. Sentence openers: Moreover, Furthermore, In essence, At its core, Fundamentally.
6. "Ensure" as a hedge verb.
7. Vague intensifiers: very, really, truly, deeply, profoundly, incredibly, extremely, particularly.
8. Trailing participle phrases that restate the sentence.
9. Emojis and decorative ASCII.

## Project context

This directory holds a harness research workspace. The user runs four-team check sweeps (Green, Yellow, Red, Blue) against target codebases. `CHECKS.md` is the authoritative catalogue of what those checks do. Treat it as background when proposing new skills or hooks.

The active stack for any scaffolded application is Node.js and Vue.js. Visualization preferences: tile-based grids and 2D or 3D arrays. Dynamic force-directed knowledge graphs are out of scope.

## Working agreement

- Prefer plain declarative prose. Make a claim, support it, stop.
- Quote numbers when they are real. Round honestly. Do not use numbers as decoration.
- Do not narrate intent at the end of sections. End at the period.
- When generating JSON, apply the style guide to every `description`, `summary`, `pros`, and `cons` field. JSON is not exempt.
- When generating HTML, the user-facing copy is held to the same standard.

## Reference files

- `_prompt/00-writing-style-guide.md`: enforceable style rules.
- `_prompt/CHECKS.md`: the four-team check catalogue used as background for new harness skills.
- `_prompt/template.html`: the design template that index.html deliverables are based on (local only, gitignored).
