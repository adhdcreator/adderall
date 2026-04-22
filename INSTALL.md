# Install Guide

`adderall` ships as an npm package with a CLI. A single `SKILL.md` per dosage is shared across Claude, Cursor, Codex, and Hermes — no per-platform forks.

```bash
# Default: install on every supported platform, user scope
npx adderall install all
```

Everything below is optional reference material. For most users the command above is the whole install.

---

## Requirements

- **Node.js ≥ 18** (for `npx`). The CLI itself has zero runtime dependencies.

Verify with:

```bash
node --version   # should print v18.x or newer
```

## CLI Overview

```text
npx adderall <command> [options]

Commands:
  install <platform>        Install adderall on a platform (or 'all')
  uninstall <platform>      Remove adderall from a platform (or 'all')
  doctor                    Report where adderall is installed
  list                      List the 7 dosages and their profiles
  info <dose>               Print a dosage's SKILL.md
  help                      Show the full help screen

Options:
  --project                 Install at project scope (./.<platform>/skills)
  --link                    Use symlinks instead of copies (dev mode)

Platforms:
  claude, cursor, codex, hermes, all
```

---

## 1. Claude

Claude Agent Skills are directories containing a `SKILL.md` with YAML frontmatter. Claude reads the top-level `name` and `description` and treats the body as the skill's instructions. Extra fields (`version`, `author`, `metadata`, …) are ignored.

Reference: <https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview>

### Claude Code (CLI)

```bash
npx adderall install claude            # → ~/.claude/skills/adderall-<dose>
npx adderall install claude --project  # → ./.claude/skills/adderall-<dose>
```

Claude Code auto-discovers skills from these directories at session start. Trigger them by mentioning the dosage or prefixing a target skill with `/adderall-<dose>`.

### Claude Desktop / claude.ai

These surfaces expect an uploadable `.zip` per skill. Build one for every dosage by copying the installed directory and zipping it:

```bash
npx adderall install claude
cd ~/.claude/skills
for d in adderall-*; do zip -qr "$d.zip" "$d"; done
```

Then upload each zip in **Settings → Capabilities → Skills → Upload Skill** and toggle it on.

### Frontmatter compliance

- `name`: lowercase, letters / numbers / hyphens, ≤ 64 chars.
- `description`: ≤ 1024 chars, written as a trigger statement.

All seven `adderall-*` skills satisfy both limits.

---

## 2. Cursor

Cursor's Agent Skills use the same `SKILL.md` convention as Claude. User-installed skills live at `~/.cursor/skills/<name>/SKILL.md`; project-level skills at `<repo>/.cursor/skills/<name>/SKILL.md`.

### Install

```bash
npx adderall install cursor            # → ~/.cursor/skills/adderall-<dose>
npx adderall install cursor --project  # → ./.cursor/skills/adderall-<dose>
```

Restart the Cursor agent pane (or the IDE) to re-scan the skills directory. The dosages appear in the slash-command menu as `/adderall-5mg`, `/adderall-7.5mg`, …, `/adderall-30mg`.

### Compatibility notes

- Cursor ignores the `metadata.hermes` block and any fields it does not recognise.
- `.cursor/rules/` and `.cursor/skills/` coexist without conflict — skills only load when their description matches the current context.

---

## 3. Codex (OpenAI)

Codex CLI consumes skills via two complementary mechanisms:

1. **`~/.codex/skills/`** — Codex scans this directory for auxiliary prompt bundles when present.
2. **`AGENTS.md`** — the canonical way to inject persistent instructions. The CLI writes a small delimited block into `AGENTS.md` that lists the available dosages, leaving the rest of the file untouched.

Reference: <https://developers.openai.com/codex>

### Install

```bash
npx adderall install codex            # → ~/.codex/skills + ~/.codex/AGENTS.md
npx adderall install codex --project  # → ./.codex/skills + ./AGENTS.md
```

The CLI writes this block into the target `AGENTS.md`:

```markdown
<!-- adderall:begin v1.3.0 -->
## adderall — dosage meta-skill pack

When the user prefixes a target skill with `/adderall-<dose>` (one of 5mg,
7.5mg, 10mg, 12.5mg, 15mg, 20mg, 30mg), load the corresponding SKILL.md
from the adderall skills directory and execute the target skill through
its adherence / flexibility lens.

Available dosages:
  - adderall-5mg     → exploration  (0.10 / 0.90)
  - adderall-7.5mg   → guidance     (0.25 / 0.75)
  - adderall-10mg    → balanced     (0.50 / 0.50)
  - adderall-12.5mg  → high         (0.70 / 0.30)
  - adderall-15mg    → near-strict  (0.85 / 0.15)
  - adderall-20mg    → strict       (0.95 / 0.05)
  - adderall-30mg    → literal      (1.00 / 0.00)
<!-- adderall:end -->
```

Rerunning `install codex` is **idempotent**: it strips any existing `adderall:begin / adderall:end` block and rewrites a fresh one. Your other `AGENTS.md` content is preserved.

---

## 4. Hermes Agent

### Via the CLI

```bash
npx adderall install hermes            # → ~/.hermes/skills/adderall-<dose>
```

### Via the Hermes skills hub

```bash
hermes skills tap add adhdcreator/adderall
hermes skills install adderall-10mg
# or everything:
hermes skills install adderall-5mg adderall-7.5mg adderall-10mg \
                      adderall-12.5mg adderall-15mg adderall-20mg adderall-30mg
```

Hermes reads the full frontmatter including `metadata.hermes.tags` and `related_skills`.

---

## Uninstall

```bash
npx adderall uninstall claude
npx adderall uninstall cursor
npx adderall uninstall codex     # also strips the AGENTS.md block
npx adderall uninstall hermes
npx adderall uninstall all
```

Uninstall removes the installed skill directories (and the Codex `AGENTS.md` block); it never touches the upstream `skills/` inside the npm package.

## Verify

```bash
npx adderall doctor
```

Example output:

```text
==> adderall v1.3.0 — installation report
  Claude (user)     7/7     /home/alex/.claude/skills
  Claude (proj)     not installed  /home/alex/project/.claude/skills
  Cursor (user)     7/7     /home/alex/.cursor/skills
  Codex (user)      7/7     /home/alex/.codex/skills
  AGENTS.md (user)  1/1     /home/alex/.codex/AGENTS.md
  Hermes            0/7     /home/alex/.hermes/skills
```

## Developer Mode

If you cloned this repo and want installs to reflect edits immediately, use `--link`:

```bash
git clone https://github.com/adhdcreator/adderall
cd adderall
node bin/adderall.js install all --link
```

This symlinks the skill directories in-place instead of copying. Edits to `skills/adderall-*/SKILL.md` take effect without a reinstall.
