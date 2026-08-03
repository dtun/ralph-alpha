#!/usr/bin/env bash
# Install a pinned skill pack into the workspace so the agent picks it up.
#
# Packs follow the Agent Skills layout: skills/<bucket>/<name>/SKILL.md
# We copy rather than use the pack's own installer because CI needs a
# deterministic, non-interactive, pinnable install.
set -euo pipefail

SKILLS_REPO="${SKILLS_REPO:?}"
SKILLS_REF="${SKILLS_REF:?}"
SKILLS="${SKILLS:-}"
AGENT="${AGENT:-claude}"

# Where each harness looks for project-scoped skills.
case "$AGENT" in
  claude) DEST=".claude/skills" ;;
  *)      DEST=".agents/skills" ;;
esac

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> Installing $SKILLS_REPO@$SKILLS_REF into $DEST"
git clone --quiet --depth 1 --branch "$SKILLS_REF" \
  "https://github.com/${SKILLS_REPO}.git" "$TMP/pack" 2>/dev/null || {
    # Not a tag or branch — fall back to fetching a bare SHA.
    git init --quiet "$TMP/pack"
    git -C "$TMP/pack" remote add origin "https://github.com/${SKILLS_REPO}.git"
    git -C "$TMP/pack" fetch --quiet --depth 1 origin "$SKILLS_REF"
    git -C "$TMP/pack" checkout --quiet FETCH_HEAD
  }

RESOLVED="$(git -C "$TMP/pack" rev-parse HEAD)"
echo "    resolved to $RESOLVED"

if [ ! -d "$TMP/pack/skills" ]; then
  echo "error: $SKILLS_REPO has no skills/ directory — not an Agent Skills pack." >&2
  exit 1
fi

mkdir -p "$DEST"

# Skills the repo ships itself, counted before anything is copied in.
local_count="$(find "$DEST" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d '[:space:]')"

installed=0
overridden=0
overridden_names=""
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  name="$(basename "$src")"

  # Explicit allowlist, when given.
  if [ -n "$SKILLS" ] && [[ " $SKILLS " != *" $name "* ]]; then
    continue
  fi

  # Local wins. A skill committed to the repo is a deliberate override, and
  # the more specific source should beat the more general one. Overwriting it
  # would also modify a tracked file, which .git/info/exclude cannot suppress
  # — the pack would end up committed into the agent's pull request.
  if [ -e "$DEST/$name" ]; then
    overridden=$((overridden + 1))
    overridden_names="$overridden_names $name"
    continue
  fi

  cp -R "$src" "$DEST/$name"
  installed=$((installed + 1))
done < <(find "$TMP/pack/skills" -name SKILL.md \
           -not -path '*/node_modules/*' \
           -not -path '*/deprecated/*' \
           -not -path '*/in-progress/*' -print0)

if [ "$installed" -eq 0 ] && [ "$local_count" -eq 0 ]; then
  echo "error: no skills installed. Check the 'skills' input against the pack's contents." >&2
  exit 1
fi

# The pack is tooling, not source. Keep it out of the agent's diff without
# touching a tracked .gitignore — info/exclude is local to this checkout.
mkdir -p .git/info
for path in ".claude/skills/" ".agents/skills/"; do
  grep -qxF "$path" .git/info/exclude 2>/dev/null || echo "$path" >> .git/info/exclude
done

# Three layers reach the agent and only one of them is pinned, so say out loud
# which is which. Two runners behaving differently is otherwise very hard to
# debug from a log that just says "installed 26 skills".
echo "==> pack: $installed installed from $SKILLS_REPO@$SKILLS_REF (pinned)"
if [ "$local_count" -gt 0 ]; then
  echo "==> repo: $overridden kept over the pack (${overridden_names# }), $((local_count - overridden)) repo-only"
else
  echo "==> repo: none"
fi
echo "==> home: skills under \$HOME on this runner are visible too, and Ralph"
echo "          does not pin them — check here first if two runners disagree."

echo "SKILLS_RESOLVED_SHA=$RESOLVED" >> "$GITHUB_ENV"
