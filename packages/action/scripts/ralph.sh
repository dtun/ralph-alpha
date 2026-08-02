#!/usr/bin/env bash
# Ralph: take a triaged issue, drive a skill pack on this runner, leave a PR.
#
# Ralph deliberately owns very little. The skill pack owns the workflow — how to
# test, when to review, when it is done. Ralph owns the trigger, the workspace,
# the clock, and the reporting.
set -euo pipefail

ISSUE_NUMBER="${ISSUE_NUMBER:?}"
AGENT="${AGENT:-claude}"
AGENT_ARGS="${AGENT_ARGS:-}"
COMMAND="${COMMAND:-/implement}"
BASE_REF="${BASE_REF:-main}"
VERIFY_CMD="${VERIFY_CMD:-}"
TIMEOUT_MINUTES="${TIMEOUT_MINUTES:-45}"
DRAFT="${DRAFT:-true}"
RUN_NUMBER="${RUN_NUMBER:-0}"
RUN_URL="${RUN_URL:-}"
RUNNER_LABEL="${RUNNER_LABEL:-unknown}"
ACTION_PATH="${ACTION_PATH:?}"

BRANCH="ralph/${ISSUE_NUMBER}/${RUN_NUMBER}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

emit() { echo "$1=$2" >> "${GITHUB_OUTPUT:-/dev/null}"; }
say()  { echo "==> $*"; }

# ---------------------------------------------------------------- adapter ----

ADAPTER="$ACTION_PATH/scripts/agents/${AGENT}.sh"
[ -f "$ADAPTER" ] || {
  available="$(find "$ACTION_PATH/scripts/agents" -name '*.sh' -exec basename {} .sh \; | sort | tr '\n' ' ')"
  echo "error: no adapter for agent '$AGENT'. Available: $available" >&2
  exit 1
}
AGENT_COMMITS=true   # adapters may override; see scripts/agents/README.md

# Split the passthrough flags once, here, so adapters never re-parse a string.
# read -ra leaves the array unset when the input is empty, which is why
# adapters expand it as "${AGENT_ARGS_ARR[@]+...}" — bash 3.2 on macOS runners
# errors on an unset array under `set -u` otherwise.
AGENT_ARGS_ARR=()
[ -n "$AGENT_ARGS" ] && read -ra AGENT_ARGS_ARR <<< "$AGENT_ARGS"

# shellcheck source=/dev/null
source "$ADAPTER"
agent_preflight

# ------------------------------------------------------------ preconditions --

# The skill pack expects per-repo config written by its setup skill. Failing
# here with a clear message beats an agent improvising its way to a bad PR.
if [ ! -f "docs/agents/issue-tracker.md" ]; then
  say "warning: docs/agents/issue-tracker.md not found."
  say "         Run the pack's setup skill in this repo once, locally, before relying on Ralph."
fi

command -v gh >/dev/null 2>&1 || { echo "error: 'gh' not found on this runner." >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "error: 'jq' not found on this runner." >&2; exit 1; }

if   command -v timeout  >/dev/null 2>&1; then TIMEOUT_BIN="timeout"
elif command -v gtimeout >/dev/null 2>&1; then TIMEOUT_BIN="gtimeout"
else
  TIMEOUT_BIN=""
  say "warning: no timeout(1) on this runner (brew install coreutils on macOS)."
  say "         Falling back to the job-level timeout only."
fi

# ------------------------------------------------------------------ intake ---

say "Reading issue #${ISSUE_NUMBER}"
gh issue view "$ISSUE_NUMBER" --json title,body,comments > "$WORK/issue.json"

ISSUE_TITLE="$(jq -r '.title' "$WORK/issue.json")"
jq -r '.body // ""' "$WORK/issue.json" > "$WORK/body.md"

# The most recent Agent Brief comment wins — briefs get revised during triage.
jq -r '[.comments[]? | select(.body | test("^#+ *Agent Brief"; "m"))] | last | .body // ""' \
  "$WORK/issue.json" > "$WORK/brief.md"

# Not [ -s ]: jq writes a trailing newline even for an empty result, so an
# absent brief still produces a 1-byte file.
if [ -n "$(tr -d '[:space:]' < "$WORK/brief.md")" ]; then
  HAS_BRIEF=true
  say "Found an agent brief ($(wc -l < "$WORK/brief.md" | tr -d ' ') lines)"
