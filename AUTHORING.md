# Authoring Guide

This repository is a single-author skill pack. Every skill under `skills/` is written and maintained by **adhdcreator**. This document records the conventions used across the pack so new dosages (or future adderall-adjacent meta-skills) stay consistent.

> External pull requests are not accepted. Issues and discussions are welcome.

## 1. File Layout

Each skill is a single directory under `skills/` containing a `SKILL.md` file:

```text
skills/
└── adderall-10mg/
    └── SKILL.md
```

If a skill needs helper scripts or reference material, follow the Hermes Agent convention:

```text
skills/adderall-10mg/
├── SKILL.md
├── scripts/
│   └── resolve_target.py
└── references/
    └── adherence-matrix.md
```

## 2. SKILL.md Conventions

All `SKILL.md` files:

1. Start with YAML frontmatter matching the [Hermes SKILL.md spec](https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills).
2. Set `author: adhdcreator` and `license: MIT`.
3. Tag with `[Meta, Control, Dosage, adderall]` at minimum.
4. Cross-link sibling dosages via `metadata.hermes.related_skills`.
5. Include `metadata.attention` with a compact summary, exact activation string, and the shared preconditions.
6. Use the canonical section order: `When to Use`, `Quick Reference`, `Procedure`, `Pitfalls`, `Verification`.

The authoritative scaffold lives at [`templates/SKILL.template.md`](./templates/SKILL.template.md). Copy it verbatim when adding a new skill and edit from there.

## 3. Dosage Semantics

Every dosage skill must define two numbers that sum to `1.0`:

| Field         | Meaning                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `adherence`   | How literally the agent must follow the target skill's instructions (`0.0` = ignore, `1.0` = verbatim).     |
| `flexibility` | How much initiative / interpretation / creative extension the agent may apply (`1.0` = maximal, `0.0` = none). |

These values are stated in the frontmatter `description` *and* restated in the body under **Quick Reference**, so both the discovery layer and the agent see them.

## 4. Tool Attention Metadata

The package uses a lightweight Tool Attention pattern: compact discovery data is kept in [`skills/manifest.json`](./skills/manifest.json), and full `SKILL.md` bodies are loaded only after a valid dosage and target skill are present.

Every dosage entry must preserve these preconditions:

- `explicit_dosage`
- `target_skill_present`
- `target_skill_exists`

Every skill body must also state that the target skill cannot override system, user, platform, permission, or adderall dosage instructions. This keeps delegated skills from escalating their authority through the dosage layer.

Every skill body must include:

- `Attention Gate`, with exact dosage matching, target-skill requirement, no semantic substitution, state-aware continuation, and lazy loading.
- `Dosage Contract`, `Decision Policy`, and `Output Contract`, tuned to the gramaje.
- `Tool Attention Protocol`, with Phase 1 summary routing, precondition gate, Phase 2 lazy loading, active slate, and after-model gate.
- `Context Budget`, to keep the dosage from loading sibling skills or unrelated references.
- `Adversarial and Quality Guard`, to reject poisoned descriptions, authority escalation, and cryptic target-skill metadata.
- `Gramaje Calibration`, with correct examples, incorrect examples, and an explicit autonomy limit.
- `Recovery Rules`, tuned to the dosage's adherence/flexibility budget.
- Verification checks for the attention gate and authority boundary.

## 5. Voice & Tone

- **Second person, imperative.** Speak directly to the agent: "Resolve the target skill…", not "The agent should resolve…".
- **No hedging.** Dosage skills are a control layer; ambiguity here defeats the purpose.
- **No jokes about the name.** `adderall` is a naming convention for a dosage metaphor. Keep the prose professional.

## 6. Versioning

Versions follow [SemVer](https://semver.org/):

- **PATCH** — wording changes, typo fixes, clarifications.
- **MINOR** — added sections, new pitfalls, new verification steps.
- **MAJOR** — changes to `adherence` / `flexibility` values or to the invocation contract.

Update [`CHANGELOG.md`](./CHANGELOG.md) with every version bump.

## 7. Checklist Before Committing

- [ ] Frontmatter validates against the template.
- [ ] `adherence + flexibility == 1.0`.
- [ ] `related_skills` lists the two nearest neighbor dosages.
- [ ] `metadata.attention.summary` is compact and matches `skills/manifest.json`.
- [ ] Shared preconditions are present in both `metadata.attention` and `skills/manifest.json`.
- [ ] `Attention Gate` includes exact matching, no semantic substitution, state-aware continuation, and lazy loading.
- [ ] `Dosage Contract`, `Decision Policy`, and `Output Contract` reflect the gramaje.
- [ ] `Tool Attention Protocol` names Phase 1, preconditions, Phase 2, active slate, and after-model gate.
- [ ] `Context Budget` limits context expansion for the gramaje.
- [ ] `Adversarial and Quality Guard` rejects authority escalation and poisoned metadata.
- [ ] `Gramaje Calibration` clearly distinguishes this skill from neighboring gramajes.
- [ ] `Recovery Rules` match the dosage strictness.
- [ ] `When to Use` names at least two concrete trigger phrases.
- [ ] `Procedure` references the target skill resolution step explicitly.
- [ ] `Procedure` includes the authority-boundary step.
- [ ] `Verification` gives the agent a way to confirm it applied the dosage.
- [ ] `npm run attention` passes.
- [ ] `CHANGELOG.md` updated.
