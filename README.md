# ADHD: Anti-Drift-Harness-Development

A team-review deliverable proposing seven approaches for keeping the development chain in sync as a project grows: walker, fingerprint heatmap, symbiotic chain evals, commit-narrative spine, per-file dependency manifest, stop-hook drift sweep, and the layered tile board. Each approach names the Claude Code hook events it consumes, the skill files it ships, and a tile-based visual for its surface.

The deliverable also proposes an external observer topology: multiple Claude Code sessions watch a single builder project from outside, run their own checks, and drop tickets into the project's `.tickets/` folder. The builder's own agent reads tickets at session and turn boundaries.

## View the site

Live build: see the URL printed by the GitHub Pages deploy workflow under the repo's Actions tab, or the link shown in Settings → Pages once the first run completes.

To view locally:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open the local URL. The page fetches `approaches.json` so a static server is required.

## Layout

- `index.html`: the multi-tab Vue 3 (CDN) page that loads `approaches.json` and renders Overview, Approaches, Topology, Compare, Pairings, and Open Questions tabs.
- `approaches.json`: the source of truth for the seven approaches and the observer topology.
- `CLAUDE.md`: project instructions for any Claude Code session that opens this repo.
- `_prompt/00-writing-style-guide.md`: the style guide all written output in this repo conforms to.
- `_prompt/CHECKS.md`: catalogue of the four-team scanner harness referenced from the JSON.
- `.github/workflows/deploy.yml`: GitHub Actions workflow that builds and deploys the site to GitHub Pages.

## Deploy

Push to `main`. The workflow at `.github/workflows/deploy.yml` runs `actions/upload-pages-artifact` with the repo root as the source, then `actions/deploy-pages` publishes it. First-time setup requires Settings → Pages → Source = "GitHub Actions" in the repo.

## Writing style

Every artifact in this repo conforms to `00-writing-style-guide.md`. JSON description fields, UI strings, and commit messages are held to the same standard as prose.
