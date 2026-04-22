# Changelog

All notable changes to `adderall` are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-04-21

### Added
- CP437 ASCII banner (`assets/banner.txt`) and yellow-on-blue ANSI variant (`assets/banner.ans`) inspired by the repo's pharmacy-grade cover art.
- CP437 RX shelf with seven labeled pill bottles and two capsule glyphs (`assets/pills.txt`, `assets/pills.ans`).
- README embeds the banner and RX shelf as colored `ansi` fenced code blocks (GitHub renders them in color).
- `assets/render-ansi.py` — rebuilds `.ans` files and syncs README `` ```ansi `` bodies from the plain `.txt` sources (multi-color: orange vials, gray caps, capsule gradient, blue-on-yellow header).
- README section **Color and ASCII** explaining why `.txt` is monochrome and how ANSI works.

## [1.0.0] — 2026-04-21

### Added
- Initial release of the `adderall` dosage meta-skill pack.
- Seven dosage skills: `adderall-5mg`, `adderall-7.5mg`, `adderall-10mg`, `adderall-12.5mg`, `adderall-15mg`, `adderall-20mg`, `adderall-30mg`.
- Canonical `SKILL.md` template under `templates/`.
- Authoring guide (`AUTHORING.md`) and repository scaffolding (`assets/`, `docs/`).
