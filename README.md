# blobtoraw-githublinks

A tiny, client-side utility that converts GitHub "blob" URLs into raw.githubusercontent.com URLs. Lightweight, dependency-free, mobile-responsive, and includes a dark theme toggle.

[Demo](https://soumyadipkarforma.github.io/blobtoraw-githublinks) · [Issues](https://github.com/soumyadipkarforma/blobtoraw-githublinks/issues)

Badges
- Build / CI: ![ci-badge](https://img.shields.io/badge/ci-none-lightgrey)
- License: ![license-MIT](https://img.shields.io/badge/license-MIT-blue)

Table of contents
- [Why](#why)
- [Features](#features)
- [Quick start](#quick-start)
- [Usage examples](#usage-examples)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)
- [Credits](#credits)

Why
---
Many GitHub links point to the human-readable "blob" view (https://github.com/owner/repo/blob/...). Raw content consumers (scripts, CDNs, raw file embeds) require raw.githubusercontent.com links. This tool converts blob URLs to raw URLs quickly in the browser without any server-side code.

Features
---
- Convert blob URLs to raw.githubusercontent.com URLs
- Support for:
  - Branch reference (use a specified branch like `main`)
  - Commit reference (use the ref present in the blob URL)
- Strip line anchors (e.g. `#L10`) automatically
- Mobile-first responsive UI
- Dark mode (system preference + toggle)
- Clipboard copy with toast, and Web Share API support
- Single-file distribution (index.html) — no build required

Quick start
---
1. Clone or download the repository:
   ```bash
   git clone https://github.com/soumyadipkarforma/blobtoraw-githublinks.git
   cd blobtoraw-githublinks
   ```
2. Open `index.html` in your browser:
   - Double-click the file, or
   - Serve it with a static server:
     ```bash
     npx http-server .
     ```
3. Paste a GitHub blob URL, choose reference mode, click Convert, then Copy / Open / Share.

Usage examples
---
- Input:
  ```
  https://github.com/octocat/Hello-World/blob/main/README.md
  ```
  Branch mode (branch = `main`) → Output:
  ```
  https://raw.githubusercontent.com/octocat/Hello-World/main/README.md
  ```

- Input:
  ```
  https://github.com/octocat/Hello-World/blob/0f3c8f8/README.md#L10
  ```
  Commit mode → Output:
  ```
  https://raw.githubusercontent.com/octocat/Hello-World/0f3c8f8/README.md
  ```

Configuration
---
- The UI exposes a "Branch name" input used when "Branch reference" is selected.
- Theme preference is stored in localStorage under key `btg-theme`.
- UX behaviors:
  - Clipboard: uses `navigator.clipboard` where available, falls back to `document.execCommand`.
  - Share: uses Web Share API when available.

Development
---
- This project is intentionally single-file (index.html). To iterate:
  - Edit `index.html` (CSS/JS inline).
  - Open locally in a browser to test.
  - Optional: split assets into separate CSS/JS files for maintainability.

Contributing
---
- Found a bug or want a small improvement? Open an issue or submit a PR.
- Suggested contributions:
  - Add tests (if split into modules)
  - Improve accessibility (a11y)
  - Add more robust URL parsing and validation
  - Add unit tests for parsing logic

Troubleshooting
---
- If conversion returns "Please enter a valid GitHub blob URL":
  - Ensure the URL includes `/blob/` (raw URLs, tree URLs, or repo root URLs will not convert).
- If copy/share fails on older browsers, use the Open button and copy manually.

Roadmap
---
- Add optional CLI wrapper (node script) for batch conversions
- Add automated tests and CI
- Publish an embeddable widget version

License
---
MIT — see LICENSE file.

Credits
---
Built by soumyadip-karforma. Thanks to the OSS community for inspiration.

Customization notes (template)
---
- Replace demo/issue links and badges with real URLs for your repo/CI.
- If you move from single-file to modular files, document the build / start steps here.
