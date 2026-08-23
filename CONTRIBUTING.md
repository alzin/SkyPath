# Contributing to SkyPath

Thanks for helping improve SkyPath. Contributions to the visualization, accessibility, documentation, performance, and flight-pattern library are welcome.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use a bug report for reproducible defects and a feature request for proposed behavior.
- For a broad refactor, new runtime dependency, or major visual direction, open a discussion first so the approach can be agreed before substantial work begins.
- Never use the project as flight-control or safety software. Simulated values and paths are illustrative.

## Local setup

1. Fork the repository and clone your fork.
2. Create a focused branch from `main`.
3. Install the development tooling.
4. Run the static site locally.

```sh
git clone https://github.com/YOUR-USERNAME/SkyPath.git
cd SkyPath
git switch -c your-change
npm ci
python -m http.server 8000
```

Open <http://localhost:8000/>. The app itself has no build step; npm is used only for repository checks.

## Making changes

- Keep pull requests focused and avoid unrelated formatting churn.
- Preserve the client-only, no-account, no-tracking behavior unless a proposal has been discussed.
- Keep executable external dependencies version-pinned and integrity-protected; prefer versioned or self-hosted assets where practical.
- Treat any future external or user-provided content as untrusted; do not insert it with `innerHTML`.
- Maintain keyboard, mouse, touch, and responsive behavior.
- Update documentation when behavior, controls, dependencies, or supported patterns change.
- Include before-and-after screenshots for visible changes.

### Adding a flight pattern

Add an object to `PATTERNS` in `index.html` with:

- a unique `id`, display index, name, and category tag;
- clip and preview durations;
- a plain-language description and four key specifications;
- an SVG path glyph;
- `pos(progress)`, returning a `THREE.Vector3` for normalized progress from `0` through `1`;
- `phase(progress)`, returning a short live-status label.

Keep the trajectory continuous, confirm the subject remains framed, and update the flight-pattern table in `README.md`.

## Validate your change

Run the automated checks:

```sh
npm test
```

Then complete the relevant manual smoke tests:

- Load the page without console errors.
- Exercise patterns 1–5.
- Play, pause, replay, and scrub with pointer and keyboard input.
- Change playback speed.
- Toggle Chase and Compare modes.
- Collapse and expand the on-board camera.
- Orbit and zoom with mouse or touch.
- Check a wide desktop viewport and a narrow/mobile viewport.
- Confirm the page still explains a failed Three.js download cleanly.

## Pull requests

- Use a clear, imperative title.
- Explain the problem, solution, and tradeoffs.
- Link related issues with `Closes #123` when appropriate.
- Complete the pull request checklist honestly.
- Keep commits reviewable; maintainers may squash them when merging.

Maintainers may ask for changes to keep the app secure, understandable, accessible, and lightweight.
