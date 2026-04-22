#!/usr/bin/env bash
# adderall — install / uninstall / doctor helper
#
# Links the canonical skills/ directory into each supported platform's
# expected location. No files are copied or duplicated — the same SKILL.md
# source of truth is shared across Claude, Cursor, Codex, and Hermes.
#
# Usage:
#   ./scripts/install.sh <command> [options]
#
# Commands:
#   claude [--project]     Link into ~/.claude/skills (or <repo>/.claude/skills)
#   claude-zip             Build dist/claude/<skill>.zip archives for upload
#   cursor [--project]     Link into ~/.cursor/skills (or <repo>/.cursor/skills)
#   codex  [--project]     Link into ~/.codex/skills + merge AGENTS.md block
#   hermes                 Link into ~/.hermes/skills
#   all                    Run claude + cursor + codex + hermes
#   uninstall <platform>   Remove links (and Codex AGENTS.md block)
#   doctor                 Report what is linked and where
#
# Author: adhdcreator — MIT License

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# Configuration
# ───────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="${REPO_ROOT}/skills"
VERSION="1.2.0"

DOSAGES=(5mg 7.5mg 10mg 12.5mg 15mg 20mg 30mg)

# ANSI palette (only used on a TTY)
if [[ -t 1 ]]; then
  BOLD=$'\e[1m'; DIM=$'\e[2m'; YELLOW=$'\e[33m'
  GREEN=$'\e[32m'; RED=$'\e[31m'; BLUE=$'\e[34m'; RESET=$'\e[0m'
else
  BOLD=""; DIM=""; YELLOW=""; GREEN=""; RED=""; BLUE=""; RESET=""
fi

say()   { printf '%s\n' "$*"; }
info()  { printf '%s==>%s %s\n' "${BLUE}${BOLD}" "${RESET}" "$*"; }
ok()    { printf '  %s✓%s %s\n'  "${GREEN}" "${RESET}" "$*"; }
warn()  { printf '  %s!%s %s\n'  "${YELLOW}" "${RESET}" "$*" >&2; }
fail()  { printf '  %s✗%s %s\n'  "${RED}" "${RESET}" "$*" >&2; exit 1; }

# ───────────────────────────────────────────────────────────────
# Helpers
# ───────────────────────────────────────────────────────────────

link_dosages() {
  # $1 = destination skills directory (created if missing)
  local dest="$1"
  mkdir -p "$dest"
  for dose in "${DOSAGES[@]}"; do
    local src="${SKILLS_DIR}/adderall-${dose}"
    local link="${dest}/adderall-${dose}"
    [[ -d "$src" ]] || fail "missing source: $src"
    ln -sfn "$src" "$link"
    ok "linked $(basename "$link") → ${DIM}${src}${RESET}"
  done
}

unlink_dosages() {
  local dest="$1"
  [[ -d "$dest" ]] || { warn "nothing to remove at $dest"; return 0; }
  for dose in "${DOSAGES[@]}"; do
    local link="${dest}/adderall-${dose}"
    if [[ -L "$link" ]]; then
      rm -f "$link"
      ok "removed $(basename "$link")"
    fi
  done
  rmdir --ignore-fail-on-non-empty "$dest" 2>/dev/null || true
}

# ───────────────────────────────────────────────────────────────
# Claude
# ───────────────────────────────────────────────────────────────

cmd_claude() {
  local dest="${HOME}/.claude/skills"
  if [[ "${1:-}" == "--project" ]]; then
    dest="${REPO_ROOT}/.claude/skills"
  fi
  info "Claude install → ${dest}"
  link_dosages "$dest"
  say ""
  ok "Claude ready. Restart Claude Code to pick up the new skills."
}

cmd_claude_zip() {
  command -v zip >/dev/null 2>&1 || fail "'zip' not found — install it or use another platform"
  local out="${REPO_ROOT}/dist/claude"
  mkdir -p "$out"
  info "Building Claude Desktop zips → ${out}"
  for dose in "${DOSAGES[@]}"; do
    local skill="adderall-${dose}"
    ( cd "$SKILLS_DIR" && zip -qr "${out}/${skill}.zip" "$skill" )
    ok "wrote ${skill}.zip"
  done
  say ""
  ok "Upload each zip in Claude Desktop → Settings → Capabilities → Skills."
}

