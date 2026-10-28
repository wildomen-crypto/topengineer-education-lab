# Standalone checkout verification

The site is now its own Git repository, independent of the parent Tekla component-editor repository. All 23 variants, source code, local assets, original image mockups, pricing fixtures and saved QA evidence are retained. `node_modules`, `dist`, logs and environment files are ignored. No GitHub credential is written into source files or the remote URL.

Verified on Node 24.14.1 / npm 11.11.0:

- Fresh Git clone into a new temporary folder, without copying installed dependencies or build output.
- `npm ci` succeeds from the committed lockfile.
- `npm run check` succeeds: production build, eight pricing tests and four existing hosting tests.
- `sharp` loads from the clone's installed dependencies (0.35.5); the old machine-specific module paths have been removed.
- `Open-Preview.ps1 -NoBrowser -Port <free port>` builds and starts a new loopback server using Node, without Python.
- The same launcher reuses that running project server on its second invocation.
- Direct HTTP requests return 200 for variant 23, the education hub, mockup gallery, classroom image and asset map.
- The temporary verification server is stopped afterwards; the user's original preview server is left running.

`DEPLOYMENT.md` contains fresh-machine setup, everyday startup, Windows background startup, troubleshooting, hosting notes and a ready-to-copy task for Codex. `AGENTS.md` links it and records current product rules. The Windows launcher is UTF-8 with BOM and is checked out with CRLF for Windows PowerShell compatibility.

No website design or pricing behaviour was changed for this handoff. Publication is a private source-code repository; external website hosting is a separate action.

Result: **passed**.
