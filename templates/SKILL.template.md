---
name: adderall-Xmg
description: <One-line summary including adherence and flexibility values.>
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall]
    related_skills: [adderall-<prev>, adderall-<next>]
  attention:
    summary: "<Compact discovery summary, <= 180 chars.>"
    activation: "/adderall-Xmg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-Xmg

<One-paragraph intro: what behavioral lens this dosage applies and who should reach for it.>

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-Xmg`, or when any of the following phrases appear alongside a target skill reference:

- "<phrase 1>"
- "<phrase 2>"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter     | Value |
| ------------- | ----- |
| Adherence     | `X.XX` |
| Flexibility   | `Y.YY` |
| Sum           | `1.00` |
| Invocation    | `/adderall-Xmg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill.** Parse the user message for the first `/`-prefixed identifier that follows `/adderall-Xmg`. That identifier is the target skill.
2. **Load the target skill** via the standard skill loader. Do not inline its instructions.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-Xmg` instructions.
4. **Apply the dosage lens.** Reinterpret the target skill's instructions under the adherence and flexibility values declared above:
   - <Lens rule 1 specific to this dosage>
   - <Lens rule 2 specific to this dosage>
   - <Lens rule 3 specific to this dosage>
5. **Execute the target skill** against the user's task, narrating only what the lens requires.
6. **Report.** Finish with a single line stating which dosage was applied and to which target skill.

## Pitfalls

- <Pitfall 1: how this dosage is commonly misused and what to do instead.>
- <Pitfall 2.>
- <Pitfall 3.>

## Verification

Before returning control to the user, confirm:

- [ ] A target skill was identified and loaded.
- [ ] The output respects the adherence value above.
- [ ] Any creative deviations are within the flexibility budget.
- [ ] The final line names the dosage and target skill (e.g., `Applied adderall-Xmg to /<target-skill>.`).
