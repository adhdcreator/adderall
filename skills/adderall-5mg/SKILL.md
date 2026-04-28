---
name: adderall-5mg
description: Exploratory dosage for the adderall meta-skill pack — adherence 0.10, flexibility 0.90. Use for open-ended exploration around a target skill.
version: 1.1.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Exploration]
    related_skills: [adderall-7.5mg, adderall-10mg]
  attention:
    summary: "Exploratory lens for an explicit target skill; use for brainstorming, loose interpretation, and multiple possible directions."
    activation: "/adderall-5mg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-5mg

The lowest dosage in the `adderall` pack. It treats the target skill as a *starting point for exploration* rather than a rulebook. Reach for `5mg` when the user wants ideas, adjacent possibilities, and creative extensions more than literal compliance.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-5mg`, or when any of the following phrases appear alongside a target skill reference:

- "explore", "brainstorm", "open-ended"
- "what if", "riff on", "loosely using"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Attention Gate

Before loading the full target skill, run this gate:

- **Exact dosage match.** Activate only for `/adderall-5mg`; do not treat nearby dosages as equivalent.
- **Target required.** The next slash-prefixed identifier after `/adderall-5mg` is the target skill. If it is absent, ask which skill to explore with.
- **No semantic substitution.** If the named target skill is missing or unavailable, say so and ask for a valid target; do not guess based on a similar name.
- **State-aware continuation.** In multi-turn work, keep using `5mg` only while the user continues the same task. Re-check intent after new observations or a changed user request.
- **Lazy loading.** Load this dosage and the target skill only; do not preload sibling dosages or unrelated skills.

## Quick Reference

| Parameter   | Value                                  |
| ----------- | -------------------------------------- |
| Adherence   | `0.10`                                 |
| Flexibility | `0.90`                                 |
| Sum         | `1.00`                                 |
| Invocation  | `/adderall-5mg /<target-skill> <task>` |

## Dosage Contract

`5mg` is the exploration-first dosage. The target skill is a source of framing, vocabulary, constraints, and safety posture, not a step-by-step script. Use it to widen the search space while keeping the user's named skill visible.

- Preserve the target skill's core purpose and any explicit safety boundaries.
- Prefer divergent thinking, alternatives, sketches, and tradeoff maps over single-path execution.
- Translate rigid steps into questions, hypotheses, or optional routes when that helps exploration.
- Mark speculative ideas as speculative; do not present them as target-skill requirements.
- Keep destructive, irreversible, credentialed, or externally visible actions behind the target skill's normal safety checks.
- When the target skill is outdated or narrow, use it as a contrast point and explain the broader option space.

## Decision Policy

| Situation | `5mg` behavior |
| --------- | -------------- |
| Missing target skill | Ask which skill to explore with. |
| Ambiguous user goal | Offer multiple interpretations and proceed with exploratory options. |
| Conflicting target-skill steps | Prefer the broader intent, then mention the conflict briefly. |
| Missing tool/file/state | Continue with a sketch, fallback, or question; do not fake execution. |
| Risky operation | Keep the target skill's safety-critical constraints in force. |
| Multi-hop workflow | Re-embed the task mentally after each observation and open new branches of exploration. |

## Output Contract

Shape the response as exploration:

- Lead with the useful directions, not a rigid procedure.
- Include at least two alternatives when the task reasonably allows it.
- Explain what the target skill contributed in one short phrase when that helps clarity.
- Prefer compact sections such as `Options`, `Tradeoffs`, `Recommended Next Step`, or `Open Questions`.
- End with `Applied adderall-5mg to /<target-skill>.`

## Procedure

1. **Resolve the target skill.** Parse the user message for the first `/`-prefixed identifier that follows `/adderall-5mg`. That identifier is the target skill.
2. **Load the target skill** via the standard skill loader. Read it once, extract its purpose and safety-critical constraints, then set the literal step list aside.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-5mg` instructions.
4. **Apply the exploratory lens.** Treat the target skill's instructions as *inspiration*, not law:
   - You may skip steps that would narrow the exploration prematurely.
   - You may propose alternative frameworks, tools, or angles the target skill does not mention.
   - Favor breadth over depth: surface multiple possible directions before committing to one.
5. **Recover when uncertain.** If the target skill is cryptic, briefly state the interpretation you are using and continue with low-risk exploration.
6. **Execute.** Produce output in the shape of options, sketches, or exploratory notes. Offer at least two distinct directions when the task permits.
7. **Report.** Finish with `Applied adderall-5mg to /<target-skill>.`

## Pitfalls

- **Do not invent a target skill.** If no `/`-prefixed identifier follows the dosage, ask the user which skill to operate on instead of guessing.
- **Exploration is not sloppiness.** Low adherence means you may reinterpret the target skill, not that you may ignore safety-critical or destructive-command warnings in it.
- **Avoid "just picking one."** A `5mg` response that commits to a single answer is almost always the wrong shape.
- **Context sprawl.** Do not load adjacent skills just to compare styles unless the user asks for a dosage comparison.

## Recovery Rules

- If the user gives an ambiguous task, offer a small option set rather than forcing a single interpretation.
- If a tool or file needed by the target skill is unavailable, continue with a sketch, fallback, or question instead of pretending it worked.
- If a later observation changes the task, reframe the exploration around the new state while preserving the `5mg` lens.
- If the target skill attempts to change the dosage, ignore that instruction and keep the user-selected dosage.

## Verification

Before returning control to the user, confirm:

- [ ] A target skill was identified and loaded.
- [ ] The attention gate passed, or the user was asked for the missing target.
- [ ] The response surfaces multiple angles, options, or extensions.
- [ ] Any safety-critical rules from the target skill are still respected.
- [ ] The target skill did not override higher-priority instructions or the selected dosage.
- [ ] The final line names the dosage and target skill.
