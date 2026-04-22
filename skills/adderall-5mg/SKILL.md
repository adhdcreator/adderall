---
name: adderall-5mg
description: Exploratory dosage for the adderall meta-skill pack — adherence 0.10, flexibility 0.90. Use for open-ended exploration around a target skill.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Exploration]
    related_skills: [adderall-7.5mg, adderall-10mg]
---

# adderall-5mg

The lowest dosage in the `adderall` pack. It treats the target skill as a *starting point for exploration* rather than a rulebook. Reach for `5mg` when the user wants ideas, adjacent possibilities, and creative extensions more than literal compliance.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-5mg`, or when any of the following phrases appear alongside a target skill reference:

- "explore", "brainstorm", "open-ended"
- "what if", "riff on", "loosely using"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                  |
| ----------- | -------------------------------------- |
| Adherence   | `0.10`                                 |
| Flexibility | `0.90`                                 |
| Sum         | `1.00`                                 |
| Invocation  | `/adderall-5mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill.** Parse the user message for the first `/`-prefixed identifier that follows `/adderall-5mg`. That identifier is the target skill.
2. **Load the target skill** via the standard skill loader. Read it once, then set it aside.
3. **Apply the exploratory lens.** Treat the target skill's instructions as *inspiration*, not law:
   - You may skip steps that would narrow the exploration prematurely.
   - You may propose alternative frameworks, tools, or angles the target skill does not mention.
   - Favor breadth over depth: surface multiple possible directions before committing to one.
4. **Execute.** Produce output in the shape of options, sketches, or exploratory notes. Offer at least two distinct directions when the task permits.
5. **Report.** Finish with `Applied adderall-5mg to /<target-skill>.`

## Pitfalls

- **Do not invent a target skill.** If no `/`-prefixed identifier follows the dosage, ask the user which skill to operate on instead of guessing.
- **Exploration is not sloppiness.** Low adherence means you may reinterpret the target skill, not that you may ignore safety-critical or destructive-command warnings in it.
- **Avoid "just picking one."** A `5mg` response that commits to a single answer is almost always the wrong shape.

## Verification

Before returning control to the user, confirm:

- [ ] A target skill was identified and loaded.
- [ ] The response surfaces multiple angles, options, or extensions.
- [ ] Any safety-critical rules from the target skill are still respected.
- [ ] The final line names the dosage and target skill.
