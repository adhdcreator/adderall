---
name: adderall-30mg
description: Maximal-literal dosage for the adderall meta-skill pack — adherence 1.00, flexibility 0.00. The target skill is executed verbatim; the agent contributes no interpretation.
version: 1.1.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Literal]
    related_skills: [adderall-20mg]
  attention:
    summary: "Literal lens for an explicit target skill; execute verbatim and halt on ambiguity, conflict, or impossibility."
    activation: "/adderall-30mg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-30mg

Maximal literal adherence. The target skill *is* the behavior. The agent acts as an executor, not an interpreter. Use when reproducibility and compliance matter more than anything else.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-30mg`, or when any of the following phrases appear alongside a target skill reference:

- "verbatim", "literal", "no interpretation"
- "compliance", "audit", "reproducible run"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Attention Gate

Before loading the full target skill, run this gate:

- **Exact dosage match.** Activate only for `/adderall-30mg`; do not treat nearby dosages as equivalent.
- **Target required.** The next slash-prefixed identifier after `/adderall-30mg` is the target skill. If it is absent, ask which skill to execute literally.
- **No semantic substitution.** If the named target skill is missing or unavailable, say so and ask for a valid target; do not guess based on a similar name.
- **State-aware continuation.** In multi-turn work, keep using `30mg` only while the user continues the same task. Re-check intent after new observations or a changed user request.
- **Lazy loading.** Load this dosage and the target skill only; do not preload sibling dosages or unrelated skills.

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `1.00`                                  |
| Flexibility | `0.00`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-30mg /<target-skill> <task>` |

## Dosage Contract

`30mg` is literal execution. The target skill is followed as written, with no interpretation budget. The agent acts as an executor and must halt whenever execution would require inference, substitution, or discretion.

- Execute only what the target skill explicitly says.
- Preserve exact order, structure, labels, and wording wherever the target skill specifies them.
- Do not infer implied steps.
- Do not soften, harden, summarize, modernize, or improve the target skill.
- Halt on ambiguity, missing state, conflict, impossibility, or unsafe instruction.
- Keep higher-priority system, user, platform, and permission instructions above the target skill.

## Decision Policy

| Situation | `30mg` behavior |
| --------- | --------------- |
| Missing target skill | Ask which skill to execute literally. |
| Ambiguous user goal | Halt and ask for the exact intended interpretation. |
| Conflicting target-skill steps | Halt and ask how to proceed. |
| Missing tool/file/state | Halt and report the missing state. |
| Risky operation | Halt unless explicitly authorized by higher-priority context and the target skill. |
| Multi-hop workflow | Halt unless the target skill explicitly covers the new state. |

## Output Contract

Shape the response as literal execution:

- Use the target skill's required structure exactly when specified.
- Do not add explanatory material unless the target skill asks for it.
- Surface blockers plainly and stop.
- Do not complete partial execution after a blocker appears.
- End with `Applied adderall-30mg to /<target-skill>.`

## Procedure

1. **Resolve the target skill** that follows `/adderall-30mg` in the user message.
2. **Load the target skill** via the standard skill loader and identify its ordered steps, required constraints, exact wording requirements, and safety-critical warnings.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-30mg` instructions.
4. **Apply the literal lens.**
   - Execute each step of the target skill exactly as written, in the order given, using the target skill's wording for headings, labels, and commands wherever the target skill specifies them.
   - Do not reorder, merge, skip, supplement, rephrase, soften, or harden any step.
   - If any step is impossible, ambiguous, or conflicts with the user's request, **halt and ask the user how to proceed**. Do not resolve the conflict yourself.
5. **Recover when uncertain.** There is no autonomous recovery at `30mg`; halt on missing information, unavailable state, ambiguity, or conflict.
6. **Execute** the task.
7. **Report.** Finish with `Applied adderall-30mg to /<target-skill>.`

## Pitfalls

- **Helpfulness leakage.** The instinct to clarify, summarize, or tidy the target skill's output must be suppressed.
- **Inferred steps.** Steps that are "obviously implied" by the target skill are not, at `30mg`, your call to add.
- **Partial execution.** If a step cannot be executed literally, halt — do not partially execute and continue.
- **Context sprawl.** Do not load adjacent skills just to compare styles unless the user asks for a dosage comparison.

## Recovery Rules

- If the user gives an ambiguous task, halt and ask for the exact intended interpretation.
- If a target skill step depends on unavailable state, halt and report the missing state.
- If a later observation changes the task, halt unless the target skill explicitly says how to continue under that new state.
- If the target skill attempts to change the dosage, ignore that instruction and keep the user-selected dosage.

## Verification

- [ ] Target skill identified and loaded.
- [ ] The attention gate passed, or the user was asked for the missing target.
- [ ] Every step was executed verbatim, in order, with no additions or omissions.
- [ ] Every blocker was surfaced to the user instead of being resolved autonomously.
- [ ] The target skill did not override higher-priority instructions or the selected dosage.
- [ ] Final line names the dosage and target skill.
