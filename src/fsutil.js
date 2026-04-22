// Zero-dependency filesystem helpers built on node:fs/promises.
// All functions are idempotent — safe to rerun.

import { promises as fs } from "node:fs";
import path from "node:path";

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function isDir(p) {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

export async function isSymlink(p) {
  try {
    const s = await fs.lstat(p);
    return s.isSymbolicLink();
  } catch {
    return false;
  }
}

// Recursively copy a directory. Overwrites files; never follows symlinks out.
export async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(s, d);
    } else if (e.isSymbolicLink()) {
      const real = await fs.realpath(s);
      await fs.copyFile(real, d);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

export async function removeDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

export async function removePath(p) {
  await fs.rm(p, { recursive: true, force: true });
}

// Create or refresh a symlink `link` -> `target`. Replaces any existing entry.
export async function forceSymlink(target, link) {
  try {
    const lst = await fs.lstat(link);
    if (lst.isSymbolicLink() || lst.isFile()) await fs.unlink(link);
    else if (lst.isDirectory()) await fs.rm(link, { recursive: true, force: true });
  } catch {
    /* link did not exist */
  }
  await fs.symlink(target, link, "dir");
}

// Install (copy or link) a skill directory into `destDir/skillName`.
//   mode = "copy" (default) or "link"
export async function installSkill(srcSkillDir, destDir, { mode = "copy" } = {}) {
  const name = path.basename(srcSkillDir);
  const target = path.join(destDir, name);
  await ensureDir(destDir);
  await removePath(target);
  if (mode === "link") {
    await forceSymlink(srcSkillDir, target);
  } else {
    await copyDir(srcSkillDir, target);
  }
  return target;
}

export async function readFile(p) {
  return fs.readFile(p, "utf8");
}

export async function writeFile(p, content) {
  await ensureDir(path.dirname(p));
  await fs.writeFile(p, content, "utf8");
}

export function homeDir() {
  return process.env.HOME || process.env.USERPROFILE || "";
}
