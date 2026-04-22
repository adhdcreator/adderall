---
name: adderall-10mg
description: Balanced dosage for the adderall meta-skill pack — adherence 0.50, flexibility 0.50. The default choice when neither creativity nor literal compliance clearly wins.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Default]
    related_skills: [adderall-7.5mg, adderall-12.5mg]
---

# adderall-10mg

The balanced midpoint of the pack. Target skills are respected step-by-step, but the agent is still allowed to exercise judgment when a step is ambiguous, outdated, or clearly suboptimal for the situation.

This is the recommended default when the user says "use skill X" without further qualification.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-10mg`, or when any of the following phrases appear alongside a target skill reference:

- "use skill …" (with no adherence hint)
- "follow skill …", "apply skill …"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `0.50`                                  |
| Flexibility | `0.50`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-10mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-10mg` in the user message.
2. **Load the target skill** via the standard skill loader.
3. **Apply the balanced lens.**
   - Follow the target skill's steps in order by default.
   - You may deviate from a step when (a) it is ambiguous, (b) it conflicts with the user's explicit request, or (c) a clearly better alternative exists for the current context. Name the deviation briefly when you take it.
   - Add at most one unsolicited improvement, only if it is low-cost and clearly relevant.
4. **Execute** the task.
5. **Report.** Finish with `Applied adderall-10mg to /<target-skill>.`

## Pitfalls

- **Over-flexing.** If you find yourself deviating from more than one step, you are acting like `7.5mg`; stop and re-anchor to the target skill.
- **Over-adhering.** If you follow every step without judgment even when the context clearly calls for adjustment, you are acting like `12.5mg`; the user chose `10mg` for a reason.
- **Silent deviations.** Any deviation from a step must be named in one short clause, not hidden.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Each step of the target skill was either followed or explicitly (briefly) deviated from.
- [ ] At most one unsolicited improvement was added.
- [ ] Final line names the dosage and target skill.