# ───────────────────────────────────────────────────────────────
# Cursor
# ───────────────────────────────────────────────────────────────

cmd_cursor() {
  local dest="${HOME}/.cursor/skills"
  if [[ "${1:-}" == "--project" ]]; then
    dest="${REPO_ROOT}/.cursor/skills"
  fi
  info "Cursor install → ${dest}"
  link_dosages "$dest"
  say ""
  ok "Cursor ready. Restart the Cursor agent pane to re-scan skills."
}

# ───────────────────────────────────────────────────────────────
# Codex
# ───────────────────────────────────────────────────────────────

codex_block() {
  cat <<EOF
<!-- adderall:begin v${VERSION} -->
## adderall — dosage meta-skill pack

When the user prefixes a target skill with \`/adderall-<dose>\` (one of 5mg,
7.5mg, 10mg, 12.5mg, 15mg, 20mg, 30mg), load the corresponding SKILL.md
from the adderall skills directory and execute the target skill through
its adherence / flexibility lens.

Available dosages:
  - adderall-5mg     → exploration  (0.10 / 0.90)
  - adderall-7.5mg   → guidance     (0.25 / 0.75)
  - adderall-10mg    → balanced     (0.50 / 0.50)
  - adderall-12.5mg  → high         (0.70 / 0.30)
  - adderall-15mg    → near-strict  (0.85 / 0.15)
  - adderall-20mg    → strict       (0.95 / 0.05)
  - adderall-30mg    → literal      (1.00 / 0.00)
<!-- adderall:end -->
EOF
}

merge_codex_block() {
  # $1 = AGENTS.md path
  local agents="$1"
  local tmp
  tmp="$(mktemp)"
  touch "$agents"
  # Strip any existing adderall block, then append the fresh one
  awk '
    /<!-- adderall:begin/ {skip=1; next}
    /<!-- adderall:end -->/ {skip=0; next}
    !skip {print}
  ' "$agents" > "$tmp"
  # Trim trailing blank lines
  sed -i -e ':a' -e '/^$/{$d;N;ba' -e '}' "$tmp" 2>/dev/null || true
  { cat "$tmp"; printf '\n'; codex_block; } > "$agents"
  rm -f "$tmp"
}

strip_codex_block() {
  local agents="$1"
  [[ -f "$agents" ]] || return 0
  local tmp; tmp="$(mktemp)"
  awk '
    /<!-- adderall:begin/ {skip=1; next}
    /<!-- adderall:end -->/ {skip=0; next}
    !skip {print}
  ' "$agents" > "$tmp"
  mv "$tmp" "$agents"
}

cmd_codex() {
  local scope="user"
  if [[ "${1:-}" == "--project" ]]; then scope="project"; fi

  local skills_dest agents
  if [[ "$scope" == "project" ]]; then
    skills_dest="${REPO_ROOT}/.codex/skills"
    agents="${REPO_ROOT}/AGENTS.md"
  else
    skills_dest="${HOME}/.codex/skills"
    agents="${HOME}/.codex/AGENTS.md"
    mkdir -p "${HOME}/.codex"
  fi

  info "Codex install (${scope}) → ${skills_dest}"
  link_dosages "$skills_dest"

  info "Merging AGENTS.md block → ${agents}"
  merge_codex_block "$agents"
  ok "AGENTS.md updated"

  say ""
  ok "Codex ready. New sessions will honor /adderall-<dose>."
}

# ───────────────────────────────────────────────────────────────
# Hermes
# ───────────────────────────────────────────────────────────────

cmd_hermes() {
  local dest="${HOME}/.hermes/skills"
  info "Hermes install → ${dest}"
  link_dosages "$dest"
  say ""
  ok "Hermes ready. Verify with 'hermes skills list | grep adderall'."
}

# ───────────────────────────────────────────────────────────────
# All
# ───────────────────────────────────────────────────────────────

cmd_all() {
  cmd_claude
  say ""
  cmd_cursor
  say ""
  cmd_codex
  say ""
  cmd_hermes
}

# ───────────────────────────────────────────────────────────────
# Uninstall
# ───────────────────────────────────────────────────────────────

cmd_uninstall() {
  local target="${1:-}"
  [[ -n "$target" ]] || fail "uninstall requires a platform (claude|cursor|codex|hermes|all)"
  case "$target" in
    claude)
      info "Uninstall Claude"
      unlink_dosages "${HOME}/.claude/skills"
      unlink_dosages "${REPO_ROOT}/.claude/skills"
      ;;
    cursor)
      info "Uninstall Cursor"
      unlink_dosages "${HOME}/.cursor/skills"
      unlink_dosages "${REPO_ROOT}/.cursor/skills"
      ;;
    codex)
      info "Uninstall Codex"
      unlink_dosages "${HOME}/.codex/skills"
      unlink_dosages "${REPO_ROOT}/.codex/skills"
      strip_codex_block "${HOME}/.codex/AGENTS.md" && ok "stripped block from ~/.codex/AGENTS.md"
      strip_codex_block "${REPO_ROOT}/AGENTS.md"   && ok "stripped block from <repo>/AGENTS.md"
      ;;
    hermes)
      info "Uninstall Hermes"
      unlink_dosages "${HOME}/.hermes/skills"
      ;;
    all)
      cmd_uninstall claude
      cmd_uninstall cursor
      cmd_uninstall codex
      cmd_uninstall hermes
      ;;
    *) fail "unknown platform: $target" ;;
  esac
}

# ───────────────────────────────────────────────────────────────
# Doctor
# ───────────────────────────────────────────────────────────────

doctor_platform() {
  local label="$1" dest="$2"
  if [[ ! -d "$dest" ]]; then
    warn "${label}: no skills directory at ${dest}"
    return
  fi
  local linked=0 stale=0
  for dose in "${DOSAGES[@]}"; do
    local link="${dest}/adderall-${dose}"
    if [[ -L "$link" ]]; then
      if [[ -e "$link" ]]; then linked=$((linked+1)); else stale=$((stale+1)); fi
    fi
  done
  printf '  %s%-14s%s %d/%d linked' "${BOLD}" "$label" "${RESET}" "$linked" "${#DOSAGES[@]}"
  if (( stale > 0 )); then
    printf '   %s(%d stale)%s' "${RED}" "$stale" "${RESET}"
  fi
  printf '   %s%s%s\n' "${DIM}" "$dest" "${RESET}"
}

cmd_doctor() {
  info "adderall v${VERSION} — installation report"
  doctor_platform "Claude (user)"   "${HOME}/.claude/skills"
  doctor_platform "Claude (proj)"   "${REPO_ROOT}/.claude/skills"
  doctor_platform "Cursor (user)"   "${HOME}/.cursor/skills"
  doctor_platform "Cursor (proj)"   "${REPO_ROOT}/.cursor/skills"
  doctor_platform "Codex (user)"    "${HOME}/.codex/skills"
  doctor_platform "Codex (proj)"    "${REPO_ROOT}/.codex/skills"
  doctor_platform "Hermes"          "${HOME}/.hermes/skills"
  say ""
  if [[ -f "${HOME}/.codex/AGENTS.md" ]] && grep -q 'adderall:begin' "${HOME}/.codex/AGENTS.md"; then
    ok "Codex AGENTS.md has adderall block (user)"
  fi
  if [[ -f "${REPO_ROOT}/AGENTS.md" ]] && grep -q 'adderall:begin' "${REPO_ROOT}/AGENTS.md"; then
    ok "Codex AGENTS.md has adderall block (project)"
  fi
}

# ───────────────────────────────────────────────────────────────
# Dispatch
# ───────────────────────────────────────────────────────────────

usage() {
  sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

main() {
  [[ $# -ge 1 ]] || usage 1
  local cmd="$1"; shift || true
  case "$cmd" in
    claude)     cmd_claude "$@" ;;
    claude-zip) cmd_claude_zip "$@" ;;
    cursor)     cmd_cursor "$@" ;;
    codex)      cmd_codex "$@" ;;
    hermes)     cmd_hermes "$@" ;;
    all)        cmd_all "$@" ;;
    uninstall)  cmd_uninstall "$@" ;;
    doctor)     cmd_doctor "$@" ;;
    -h|--help|help) usage 0 ;;
    *)          fail "unknown command: $cmd (try --help)" ;;
  esac
}

main "$@"
