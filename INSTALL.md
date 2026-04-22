# Install Guide

`adderall` ships a single `SKILL.md` per dosage. That same file is valid on every supported platform — there is no per-platform fork. Installation consists of **linking** the skill directories into the location each platform scans.

The provided installer at [`scripts/install.sh`](./scripts/install.sh) uses symlinks by default so updates to this repo are picked up without reinstalling.

---

## 1. Claude

Claude Agent Skills are plain directories containing a `SKILL.md` with YAML frontmatter. Claude reads the top-level `name` and `description` and treats the body as the skill's instructions. The fields `version`, `author`, `license`, and `metadata` are tolerated and ignored.

Reference: <https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview>

### Claude Code (CLI) — user-scope

```bash
./scripts/install.sh claude
```

Equivalent manual steps:

```bash
mkdir -p ~/.claude/skills
for dose in 5mg 7.5mg 10mg 12.5mg 15mg 20mg 30mg; do
  ln -sfn "$(pwd)/skills/adderall-${dose}" "$HOME/.claude/skills/adderall-${dose}"
done
```

Claude Code auto-discovers skills from `~/.claude/skills/` at session start. Trigger them by mentioning the dosage or prefixing a target skill with `/adderall-<dose>`.

### Claude Code (CLI) — project-scope

Some teams prefer pinning skills to the repo:

```bash
mkdir -p .claude/skills
ln -sfn ../../skills/adderall-10mg .claude/skills/adderall-10mg
```

### Claude Desktop / Claude.ai

The web and desktop Claude apps expect an uploadable `.zip` per skill. Generate one per dosage:

```bash
./scripts/install.sh claude-zip
# → dist/claude/adderall-5mg.zip, adderall-7.5mg.zip, …
```

Then in Claude Desktop / claude.ai → **Settings → Capabilities → Skills → Upload Skill**, select each zip. Enable the skill in the skill panel.

### Frontmatter compliance

Claude requires:

- `name` — lowercase, letters / numbers / hyphens, ≤ 64 chars.
- `description` — ≤ 1024 chars, written as a trigger statement.

All seven `adderall-*` skills satisfy both limits.

---

## 2. Cursor

Cursor's Agent Skills follow the same `SKILL.md` format pioneered by Claude. User-installed skills live at `~/.cursor/skills/<name>/SKILL.md`. Project-level skills can also be placed at `<repo>/.cursor/skills/<name>/SKILL.md`.

Reference: the in-editor **Create Skill** guidance at `~/.cursor/skills-cursor/create-skill/SKILL.md`.

### User-scope install

```bash
./scripts/install.sh cursor
```

Equivalent manual steps:

```bash
mkdir -p ~/.cursor/skills
for dose in 5mg 7.5mg 10mg 12.5mg 15mg 20mg 30mg; do
  ln -sfn "$(pwd)/skills/adderall-${dose}" "$HOME/.cursor/skills/adderall-${dose}"
done
```

Restart the Cursor agent pane (or the IDE) to re-scan the skills directory. The dosages appear in the slash-command menu as `/adderall-5mg`, `/adderall-7.5mg`, …, `/adderall-30mg`.

### Project-scope install

```bash
mkdir -p .cursor/skills
ln -sfn ../../skills/adderall-10mg .cursor/skills/adderall-10mg
```

### Compatibility notes

- Cursor ignores the `metadata.hermes` block and any fields it does not recognise.
- If you keep a `.cursor/rules/` folder, rules and skills coexist without conflict — skills are only loaded when their description matches the current context.

---

## 3. Codex (OpenAI)

Codex CLI does not (yet) have a first-class skill loader. Two complementary mechanisms are used:

1. **`~/.codex/skills/`** — Codex CLI scans this directory for auxiliary prompt bundles when present.
2. **`AGENTS.md`** — the canonical way to inject persistent instructions. The installer writes a small delimited block into `AGENTS.md` that lists the available dosages and points at their `SKILL.md` paths, leaving the rest of the file untouched.

Reference: <https://developers.openai.com/codex>

### Install

```bash
./scripts/install.sh codex
```

This runs two steps:

```bash
# 1) Link skill directories
mkdir -p ~/.codex/skills
for dose in 5mg 7.5mg 10mg 12.5mg 15mg 20mg 30mg; do
  ln -sfn "$(pwd)/skills/adderall-${dose}" "$HOME/.codex/skills/adderall-${dose}"
done

# 2) Merge an adderall block into ~/.codex/AGENTS.md
#    between <!-- adderall:begin --> and <!-- adderall:end --> markers
```

The merged block looks like this and is idempotent — rerunning `install.sh codex` replaces the block rather than appending:

```markdown
<!-- adderall:begin v1.2.0 -->
## adderall — dosage meta-skill pack

When the user prefixes a target skill with `/adderall-<dose>` (one of 5mg,
7.5mg, 10mg, 12.5mg, 15mg, 20mg, 30mg), load the corresponding SKILL.md
from ~/.codex/skills/adderall-<dose>/SKILL.md and execute the target skill
through its adherence/flexibility lens.

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

### Project-scope install

To scope adderall to a single repo rather than the whole Codex session, run the installer from the project root and pass `--project`:

```bash
./scripts/install.sh codex --project
```

This writes to `<repo>/AGENTS.md` instead of `~/.codex/AGENTS.md`, and links skills into `<repo>/.codex/skills/`.

---

## 4. Hermes Agent

Hermes is the reference platform for the frontmatter format used here. Two install modes:

### Via the Hermes CLI

```bash
hermes skills tap add adhdcreator/adderall
hermes skills install adderall-10mg
# or everything:
hermes skills install adderall-5mg adderall-7.5mg adderall-10mg \
                      adderall-12.5mg adderall-15mg adderall-20mg adderall-30mg
```

### Via symlink (development)

```bash
./scripts/install.sh hermes
```

Equivalent manual steps:

```bash
mkdir -p ~/.hermes/skills
for dose in 5mg 7.5mg 10mg 12.5mg 15mg 20mg 30mg; do
  ln -sfn "$(pwd)/skills/adderall-${dose}" "$HOME/.hermes/skills/adderall-${dose}"
done
```

Hermes reads the full frontmatter including `metadata.hermes.tags` and `related_skills`.

---

## Uninstall

```bash
./scripts/install.sh uninstall claude
./scripts/install.sh uninstall cursor
./scripts/install.sh uninstall codex
./scripts/install.sh uninstall hermes
./scripts/install.sh uninstall all
```

Uninstall removes the symlinks (never the source `skills/` directory) and, for Codex, strips the `<!-- adderall:begin --> … <!-- adderall:end -->` block from `AGENTS.md`.

## Verify

```bash
./scripts/install.sh doctor
```

Reports which platforms currently have adderall linked, which versions, and whether anything is stale.
