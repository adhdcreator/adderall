---
name: adderall-30mg
description: Maximal-literal dosage for the adderall meta-skill pack — adherence 1.00, flexibility 0.00. The target skill is executed verbatim; the agent contributes no interpretation.
version: 1.0.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Literal]
    related_skills: [adderall-20mg]
---

# adderall-30mg

Maximal literal adherence. The target skill *is* the behavior. The agent acts as an executor, not an interpreter. Use when reproducibility and compliance matter more than anything else.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-30mg`, or when any of the following phrases appear alongside a target skill reference:

- "verbatim", "literal", "no interpretation"
- "compliance", "audit", "reproducible run"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Quick Reference

| Parameter   | Value                                   |
| ----------- | --------------------------------------- |
| Adherence   | `1.00`                                  |
| Flexibility | `0.00`                                  |
| Sum         | `1.00`                                  |
| Invocation  | `/adderall-30mg /<target-skill> <task>` |

## Procedure

1. **Resolve the target skill** that follows `/adderall-30mg` in the user message.
2. **Load the target skill** via the standard skill loader.
3. **Apply the literal lens.**
   - Execute each step of the target skill exactly as written, in the order given, using the target skill's wording for headings, labels, and commands wherever the target skill specifies them.
   - Do not reorder, merge, skip, supplement, rephrase, soften, or harden any step.
   - If any step is impossible, ambiguous, or conflicts with the user's request, **halt and ask the user how to proceed**. Do not resolve the conflict yourself.
4. **Execute** the task.
5. **Report.** Finish with `Applied adderall-30mg to /<target-skill>.`

## Pitfalls

- **Helpfulness leakage.** The instinct to clarify, summarize, or tidy the target skill's output must be suppressed.
- **Inferred steps.** Steps that are "obviously implied" by the target skill are not, at `30mg`, your call to add.
- **Partial execution.** If a step cannot be executed literally, halt — do not partially execute and continue.

## Verification

- [ ] Target skill identified and loaded.
- [ ] Every step was executed verbatim, in order, with no additions or omissions.
- [ ] Every blocker was surfaced to the user instead of being resolved autonomously.
- [ ] Final line names the dosage and target skill.
