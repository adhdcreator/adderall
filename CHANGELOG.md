# Changelog

All notable changes to `adderall` are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [1.3.0] — 2026-04-21

### Added
- Published as the **`adderall`** npm package. Install on any supported platform with `npx adderall install <platform|all>`.
- Node.js CLI (`bin/adderall.js`) implementing `install`, `uninstall`, `doctor`, `list`, `info`, and `help` — zero runtime dependencies, pure Node stdlib.
- Per-platform adapters in `src/platforms.js` for Claude, Cursor, Codex, and Hermes.
- `--project` scope flag (installs into `./.<platform>/skills` and `./AGENTS.md` for Codex).
- `--link` dev mode flag (symlinks instead of copies for live editing).
- Idempotent Codex `AGENTS.md` merge/strip between `<!-- adderall:begin -->` / `<!-- adderall:end -->` markers.

### Removed
- `scripts/install.sh` — superseded by the npx CLI.

### Changed
- README leads with `npx adderall install all` as the primary install method.
- `INSTALL.md` rewritten around the npx flow; legacy manual paths retained as reference.

## [1.2.0] — 2026-04-21

### Added
- Multi-platform installer at [`scripts/install.sh`](./scripts/install.sh) with `claude`, `claude-zip`, `cursor`, `codex`, `hermes`, `all`, `uninstall`, and `doctor` subcommands.
- Project-scope variants (`--project`) for Claude, Cursor, and Codex.
- Codex integration via a delimited, idempotent `<!-- adderall:begin --> ... <!-- adderall:end -->` block merged into `AGENTS.md`.
- [`INSTALL.md`](./INSTALL.md) documenting each platform's `SKILL.md` rules, install paths, and manual steps.
- Pharmacy-grade PNG cover art (`assets/banner.png`) and labelled pill shelf (`assets/bannerpills.png`) now rendered at the top of the README.

### Changed
- README replaces the embedded ANSI banner and ANSI pill rack with the PNG cover art.
- README now advertises compatibility with Claude, Cursor, Codex, and Hermes (single `SKILL.md` source of truth, no per-platform forks).

## [1.1.0] — 2026-04-21

### Added
- CP437 ASCII banner (`assets/banner.txt`) and yellow-on-blue ANSI variant (`assets/banner.ans`) inspired by the repo's pharmacy-grade cover art.
- CP437 RX shelf with seven labeled pill bottles and two capsule glyphs (`assets/pills.txt`, `assets/pills.ans`).
- README embeds the banner and RX shelf as colored `ansi` fenced code blocks (GitHub renders them in color).

## [1.0.0] — 2026-04-21

### Added
- Initial release of the `adderall` dosage meta-skill pack.
- Seven dosage skills: `adderall-5mg`, `adderall-7.5mg`, `adderall-10mg`, `adderall-12.5mg`, `adderall-15mg`, `adderall-20mg`, `adderall-30mg`.
- Canonical `SKILL.md` template under `templates/`.
- Authoring guide (`AUTHORING.md`) and repository scaffolding (`assets/`, `docs/`).
