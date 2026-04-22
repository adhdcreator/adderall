// Per-platform adapters. Each adapter knows:
//   - where to install skills for that platform
//   - any additional steps (e.g. Codex merges AGENTS.md)
//   - how to uninstall
//   - how to report status for `doctor`

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ensureDir,
  pathExists,
  installSkill,
  removePath,
  readFile,
  writeFile,
  homeDir,
  isDir,
} from "./fsutil.js";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PKG_ROOT = path.resolve(__dirname, "..");
export const SKILLS_DIR = path.join(PKG_ROOT, "skills");

export const DOSAGES = [
  "5mg",
  "7.5mg",
  "10mg",
  "12.5mg",
  "15mg",
  "20mg",
  "30mg",
];

export const VERSION = (async () => {
  const pkg = JSON.parse(await readFile(path.join(PKG_ROOT, "package.json")));
  return pkg.version;
})();

function dosageSourceDirs() {
  return DOSAGES.map((d) => path.join(SKILLS_DIR, `adderall-${d}`));
}

async function installDosagesInto(destDir, mode) {
  const installed = [];
  for (const src of dosageSourceDirs()) {
    const target = await installSkill(src, destDir, { mode });
    installed.push(target);
    logger.ok(`${path.basename(target)}  →  ${logger === logger ? target : target}`);
  }
  return installed;
}

async function removeDosagesFrom(destDir) {
  if (!(await pathExists(destDir))) return 0;
  let removed = 0;
  for (const d of DOSAGES) {
    const target = path.join(destDir, `adderall-${d}`);
    if (await pathExists(target)) {
      await removePath(target);
      removed++;
      logger.ok(`removed ${path.basename(target)}`);
    }
  }
  return removed;
}

async function statusFor(destDir) {
  if (!(await isDir(destDir))) {
    return { present: false, count: 0, total: DOSAGES.length, path: destDir };
  }
  let count = 0;
  for (const d of DOSAGES) {
    if (await pathExists(path.join(destDir, `adderall-${d}`))) count++;
  }
  return { present: true, count, total: DOSAGES.length, path: destDir };
}

// ───────────────────────────────────────────────────────────────
// Claude
// ───────────────────────────────────────────────────────────────

function claudePaths({ project }) {
  return project
    ? path.resolve(process.cwd(), ".claude", "skills")
    : path.join(homeDir(), ".claude", "skills");
}

const claude = {
  id: "claude",
  label: "Claude",
  async install(flags) {
    const dest = claudePaths(flags);
    logger.info(`Claude  →  ${dest}`);
    await installDosagesInto(dest, flags.link ? "link" : "copy");
    logger.plain();
    logger.ok("Claude ready. Restart Claude Code / Desktop to pick up the skills.");
  },
  async uninstall(flags) {
    logger.info("Uninstall Claude");
    await removeDosagesFrom(claudePaths({ project: false }));
    await removeDosagesFrom(claudePaths({ project: true }));
  },
  async status() {
    return [
      { label: "Claude (user)", ...(await statusFor(claudePaths({ project: false }))) },
      { label: "Claude (proj)", ...(await statusFor(claudePaths({ project: true }))) },
    ];
  },
};

// ───────────────────────────────────────────────────────────────
// Cursor
// ───────────────────────────────────────────────────────────────

function cursorPaths({ project }) {
  return project
    ? path.resolve(process.cwd(), ".cursor", "skills")
    : path.join(homeDir(), ".cursor", "skills");
}

const cursor = {
  id: "cursor",
  label: "Cursor",
  async install(flags) {
    const dest = cursorPaths(flags);
    logger.info(`Cursor  →  ${dest}`);
    await installDosagesInto(dest, flags.link ? "link" : "copy");
    logger.plain();
    logger.ok("Cursor ready. Restart the Cursor agent pane to re-scan skills.");
  },
  async uninstall() {
    logger.info("Uninstall Cursor");
    await removeDosagesFrom(cursorPaths({ project: false }));
    await removeDosagesFrom(cursorPaths({ project: true }));
  },
  async status() {
    return [
      { label: "Cursor (user)", ...(await statusFor(cursorPaths({ project: false }))) },
      { label: "Cursor (proj)", ...(await statusFor(cursorPaths({ project: true }))) },
    ];
  },
};

// ───────────────────────────────────────────────────────────────
// Codex
// ───────────────────────────────────────────────────────────────

function codexPaths({ project }) {
  if (project) {
    return {
      skills: path.resolve(process.cwd(), ".codex", "skills"),
      agents: path.resolve(process.cwd(), "AGENTS.md"),
    };
  }
  const home = homeDir();
  return {
    skills: path.join(home, ".codex", "skills"),
    agents: path.join(home, ".codex", "AGENTS.md"),
  };
}

