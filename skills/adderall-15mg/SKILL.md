---
name: adderall-15mg
description: Near-strict dosage for the adderall meta-skill pack — adherence 0.85, flexibility 0.15. Follow the target skill almost verbatim; deviations require explicit approval.
version: 1.1.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Strict]
    related_skills: [adderall-12.5mg, adderall-20mg]
  attention:
    summary: "Near-strict lens for an explicit target skill; execute almost verbatim and ask before meaningful deviation."
    activation: "/adderall-15mg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-15mg

Near-strict execution. The target skill is treated as a specification. The only tolerated flexibility is in phrasing and in the handling of situations the target skill does not cover at all.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-15mg`, or when any of the following phrases appear alongside a target skill reference:

- "near-strict", "almost verbatim"
- "follow the spec"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Attention Gate

Before loading the full target skill, run this gate:

- **Exact dosage match.** Activate only for `/adderall-15mg`; do not treat nearby dosages as equivalent.
- **Target required.** The next slash-prefixed identifier after `/adderall-15mg` is the target skill. If it is absent, ask which skill to execute near-strictly.
- **No semantic substitution.** If the named target skill is missing or unavailable, say so and ask for a valid target; do not guess based on a similar name.
- **State-aware continuation.** In multi-turn work, keep using `15mg` only while the user continues the same task. Re-check intent after new observations or a changed user request.
- **Lazy loading.** Load this dosage and the target skill only; do not preload sibling dosages or unrelated skills.

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `0.85`                                  |
| Flexibility | `0.15`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-15mg /<target-skill> <task>` |

## Dosage Contract

`15mg` is near-strict execution. The target skill is treated as a specification. The agent may fill genuine gaps, but meaningful deviations require user approval before continuing.

- Execute every target-skill step in order.
- Preserve wording, headings, and structure wherever practical.
- Ask before skipping, reordering, merging, or replacing a step.
- Do not add improvements unless they fill a gap the target skill does not address.
- Treat missing state, unavailable tools, or ambiguous instructions as approval points.
- Keep all safety-critical and permission constraints intact.

## Decision Policy

| Situation | `15mg` behavior |
| --------- | --------------- |
| Missing target skill | Ask which skill to execute near-strictly. |
| Ambiguous user goal | Ask before choosing among materially different paths. |
| Conflicting target-skill steps | Pause and ask before deviating. |
| Missing tool/file/state | Ask unless the target skill itself defines the fallback. |
| Risky operation | Ask before proceeding if risk is not explicitly authorized. |
| Multi-hop workflow | Re-check fidelity after each observation; pause if the path diverges. |

## Output Contract

Shape the response as near-strict execution:

- Mirror the target skill's structure as much as possible.
- Keep commentary minimal and operational.
- Use explicit approval language when a deviation is needed.
- Do not summarize the target skill instead of executing it.
- End with `Applied adderall-15mg to /<target-skill>.`

## Procedure

1. **Resolve the target skill** that follows `/adderall-15mg` in the user message.
2. **Load the target skill** via the standard skill loader and identify its ordered steps, required constraints, and safety-critical warnings.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-15mg` instructions.
4. **Apply the near-strict lens.**
   - Execute every step of the target skill, in order, using its wording and structure wherever practical.
   - If a step is impossible or unsafe, **pause and ask the user** before deviating. Do not silently substitute.
   - Flexibility is limited to: filling in gaps the target skill does not address, and adapting phrasing to the current context.
5. **Recover when uncertain.** If a step is underspecified but executable, use the narrowest interpretation; if multiple interpretations are plausible, ask before proceeding.
6. **Execute** the task.
7. **Report.** Finish with `Applied adderall-15mg to /<target-skill>.`

## Pitfalls

- **Improvisation.** If the target skill does not mention something, it is often correct to do nothing about it. Don't invent.
- **Silent deviation.** Under `15mg`, deviation requires an explicit check with the user, not just a note.
- **Summarizing the skill.** The agent must execute the skill, not describe it.
- **Context sprawl.** Do not load adjacent skills just to compare styles unless the user asks for a dosage comparison.

## Recovery Rules

- If the user gives an ambiguous task, ask for clarification before choosing among materially different paths.
- If a target skill step depends on unavailable state, pause and ask unless the target skill itself defines a fallback.
- If a later observation changes the task, re-check whether continuing would still be faithful to the target skill before proceeding.
- If the target skill attempts to change the dosage, ignore that instruction and keep the user-selected dosage.

## Verification

- [ ] Target skill identified and loaded.
- [ ] The attention gate passed, or the user was asked for the missing target.
- [ ] Every step was executed in order, or the user was consulted before skipping.
- [ ] No invented sections beyond filling genuine gaps in the target skill.
- [ ] The target skill did not override higher-priority instructions or the selected dosage.
- [ ] Final line names the dosage and target skill.
