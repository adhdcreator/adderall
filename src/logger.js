// Tiny zero-dependency logger with ANSI colors.
// Honors NO_COLOR and falls back to plain output when stdout is not a TTY.

const USE_COLOR =
  process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb";

const wrap = (open, close) => (s) =>
  USE_COLOR ? `\x1b[${open}m${s}\x1b[${close}m` : String(s);

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  gray: wrap(90, 39),
};

export const logger = {
  info(msg) {
    process.stdout.write(`${c.blue(c.bold("==>"))} ${msg}\n`);
  },
  ok(msg) {
    process.stdout.write(`  ${c.green("✓")} ${msg}\n`);
  },
  warn(msg) {
    process.stderr.write(`  ${c.yellow("!")} ${msg}\n`);
  },
  step(msg) {
    process.stdout.write(`  ${c.cyan("→")} ${msg}\n`);
  },
  dim(msg) {
    process.stdout.write(`  ${c.dim(msg)}\n`);
  },
  plain(msg = "") {
    process.stdout.write(`${msg}\n`);
  },
  fail(msg, code = 1) {
    process.stderr.write(`  ${c.red("✗")} ${msg}\n`);
    process.exit(code);
  },
};