else
  HAS_BRIEF=false
  say "warning: no agent brief on this issue — falling back to the issue body."
fi

# ------------------------------------------------------------------ branch ---

git config user.name  "ralph[bot]"
git config user.email "ralph[bot]@users.noreply.github.com"
git checkout -q -b "$BRANCH"
START_SHA="$(git rev-parse HEAD)"
emit "branch" "$BRANCH"

# ------------------------------------------------------------------ prompt ---

# Placeholders are substituted with values we control (a ref name and an
# integer). Issue-authored text is only ever concatenated, never interpolated.
sed -e "s|{{BASE_REF}}|${BASE_REF}|g" \
    -e "s|{{ISSUE_NUMBER}}|${ISSUE_NUMBER}|g" \
    "$ACTION_PATH/scripts/afk-preamble.md" > "$WORK/prompt.md"

{
  echo
  echo "---"
  echo
  echo "# Your task"
  echo
  echo "${COMMAND} the work specified below, for issue #${ISSUE_NUMBER}."
  echo
  echo "## Issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}"
  echo
  if [ "$HAS_BRIEF" = true ]; then
    cat "$WORK/brief.md"
    echo
    echo "<details><summary>Original issue body (context only — the brief above is the contract)</summary>"
    echo
    cat "$WORK/body.md"
    echo
    echo "</details>"
  else
    echo "> No agent brief was posted on this issue. Treat the body below as the"
    echo "> specification, and be conservative: implement what is clearly asked and"
    echo "> nothing more. Record everything you inferred in ASSUMPTIONS.md."
    echo
    cat "$WORK/body.md"
  fi
} >> "$WORK/prompt.md"

# ------------------------------------------------------------------- claim ---

