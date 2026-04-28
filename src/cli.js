// CLI dispatcher for `adderall`.
// No runtime dependencies — Node stdlib only.

import path from "node:path";
import { promises as fs } from "node:fs";
import { logger, c } from "./logger.js";
import {
  PLATFORMS,
  PLATFORM_IDS,
  DOSAGES,
  PKG_ROOT,
  SKILLS_DIR,
  VERSION,
  codexBlock,
} from "./platforms.js";
import { buildAttentionReport } from "./attention.js";

function parseArgv(argv) {
  const flags = {};
  const positional = [];
  for (const tok of argv) {
    if (tok.startsWith("--")) {
      const [k, v] = tok.slice(2).split("=");
      flags[k] = v === undefined ? true : v;
    } else if (tok.startsWith("-") && tok.length > 1) {
      for (const ch of tok.slice(1)) flags[ch] = true;
    } else {
      positional.push(tok);
    }
  }
  return { flags, positional };
}

async function printBanner() {
  const v = await VERSION;
  const lines = [
    "",
    c.yellow(c.bold("     █████╗ ██████╗ ██████╗ ███████╗██████╗  █████╗ ██╗     ██╗   ")),
    c.yellow(c.bold("    ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██║   ")),
    c.yellow(c.bold("    ███████║██║  ██║██║  ██║█████╗  ██████╔╝███████║██║     ██║   ")),
    c.yellow(c.bold("    ██╔══██║██║  ██║██║  ██║██╔══╝  ██╔══██╗██╔══██║██║     ██║   ")),
    c.yellow(c.bold("    ██║  ██║██████╔╝██████╔╝███████╗██║  ██║██║  ██║███████╗██╗██╗")),
    c.yellow(c.bold("    ╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝")),
    "",
    `    ${c.dim("v" + v + " · dosage meta-skill pack for Claude / Cursor / Codex / Hermes")}`,
    `    ${c.dim("by adhdcreator · MIT")}`,
    "",
  ];
  for (const line of lines) logger.plain(line);
}

function printHelp() {
  logger.plain(`
${c.bold("adderall")} — dosage-based meta-skill pack
${c.dim("https://github.com/adhdcreator/adderall")}

${c.bold("Usage:")}
  npx adderall <command> [options]

${c.bold("Commands:")}
  ${c.cyan("install <platform>")}        Install adderall on a platform
                               platforms: ${PLATFORM_IDS.join(", ")}, all
  ${c.cyan("uninstall <platform>")}      Remove adderall from a platform (or all)
  ${c.cyan("doctor")}                    Report where adderall is installed
  ${c.cyan("attention")}                 Audit the compact skill catalog and gating rules
  ${c.cyan("lint")}                      Alias for attention
  ${c.cyan("list")}                      List the 7 dosages and their profiles
  ${c.cyan("info <dose>")}               Print a dosage's SKILL.md
  ${c.cyan("help")}                      Show this screen

${c.bold("Options:")}
  --project                  Install at project scope (./.${c.dim("<platform>")}/skills)
  --link                     Use symlinks instead of copies (dev mode)
  --attention                With doctor, also run the Tool Attention audit
  --no-banner                Suppress the top banner in help output

${c.bold("Examples:")}
  ${c.dim("# Install on every supported platform:")}
  npx adderall install all

  ${c.dim("# Just Claude Code at user scope:")}
  npx adderall install claude

  ${c.dim("# Cursor pinned to the current repo:")}
  npx adderall install cursor --project

  ${c.dim("# Remove everything:")}
  npx adderall uninstall all

  ${c.dim("# Audit current install:")}
  npx adderall doctor

  ${c.dim("# Audit summaries, preconditions, and approximate token budgets:")}
  npx adderall attention
`);
}

async function cmdInstall(positional, flags) {
  const [target] = positional;
  if (!target) logger.fail("install requires a platform (or 'all')");
  if (target === "all") {
    for (const id of PLATFORM_IDS) {
      await PLATFORMS[id].install(flags);
      logger.plain();
    }
    return;
  }
  const p = PLATFORMS[target];
  if (!p) logger.fail(`unknown platform: ${target}  (try: ${PLATFORM_IDS.join(", ")}, all)`);
  await p.install(flags);
}

async function cmdUninstall(positional, flags) {
  const [target] = positional;
  if (!target) logger.fail("uninstall requires a platform (or 'all')");
  if (target === "all") {
    for (const id of PLATFORM_IDS) {
      await PLATFORMS[id].uninstall(flags);
      logger.plain();
    }
    return;
  }
  const p = PLATFORMS[target];
  if (!p) logger.fail(`unknown platform: ${target}`);
  await p.uninstall(flags);
}

