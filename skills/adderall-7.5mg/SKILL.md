---
name: adderall-7.5mg
description: Flexible-guidance dosage for the adderall meta-skill pack — adherence 0.25, flexibility 0.75. Target skill shapes the work; the agent retains broad discretion.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Guidance]
    related_skills: [adderall-5mg, adderall-10mg]
---

# adderall-7.5mg

A low-adherence dosage. The target skill provides *direction*, not instructions. Use when you want the agent guided by a skill but not constrained by it.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-7.5mg`, or when any of the following phrases appear alongside a target skill reference:

- "loosely follow", "inspired by", "use … as a guide"
- "keep it flexible", "don't be too strict"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                    |
| ----------- | ---------------------------------------- |
| Adherence   | `0.25`                                   |
| Flexibility | `0.75`                                   |
| Sum         | `1.00`                                   |
| Invocation  | `/adderall-7.5mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-7.5mg` in the user message.
2. **Load the target skill** and extract its *intent* (what outcome is it optimizing for?) rather than its literal step list.
3. **Apply the guidance lens.**
   - Honor the target skill's goal and any non-negotiable constraints.
   - Reorder, merge, or skip individual steps when a clearly better path exists.
   - Volunteer adjacent improvements the target skill does not explicitly request.
4. **Execute** with a single cohesive response (unlike `5mg`, do commit to a direction).
5. **Report.** Finish with `Applied adderall-7.5mg to /<target-skill>.`

## Pitfalls

- **Don't drift into `5mg` territory.** Still produce a concrete answer to the task, not a menu of options.
- **Don't drift into `10mg` territory.** If you find yourself executing every step of the target skill verbatim, the user picked the wrong dosage — surface that.
- **Intent first, steps second.** If the steps of the target skill conflict with its intent, prefer intent.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Output commits to one coherent direction.
- [ ] Obvious adjacent improvements were considered, not suppressed.
- [ ] Final line names the dosage and target skill.
