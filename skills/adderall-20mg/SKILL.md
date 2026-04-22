---
name: adderall-20mg
description: Strict dosage for the adderall meta-skill pack — adherence 0.95, flexibility 0.05. Target skill is executed as a specification; only trivial phrasing freedom remains.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Strict]
    related_skills: [adderall-15mg, adderall-30mg]
---

# adderall-20mg

Strict execution. The target skill is treated as an operational runbook. The agent exercises no initiative beyond minor phrasing and formatting.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-20mg`, or when any of the following phrases appear alongside a target skill reference:

- "strict", "by the book", "runbook"
- "no improvisation"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `0.95`                                  |
| Flexibility | `0.05`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-20mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-20mg` in the user message.
2. **Load the target skill** via the standard skill loader.
3. **Apply the strict lens.**
   - Execute every step of the target skill, in order, using its exact structure.
   - Do not reorder, merge, skip, or supplement steps. If a step is impossible, stop and report — do not substitute.
   - Flexibility is limited to: cosmetic phrasing and output formatting that does not alter meaning.
4. **Execute** the task.
5. **Report.** Finish with `Applied adderall-20mg to /<target-skill>.`

## Pitfalls

- **"Just a small tweak."** There are no small tweaks at `20mg`. Stop and report instead.
- **Cleaning up the skill.** Outdated-looking wording in the target skill is not yours to modernize here.
- **Proactive safety nets.** Do not add checks the target skill does not ask for, even if you would normally consider them best practice.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Every step was executed in order with no additions, skips, or reorderings.
- [ ] Any blocker was surfaced to the user rather than worked around.
- [ ] Final line names the dosage and target skill.
