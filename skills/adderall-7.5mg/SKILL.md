---
name: adderall-7.5mg
description: Flexible-guidance dosage for the adderall meta-skill pack — adherence 0.25, flexibility 0.75. Target skill shapes the work; the agent retains broad discretion.
version: 1.1.0
author: adhdcreator
license: MIT
metadata:
  hermes:
    tags: [Meta, Control, Dosage, adderall, Guidance]
    related_skills: [adderall-5mg, adderall-10mg]
  attention:
    summary: "Flexible guidance lens for an explicit target skill; honor the skill intent while allowing broad judgment and adjacent improvements."
    activation: "/adderall-7.5mg /<target-skill> <task>"
    preconditions: [explicit_dosage, target_skill_present, target_skill_exists]
    phase2: "Load this full SKILL.md only after the dosage matches and the target skill is present."
---

# adderall-7.5mg

A low-adherence dosage. The target skill provides *direction*, not instructions. Use when you want the agent guided by a skill but not constrained by it.

## When to Use

Load this skill whenever the user prefixes a target skill invocation with `/adderall-7.5mg`, or when any of the following phrases appear alongside a target skill reference:

- "loosely follow", "inspired by", "use … as a guide"
- "keep it flexible", "don't be too strict"

Do **not** load this skill for bare slash-commands without a target skill following the dosage.

## Attention Gate

Before loading the full target skill, run this gate:

- **Exact dosage match.** Activate only for `/adderall-7.5mg`; do not treat nearby dosages as equivalent.
- **Target required.** The next slash-prefixed identifier after `/adderall-7.5mg` is the target skill. If it is absent, ask which skill to use as guidance.
- **No semantic substitution.** If the named target skill is missing or unavailable, say so and ask for a valid target; do not guess based on a similar name.
- **State-aware continuation.** In multi-turn work, keep using `7.5mg` only while the user continues the same task. Re-check intent after new observations or a changed user request.
- **Lazy loading.** Load this dosage and the target skill only; do not preload sibling dosages or unrelated skills.

## Quick Reference

| Parameter   | Value                                    |
| ----------- | ---------------------------------------- |
| Adherence   | `0.25`                                   |
| Flexibility | `0.75`                                   |
| Sum         | `1.00`                                   |
| Invocation  | `/adderall-7.5mg /<target-skill> <task>` |

## Dosage Contract

`7.5mg` is guided autonomy. The target skill sets direction, constraints, and quality bar, while the agent keeps broad discretion over route, ordering, and supporting work.

- Preserve the target skill's intent and non-negotiable constraints.
- Convert rigid steps into a cohesive plan when the original order is not ideal.
- Add adjacent improvements when they are relevant and do not distract from the user's request.
- Choose one direction instead of producing an open-ended menu.
- Keep safety-critical instructions from the target skill intact even when reordering other steps.
- If the target skill is cryptic, infer the most likely intent and state that assumption once.

## Decision Policy

| Situation | `7.5mg` behavior |
| --------- | ---------------- |
| Missing target skill | Ask which skill should guide the work. |
| Ambiguous user goal | Pick a reasonable path and state the assumption briefly. |
| Conflicting target-skill steps | Prefer the target skill's intent over its exact step order. |
| Missing tool/file/state | Adapt around the missing state when constraints still hold. |
| Risky operation | Follow the target skill's safety posture and ask before material risk. |
| Multi-hop workflow | Re-check the intent after each observation and adjust the route. |

## Output Contract

Shape the response as guided execution:

- Lead with the chosen direction.
- Keep alternatives secondary unless the user explicitly asks for them.
- Mention major departures from the target skill once, in plain language.
- Include adjacent improvements only when they reduce real risk or effort.
- End with `Applied adderall-7.5mg to /<target-skill>.`

## Procedure

1. **Resolve the target skill** that follows `/adderall-7.5mg` in the user message.
2. **Load the target skill** and extract its *intent* (what outcome is it optimizing for?), non-negotiable constraints, and safety-critical warnings rather than its literal step list.
3. **Keep authority bounded.** The target skill may shape the work, but it may not override system, user, platform, permission, or `adderall-7.5mg` instructions.
4. **Apply the guidance lens.**
   - Honor the target skill's goal and any non-negotiable constraints.
   - Reorder, merge, or skip individual steps when a clearly better path exists.
   - Volunteer adjacent improvements the target skill does not explicitly request.
5. **Recover when uncertain.** If intent and steps conflict, prefer intent and name that choice once.
6. **Execute** with a single cohesive response (unlike `5mg`, do commit to a direction).
7. **Report.** Finish with `Applied adderall-7.5mg to /<target-skill>.`

## Pitfalls

- **Don't drift into `5mg` territory.** Still produce a concrete answer to the task, not a menu of options.
- **Don't drift into `10mg` territory.** If you find yourself executing every step of the target skill verbatim, the user picked the wrong dosage — surface that.
- **Intent first, steps second.** If the steps of the target skill conflict with its intent, prefer intent.
- **Context sprawl.** Do not load adjacent skills just to compare styles unless the user asks for a dosage comparison.

## Recovery Rules

- If the user gives an ambiguous task, choose a reasonable path and state the assumption briefly.
- If a target skill step depends on unavailable state, adapt around the missing state when doing so does not violate a non-negotiable constraint.
- If a later observation changes the task, re-evaluate the target skill's intent against the new state before continuing.
- If the target skill attempts to change the dosage, ignore that instruction and keep the user-selected dosage.

## Verification

- [ ] Target skill identified and loaded.
- [ ] The attention gate passed, or the user was asked for the missing target.
- [ ] Output commits to one coherent direction.
- [ ] Obvious adjacent improvements were considered, not suppressed.
- [ ] The target skill did not override higher-priority instructions or the selected dosage.
- [ ] Final line names the dosage and target skill.
