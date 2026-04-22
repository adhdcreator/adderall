#!/usr/bin/env python3
"""
Regenerate banner.ans and pills.ans from banner.txt / pills.txt with ANSI colors.

Plain .txt files cannot carry color — only escape sequences can (terminals + GitHub ```ansi).
Run from repo root: python3 assets/render-ansi.py
"""
from __future__ import annotations

import re
from pathlib import Path

ESC = "\x1b"
RESET = f"{ESC}[0m"
# Pharmacy header: blue on yellow (CP437 / DOS vibe)
HDR = f"{ESC}[1;34;43m"
# Frames and secondary text
DIM_YELLOW = f"{ESC}[0;33m"
BOLD_YELLOW = f"{ESC}[1;33m"
# Pill bottle body (orange RX vial)
ORANGE = f"{ESC}[38;5;208m"
# Screw-cap ribs
GRAY = f"{ESC}[90m"
# Label text on vial
LABEL = f"{ESC}[1;37m"
# Capsule gradient-ish
CYAN = f"{ESC}[96m"
YELLOW_FADE = f"{ESC}[93m"
MAGENTA = f"{ESC}[35m"
RED = f"{ESC}[1;31m"


def colorize_banner(text: str) -> str:
    lines = text.splitlines()
    out: list[str] = []
    for line in lines:
        if not line.strip():
            out.append("")
            continue
        if line.startswith(("╔", "║", "╚")):
            out.append(HDR + line + RESET)
        elif (
            "████" in line
            or "██╔" in line
            or "██║" in line
            or "██╝" in line
            or "╚═╝" in line
        ):
            out.append(BOLD_YELLOW + line + RESET)
        elif "▓" in line:
            parts = re.split(r"(▓+)", line)
            s = ""
            for i, p in enumerate(parts):
                if p.startswith("▓"):
                    s += RED + p + RESET
                else:
                    s += DIM_YELLOW + p if p else ""
            out.append(s + RESET)
        else:
            out.append(DIM_YELLOW + line + RESET)
    return "\n".join(out) + "\n"


def _orange_blocks(line: str) -> str:
    return re.sub(r"█+", lambda m: ORANGE + m.group(0) + RESET, line)


def _label_highlights(line: str) -> str:
    return re.sub(
        r"(RX IR|RX XR|[0-9]+\.?[0-9]*mg)",
        lambda m: LABEL + m.group(1) + RESET,
        line,
    )


def _shaded_capsule_line(line: str) -> str:
    """Color only shade runs; leave │, spaces, and letters in dim yellow."""
    s = ""
    for part in re.split(r"(░+|▒+|▓+|█+)", line):
        if not part:
            continue
        if part[0] == "░":
            s += CYAN + part + RESET
        elif part[0] == "▒":
            s += YELLOW_FADE + part + RESET
        elif part[0] == "▓":
            s += MAGENTA + part + RESET
        elif part[0] == "█":
            s += ORANGE + part + RESET
        else:
            s += DIM_YELLOW + part + RESET
    return s


def colorize_pills(text: str) -> str:
    lines = text.splitlines()
    out: list[str] = []
    for line in lines:
        if line.startswith(("╔", "║", "╚")):
            out.append(HDR + line + RESET)
            continue
        # Screw-cap rows: many vertical bars, no box corners, no orange blocks
        if (
            "█" not in line
            and line.count("│") >= 6
            and "┌" not in line
            and "└" not in line
            and "├" not in line
            and "RX" not in line
            and "CAPSULES" not in line
        ):
            out.append(GRAY + line + RESET)
            continue
        if "█" in line:
            colored = _orange_blocks(line)
            colored = _label_highlights(colored)
            out.append(colored)
            continue
        if "░" in line or "▒" in line or "▓" in line:
            out.append(_shaded_capsule_line(line) + RESET)
            continue
        out.append(DIM_YELLOW + line + RESET)
    return "\n".join(out) + "\n"


def embed_readme(banner_ansi: str, pills_ansi: str) -> None:
    readme = Path("README.md")
    text = readme.read_text(encoding="utf-8")
    # No trailing newline: closing fence is "\n```" (fence_end points at that \n)
    b = banner_ansi.rstrip()
    p = pills_ansi.rstrip()

    def replace_fence(content: str, needle: str, replacement: str) -> str:
        start = content.find(needle)
        if start == -1:
            return content
        fence_start = content.find("```ansi\n", start)
        if fence_start == -1:
            return content
        body_start = fence_start + len("```ansi\n")
        fence_end = content.find("\n```", body_start)
        if fence_end == -1:
            return content
        # Keep the newline before the closing ``` (fence_end points at that \n)
        return content[:body_start] + replacement + content[fence_end:]

    text = replace_fence(text, "Top banner", b)
    text = replace_fence(text, "RX Shelf", p)
    readme.write_text(text, encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parent
    banner_txt = (root / "banner.txt").read_text(encoding="utf-8")
    pills_txt = (root / "pills.txt").read_text(encoding="utf-8")

    banner_ansi = colorize_banner(banner_txt)
    pills_ansi = colorize_pills(pills_txt)

    (root / "banner.ans").write_text(banner_ansi, encoding="utf-8")
    (root / "pills.ans").write_text(pills_ansi, encoding="utf-8")

    # README lives at repo root
    import os

    os.chdir(root.parent)
    embed_readme(banner_ansi, pills_ansi)
    print("Wrote assets/banner.ans, assets/pills.ans, updated README.md ansi blocks.")


if __name__ == "__main__":
    main()
