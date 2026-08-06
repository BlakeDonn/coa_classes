"""One-command deploy of the CoA Atlas site to GitHub Pages.

Copies the site's runtime files from reports/coa-specs/site into the
coa_classes checkout, commits, and pushes. GitHub Pages then serves the
new build from main. Run from WSL or Windows:

    python tools/deploy_coa_site.py ["commit message"]

The source of truth stays in this repo; coa_classes is deploy output only.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SRC = REPO / "reports" / "coa-specs" / "site"

# Runtime files only — build scripts, caches, and mockups never deploy.
FILES = [
    "index.html", "choose.html", "class.html", "loot.html",
    "styles.css", "explorer.css", "loot.css",
    "explorer.js", "profile-render.js", "choose.js", "class.js", "loot.js",
    "explorer-data.js", "loot-data.js",
]

WIN_DEST = Path("C:/Users/17274/Worktrees/coa_classes")
WSL_DEST = Path("/mnt/c/Users/17274/Worktrees/coa_classes")
WSL_GIT = Path("/mnt/c/Program Files/Git/cmd/git.exe")


def main() -> int:
    message = sys.argv[1] if len(sys.argv) > 1 else "Deploy CoA Atlas site"

    if WSL_DEST.is_dir():                      # WSL: copy via /mnt/c, push via Windows git
        dest, git, git_dir = WSL_DEST, str(WSL_GIT), str(WIN_DEST)
    elif WIN_DEST.is_dir():                    # native Windows
        dest, git, git_dir = WIN_DEST, "git", str(WIN_DEST)
    else:
        print("ERROR: coa_classes checkout not found at", WIN_DEST)
        return 1

    missing = [f for f in FILES if not (SRC / f).is_file()]
    if missing:
        print("ERROR: missing site files:", ", ".join(missing))
        return 1

    for f in FILES:
        (dest / f).write_bytes((SRC / f).read_bytes())
    (dest / ".nojekyll").write_bytes(b"")      # plain static deploy, no Jekyll
    print(f"Copied {len(FILES)} files + .nojekyll -> {dest}")

    def run(*args: str) -> int:
        return subprocess.run([git, "-C", git_dir, *args]).returncode

    run("add", "-A")
    if subprocess.run([git, "-C", git_dir, "diff", "--cached", "--quiet"]).returncode == 0:
        print("Nothing changed; skipping commit. (Push anyway with an empty commit if retriggering.)")
        return 0
    if run("commit", "-m", message) != 0:
        return 1
    if run("push", "origin", "main") != 0:
        print("Push failed — check network/credentials and rerun.")
        return 1
    print("Pushed. GitHub Pages will rebuild https://blakedonn.github.io/coa_classes/ shortly.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
