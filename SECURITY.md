# Security Policy

## Supported version

Security fixes are applied to the latest code on `main` and the current GitHub Pages deployment. Older commits and forks are not maintained by this project.

## Reporting a vulnerability

Please do not disclose a suspected vulnerability in a public issue, discussion, or pull request.

Use GitHub's [private vulnerability reporting form](https://github.com/alzin/SkyPath/security/advisories/new). Include:

- the affected URL, file, or code path;
- steps to reproduce the issue;
- its likely impact;
- any suggested mitigation; and
- whether you plan to publish details, and on what timeline.

The maintainer will review the report, keep communication within the private advisory, and coordinate a fix and disclosure when appropriate. Please allow a reasonable period for investigation before publishing details.

## Project scope

SkyPath is a static, client-only visualization. It has no backend, authentication, storage, analytics, or connection to real aircraft. Reports about the following are especially useful:

- script or content injection;
- compromised or incorrectly pinned external resources;
- unsafe changes to content handling;
- deployment-workflow vulnerabilities; and
- ways the project could misleadingly present simulated behavior as real flight-control guidance.

General bugs, rendering problems, and feature requests belong in GitHub Issues rather than a private advisory.
