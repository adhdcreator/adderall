---
name: adderall-12.5mg
description: High-adherence dosage for the adderall meta-skill pack — adherence 0.70, flexibility 0.30. Follow the target skill closely; deviate only with justification.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Adherence]
    related_skills: [adderall-10mg, adderall-15mg]
  attention:
    summary: "High-adherence lens for an explicit target skill; execute closely and justify any necessary deviation."
    activation: "/adderall-12.5mg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-12.5mg

The first dosage where adherence outweighs flexibility. The target skill is the plan. The agent may still exercise judgment, but every deviation must be justified.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-12.5mg`, or when any of the following phrases appear alongside a target skill reference:

- "follow closely", "stick to", "mostly by the book"
- "minor adjustments ok"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                     |
| ----------- | ----------------------------------------- |
| Adherence   | `0.70`                                    |
| Flexibility | `0.30`                                    |
| Sum         | `1.00`                                    |
| Invocation  | `/adderall-12.5mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-12.5mg` in the user message.
2. **Load the target skill** via the standard skill loader.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-12.5mg` instructions.
4. **Apply the high-adherence lens.**
   - Execute the target skill's steps in order.
   - Deviation is allowed only when a step is impossible, unsafe, or directly contradicts the user's request. When you deviate, state *which step* and *why* in one sentence.
   - Do not add unsolicited improvements.
5. **Execute** the task.
6. **Report.** Finish with `Applied adderall-12.5mg to /<target-skill>.`

## Pitfalls

- **Creative drift.** Resist the urge to restructure or improve the target skill. The user explicitly asked for adherence.
- **Silent skips.** Every skipped or modified step must be named.
- **Padding.** Don't add sections the target skill doesn't call for.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Every step was either executed or an explicit "Deviated on step N because …" note was produced.
- [ ] No unsolicited additions beyond what the target skill requires.
- [ ] Final line names the dosage and target skill.