async function cmdDoctor(flags = {}) {
  const v = await VERSION;
  logger.info(`adderall v${v} — installation report`);
  for (const id of PLATFORM_IDS) {
    const rows = await PLATFORMS[id].status();
    for (const r of rows) {
      const label = r.label.padEnd(16);
      if (!r.present) {
        logger.plain(`  ${c.dim(label)}  ${c.yellow("not installed")}  ${c.dim(r.path)}`);
      } else {
        const ratio = `${r.count}/${r.total}`;
        const color = r.count === r.total ? c.green : r.count === 0 ? c.yellow : c.cyan;
        logger.plain(`  ${c.bold(label)}  ${color(ratio.padEnd(6))}  ${c.dim(r.path)}`);
      }
    }
  }
  if (flags.attention) {
    logger.plain();
    await cmdAttention();
  }
}

async function cmdAttention() {
  const report = await buildAttentionReport(SKILLS_DIR, { codexBlockText: await codexBlock() });
  logger.info("Tool Attention audit");
  const status = report.ok ? c.green("pass") : c.red("fail");
  logger.plain(`  status                 ${status}`);
  logger.plain(`  tools                  ${report.metrics.tool_count}`);
  logger.plain(`  summaries only         ~${report.metrics.summaries_only_tokens} tokens`);
  logger.plain(`  compact manifest       ~${report.metrics.compact_manifest_tokens} tokens`);
  logger.plain(`  full SKILL.md catalog  ~${report.metrics.full_skill_tokens} tokens`);
  logger.plain(`  Codex gate block       ~${report.metrics.codex_block_tokens} tokens`);
  logger.plain();
  for (const check of report.checks) {
    const icon = check.ok ? c.green("✓") : c.red("✗");
    const detail = check.detail ? `  ${c.dim(check.detail)}` : "";
    logger.plain(`  ${icon} ${check.label}${detail}`);
  }
  if (!report.ok) process.exitCode = 1;
}

async function cmdList() {
  const rows = [
    ["adderall-5mg",    "0.10", "0.90", "Open-ended exploration"],
    ["adderall-7.5mg",  "0.25", "0.75", "Flexible guidance"],
    ["adderall-10mg",   "0.50", "0.50", "Balanced execution"],
    ["adderall-12.5mg", "0.70", "0.30", "High adherence"],
    ["adderall-15mg",   "0.85", "0.15", "Near-strict execution"],
    ["adderall-20mg",   "0.95", "0.05", "Strict execution"],
    ["adderall-30mg",   "1.00", "0.00", "Maximal literal adherence"],
  ];
  logger.plain();
  logger.plain(`  ${c.bold("Skill".padEnd(18))} ${c.bold("Adh.")}  ${c.bold("Flex.")}  ${c.bold("Intended Use")}`);
  logger.plain(`  ${c.dim("─".repeat(18))} ${c.dim("─".repeat(5))} ${c.dim("─".repeat(5))} ${c.dim("─".repeat(32))}`);
  for (const [name, a, f, use] of rows) {
    logger.plain(`  ${c.cyan(name.padEnd(18))} ${a.padEnd(5)} ${f.padEnd(5)} ${c.dim(use)}`);
  }
  logger.plain();
}

async function cmdInfo(positional) {
  const [dose] = positional;
  if (!dose) logger.fail("info requires a dosage (e.g. 10mg)");
  const name = dose.startsWith("adderall-") ? dose : `adderall-${dose}`;
  const p = path.join(SKILLS_DIR, name, "SKILL.md");
  try {
    const text = await fs.readFile(p, "utf8");
    process.stdout.write(text);
  } catch {
    logger.fail(`no such dosage: ${name}  (valid: ${DOSAGES.join(", ")})`);
  }
}

export async function main(argv) {
  const { flags, positional } = parseArgv(argv);
  const [command, ...rest] = positional;

  if (flags.version || flags.v || command === "version") {
    process.stdout.write(`${await VERSION}\n`);
    return;
  }

  if (flags.help || flags.h || command === "help" || command === undefined) {
    if (!flags["no-banner"]) await printBanner();
    printHelp();
    return;
  }

  switch (command) {
    case "install":    return cmdInstall(rest, flags);
    case "uninstall":  return cmdUninstall(rest, flags);
    case "doctor":     return cmdDoctor(flags);
    case "attention":  return cmdAttention();
    case "lint":       return cmdAttention();
    case "list":       return cmdList();
    case "info":       return cmdInfo(rest);
    default:           logger.fail(`unknown command: ${command}  (try 'adderall help')`);
  }
}
