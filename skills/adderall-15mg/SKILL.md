---
name: adderall-15mg
description: Near-strict dosage for the adderall meta-skill pack — adherence 0.85, flexibility 0.15. Follow the target skill almost verbatim; deviations require explicit approval.
version: 1.0.0
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

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `0.85`                                  |
| Flexibility | `0.15`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-15mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-15mg` in the user message.
2. **Load the target skill** via the standard skill loader.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-15mg` instructions.
4. **Apply the near-strict lens.**
   - Execute every step of the target skill, in order, using its wording and structure wherever practical.
   - If a step is impossible or unsafe, **pause and ask the user** before deviating. Do not silently substitute.
   - Flexibility is limited to: filling in gaps the target skill does not address, and adapting phrasing to the current context.
5. **Execute** the task.
6. **Report.** Finish with `Applied adderall-15mg to /<target-skill>.`

## Pitfalls

- **Improvisation.** If the target skill does not mention something, it is often correct to do nothing about it. Don't invent.
- **Silent deviation.** Under `15mg`, deviation requires an explicit check with the user, not just a note.
- **Summarizing the skill.** The agent must execute the skill, not describe it.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Every step was executed in order, or the user was consulted before skipping.
- [ ] No invented sections beyond filling genuine gaps in the target skill.
- [ ] Final line names the dosage and target skill.