const BEGIN = "<!-- adderall:begin";
const END = "<!-- adderall:end -->";

async function codexBlock() {
  const v = await VERSION;
  return [
    `<!-- adderall:begin v${v} -->`,
    "## adderall — dosage meta-skill pack",
    "",
    "When the user prefixes a target skill with `/adderall-<dose>` (one of 5mg,",
    "7.5mg, 10mg, 12.5mg, 15mg, 20mg, 30mg), load the corresponding SKILL.md",
    "from the adderall skills directory and execute the target skill through",
    "its adherence / flexibility lens.",
    "",
    "Available dosages:",
    "  - adderall-5mg     → exploration  (0.10 / 0.90)",
    "  - adderall-7.5mg   → guidance     (0.25 / 0.75)",
    "  - adderall-10mg    → balanced     (0.50 / 0.50)",
    "  - adderall-12.5mg  → high         (0.70 / 0.30)",
    "  - adderall-15mg    → near-strict  (0.85 / 0.15)",
    "  - adderall-20mg    → strict       (0.95 / 0.05)",
    "  - adderall-30mg    → literal      (1.00 / 0.00)",
    END,
    "",
  ].join("\n");
}

function stripBlock(text) {
  // Remove any existing <!-- adderall:begin ... --> ... <!-- adderall:end -->
  const begin = text.indexOf(BEGIN);
  if (begin === -1) return text;
  const end = text.indexOf(END, begin);
  if (end === -1) return text;
  return (text.slice(0, begin) + text.slice(end + END.length)).replace(/\n{3,}/g, "\n\n");
}

const codex = {
  id: "codex",
  label: "Codex",
  async install(flags) {
    const { skills, agents } = codexPaths(flags);
    logger.info(`Codex   →  ${skills}`);
    await installDosagesInto(skills, flags.link ? "link" : "copy");

    logger.info(`Merging  ${agents}`);
    let existing = "";
    if (await pathExists(agents)) existing = await readFile(agents);
    const cleaned = stripBlock(existing).replace(/\s+$/, "");
    const merged = (cleaned ? cleaned + "\n\n" : "") + (await codexBlock());
    await writeFile(agents, merged);
    logger.ok(`AGENTS.md updated (idempotent block)`);
    logger.plain();
    logger.ok("Codex ready. New sessions will honor /adderall-<dose>.");
  },
  async uninstall() {
    logger.info("Uninstall Codex");
    for (const scope of [{ project: false }, { project: true }]) {
      const { skills, agents } = codexPaths(scope);
      await removeDosagesFrom(skills);
      if (await pathExists(agents)) {
        const text = await readFile(agents);
        const cleaned = stripBlock(text);
        if (cleaned !== text) {
          await writeFile(agents, cleaned.replace(/\s+$/, "") + "\n");
          logger.ok(`stripped block from ${agents}`);
        }
      }
    }
  },
  async status() {
    const u = codexPaths({ project: false });
    const p = codexPaths({ project: true });
    const rows = [
      { label: "Codex (user)", ...(await statusFor(u.skills)) },
      { label: "Codex (proj)", ...(await statusFor(p.skills)) },
    ];
    for (const [scope, paths] of [["user", u], ["proj", p]]) {
      if (await pathExists(paths.agents)) {
        const text = await readFile(paths.agents);
        if (text.includes(BEGIN)) {
          rows.push({ label: `AGENTS.md (${scope})`, present: true, count: 1, total: 1, path: paths.agents });
        }
      }
    }
    return rows;
  },
};

// ───────────────────────────────────────────────────────────────
// Hermes
// ───────────────────────────────────────────────────────────────

function hermesPaths() {
  return path.join(homeDir(), ".hermes", "skills");
}

const hermes = {
  id: "hermes",
  label: "Hermes",
  async install(flags) {
    const dest = hermesPaths();
    logger.info(`Hermes  →  ${dest}`);
    await installDosagesInto(dest, flags.link ? "link" : "copy");
    logger.plain();
    logger.ok("Hermes ready. Verify with 'hermes skills list | grep adderall'.");
  },
  async uninstall() {
    logger.info("Uninstall Hermes");
    await removeDosagesFrom(hermesPaths());
  },
  async status() {
    return [{ label: "Hermes", ...(await statusFor(hermesPaths())) }];
  },
};

// ───────────────────────────────────────────────────────────────
// Registry
// ───────────────────────────────────────────────────────────────

export const PLATFORMS = { claude, cursor, codex, hermes };
export const PLATFORM_IDS = Object.keys(PLATFORMS);
