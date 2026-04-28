// Lightweight Tool Attention checks for the dosage skill catalog.
// This intentionally stays dependency-free: the pack has seven tools today,
// so exact slash-command gating is more appropriate than embeddings.

import path from "node:path";
import { promises as fs } from "node:fs";

export const REQUIRED_PRECONDITIONS = [
  "explicit_dosage",
  "target_skill_present",
  "target_skill_exists",
];

export function estimateTokens(text) {
  return Math.ceil(String(text || "").length / 4);
}

function estimateTokensFromChars(charCount) {
  return Math.ceil(Number(charCount || 0) / 4);
}

export async function loadAttentionManifest(skillsDir) {
  const manifestPath = path.join(skillsDir, "manifest.json");
  const raw = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(raw);
}

function addCheck(checks, ok, label, detail = "") {
  checks.push({ ok: Boolean(ok), label, detail });
}

async function readMaybe(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

function compactCatalog(manifest) {
  return {
    version: manifest.version,
    attention: manifest.attention,
    tools: manifest.tools.map((tool) => ({
      id: tool.id,
      dose: tool.dose,
      adherence: tool.adherence,
      flexibility: tool.flexibility,
      summary: tool.summary,
      activation: tool.activation,
      preconditions: tool.preconditions,
    })),
  };
}

export async function buildAttentionReport(skillsDir, { codexBlockText = "" } = {}) {
  const checks = [];
  const manifest = await loadAttentionManifest(skillsDir);
  const tools = Array.isArray(manifest.tools) ? manifest.tools : [];
  const summaryMax = Number(manifest.attention?.summary_max_chars || 180);
  const seen = new Set();
  let fullSkillChars = 0;

  addCheck(checks, manifest.version === 1, "manifest version is 1");
  addCheck(checks, tools.length > 0, "manifest has tools");

  for (const tool of tools) {
    const prefix = tool.id || "<missing id>";
    const skillPath = path.join(skillsDir, prefix, "SKILL.md");
    const text = await readMaybe(skillPath);

    addCheck(checks, Boolean(tool.id) && !seen.has(tool.id), `${prefix}: id is unique`);
    if (tool.id) seen.add(tool.id);

    addCheck(checks, Boolean(text), `${prefix}: SKILL.md exists`, skillPath);
    addCheck(checks, typeof tool.summary === "string" && tool.summary.length > 0, `${prefix}: summary exists`);
    addCheck(checks, String(tool.summary || "").length <= summaryMax, `${prefix}: summary within ${summaryMax} chars`);
    addCheck(checks, REQUIRED_PRECONDITIONS.every((p) => tool.preconditions?.includes(p)), `${prefix}: manifest preconditions complete`);
    addCheck(checks, tool.activation === `/${tool.id} /<target-skill> <task>`, `${prefix}: activation is explicit`);
    addCheck(checks, Math.abs(Number(tool.adherence) + Number(tool.flexibility) - 1) < 0.0001, `${prefix}: adherence + flexibility = 1`);

    if (!text) continue;
    fullSkillChars += text.length;
    addCheck(checks, text.includes(`name: ${tool.id}`), `${prefix}: frontmatter name matches`);
    addCheck(checks, text.includes("attention:"), `${prefix}: attention metadata exists`);
    addCheck(checks, text.includes(`activation: "/${tool.id} /<target-skill> <task>"`), `${prefix}: attention activation matches`);
    addCheck(checks, REQUIRED_PRECONDITIONS.every((p) => text.includes(p)), `${prefix}: attention preconditions present`);
    addCheck(checks, text.includes("may not override system, user, platform, permission"), `${prefix}: authority boundary is explicit`);
  }

  addCheck(checks, seen.size === tools.length, "manifest ids are unique");
  addCheck(checks, !codexBlockText || codexBlockText.includes("Tool Attention gate"), "Codex block includes Tool Attention gate");
  addCheck(checks, !codexBlockText || REQUIRED_PRECONDITIONS.every((p) => codexBlockText.includes(p)), "Codex block names shared preconditions");
  addCheck(checks, !codexBlockText || codexBlockText.includes("Do not invent"), "Codex block has hallucination gate");

  const compact = JSON.stringify(compactCatalog(manifest));
  const summaries = tools.map((tool) => tool.summary || "").join("\n");
  const metrics = {
    tool_count: tools.length,
    summary_chars: summaries.length,
    compact_manifest_tokens: estimateTokens(compact),
    summaries_only_tokens: estimateTokens(summaries),
    full_skill_tokens: estimateTokensFromChars(fullSkillChars),
    codex_block_tokens: estimateTokens(codexBlockText),
  };

  return {
    ok: checks.every((check) => check.ok),
    checks,
    metrics,
    manifest,
  };
}