gh issue comment "$ISSUE_NUMBER" --body "$(cat <<EOF
🤖 **Ralph picked this up** — \`${RUNNER_LABEL}\`, agent \`${AGENT}\`, skills \`${SKILLS_RESOLVED_SHA:0:7}\`

Branch \`${BRANCH}\`. [Follow along](${RUN_URL}).
EOF
)" > /dev/null

# --------------------------------------------------------------------- run ---

say "Running ${AGENT} ${COMMAND} (budget ${TIMEOUT_MINUTES}m)"
AGENT_STATUS=0
if [ -n "$TIMEOUT_BIN" ]; then
  # timeout(1) needs a command, so the adapter function and its argument array
  # are serialised into the subshell. Arrays are not exported, so passthrough
  # flags would be silently dropped without the declare -p.
  ARGS_DECL="AGENT_ARGS_ARR=()"
  [ -n "$AGENT_ARGS" ] && ARGS_DECL="$(declare -p AGENT_ARGS_ARR)"

  "$TIMEOUT_BIN" --signal=INT "${TIMEOUT_MINUTES}m" bash -c \
    "set -u; ${ARGS_DECL}; $(declare -f agent_run); agent_run \"\$1\"" \
    _ "$WORK/prompt.md" || AGENT_STATUS=$?
else
  agent_run "$WORK/prompt.md" || AGENT_STATUS=$?
fi

TIMED_OUT=false
if [ "$AGENT_STATUS" -eq 124 ] || [ "$AGENT_STATUS" -eq 130 ]; then
  TIMED_OUT=true
  say "Agent hit the ${TIMEOUT_MINUTES}m budget."
elif [ "$AGENT_STATUS" -ne 0 ]; then
  say "Agent exited $AGENT_STATUS."
fi

# Belt and braces: the pack must never enter the diff. install-skills.sh
# refuses to overwrite a skill the repo already ships, so this should find
# nothing — but .git/info/exclude cannot suppress a *tracked* file, so a
# regression there would silently commit the pack over someone's own skill.
for skills_dir in .claude/skills .agents/skills; do
  if [ -n "$(git status --porcelain -- "$skills_dir" 2>/dev/null)" ]; then
    say "warning: tracked files under $skills_dir changed; restoring before commit."
    git checkout -- "$skills_dir" 2>/dev/null || true
  fi
done

# Sweep up anything left in the tree, so partial work is never lost. For an
# agent that commits as it goes this is a safety net and the message says so;
# for one that never commits, this is the only commit, so it carries the work.
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  if [ "${AGENT_COMMITS}" = true ]; then
    say "Sweeping up work the agent left uncommitted."
    git commit -q -m "chore: sweep uncommitted work from ralph run (#${ISSUE_NUMBER})"
  else
    say "Committing on behalf of ${AGENT} (adapter declares AGENT_COMMITS=false)."
    git commit -q -m "feat: ${ISSUE_TITLE} (#${ISSUE_NUMBER})"
  fi
fi

COMMITS="$(git rev-list "${START_SHA}..HEAD" --count)"
say "${COMMITS} commit(s) on ${BRANCH}"

# ------------------------------------------------------------------ assess ---

BLOCKED=false
BLOCKED_TEXT=""
if [ -f "BLOCKED.md" ]; then
  BLOCKED=true
  BLOCKED_TEXT="$(cat BLOCKED.md)"
  say "Agent reported blocked."
fi

if [ "$COMMITS" -eq 0 ]; then
  say "No commits produced — nothing to open a PR for."
  emit "status" "no-changes"
  gh issue comment "$ISSUE_NUMBER" --body "$(cat <<EOF
🤖 **Ralph made no changes.**

The agent ran but produced no commits.$( [ "$TIMED_OUT" = true ] && echo " It hit the ${TIMEOUT_MINUTES}m budget first." )$( [ "$BLOCKED" = true ] && printf '\n\n%s' "$BLOCKED_TEXT" )

[Run log](${RUN_URL}) · this issue keeps its current labels.
EOF
)" > /dev/null
  exit 0
fi

VERIFY_OK=true
VERIFY_OUTPUT=""
if [ -n "$VERIFY_CMD" ]; then
  say "Verifying: ${VERIFY_CMD}"
  if VERIFY_OUTPUT="$(bash -c "$VERIFY_CMD" 2>&1)"; then
    say "Verify passed."
  else
    VERIFY_OK=false
    say "Verify failed — PR will be a draft."
  fi
fi

# Draft unless everything is clean.
PR_DRAFT="$DRAFT"
if [ "$BLOCKED" = true ] || [ "$VERIFY_OK" = false ] || [ "$TIMED_OUT" = true ]; then
  PR_DRAFT=true
fi

# --------------------------------------------------------------------- ship ---

git push -q origin "$BRANCH"

ASSUMPTIONS=""
[ -f "ASSUMPTIONS.md" ] && ASSUMPTIONS="$(cat ASSUMPTIONS.md)"

{
  echo "Closes #${ISSUE_NUMBER}"
  echo
  [ "$BLOCKED" = true ] && { echo "## ⚠️ Blocked"; echo; echo "$BLOCKED_TEXT"; echo; }
  [ "$TIMED_OUT" = true ] && { echo "## ⚠️ Hit the time budget"; echo; echo "The agent was stopped after ${TIMEOUT_MINUTES} minutes. The work below may be incomplete."; echo; }
  if [ "$VERIFY_OK" = false ]; then
    echo "## ⚠️ Verify failed"
    echo
    echo '```'
    echo "$VERIFY_OUTPUT" | tail -40
    echo '```'
    echo
  fi
  [ "$HAS_BRIEF" = false ] && { echo "> ⚠️ No agent brief was on this issue. The agent worked from the raw body — check the scope carefully."; echo; }
  if [ -n "$ASSUMPTIONS" ]; then
    echo "$ASSUMPTIONS"
    echo
  fi
  echo "---"
  echo
  echo "🤖 Ralph · agent \`${AGENT}\` · skills \`${SKILLS_RESOLVED_SHA:-unknown}\` · runner \`${RUNNER_LABEL}\` · [run log](${RUN_URL})"
  echo
  echo "\`ASSUMPTIONS.md\` and \`BLOCKED.md\` are run artifacts — delete them before merging."
} > "$WORK/pr-body.md"

PR_ARGS=(--title "$ISSUE_TITLE" --body-file "$WORK/pr-body.md" --base "$BASE_REF" --head "$BRANCH")
[ "$PR_DRAFT" = "true" ] && PR_ARGS+=(--draft)

PR_URL="$(gh pr create "${PR_ARGS[@]}")"
say "Opened ${PR_URL}"
emit "pr_url" "$PR_URL"

if [ "$BLOCKED" = true ]; then
  emit "status" "blocked"
else
  emit "status" "success"
fi

gh issue comment "$ISSUE_NUMBER" --body "🤖 **Ralph opened ${PR_URL}**$( [ "$PR_DRAFT" = "true" ] && echo " (draft — see the PR for why)" )" > /dev/null
