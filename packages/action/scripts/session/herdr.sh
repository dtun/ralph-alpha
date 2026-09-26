#!/usr/bin/env bash
# Session mode: run the agent interactively inside a named herdr session that a
# human can join, instead of headless in print mode.
#
# Sourced by ralph.sh when `session: herdr`. Provides:
#   session_preflight        -> exit non-zero with a fixable message
#   session_run <prompt_file> -> 0 when the agent settles, 124 at the budget,
#                               anything else on error (same contract as the
#                               timeout(1)-wrapped agent_run)
#   SESSION_NOTE             -> markdown line for the PR body
#
# The session is deliberately left running when the job ends, so a human can
# review or keep steering. Old sessions are reaped at the start of later runs.
#
# Everything here was found the hard way on a real runner; see
# dtun/ralph-alpha#12 for the runs behind each workaround.

SESSION_NAME="ralph-${ISSUE_NUMBER}-${RUN_NUMBER}"
SESSION_AGENT="issue-${ISSUE_NUMBER}"
SESSION_TTL_HOURS="${SESSION_TTL_HOURS:-24}"
SESSION_WAIT_MINUTES="${SESSION_WAIT_MINUTES:-60}"
SESSION_SSH_HOST="${SESSION_SSH_HOST:-}"
SESSION_NOTE=""

# A runner started from inside a herdr pane would otherwise talk to that pane's
# session, whatever --session says.
_herdr() {
  env -u HERDR_ENV -u HERDR_SOCKET_PATH -u HERDR_BIN_PATH \
      -u HERDR_PANE_ID -u HERDR_TAB_ID -u HERDR_WORKSPACE_ID \
      herdr "$@"
}
_hs() { _herdr --session "$SESSION_NAME" "$@"; }

session_preflight() {
  command -v herdr >/dev/null 2>&1 || {
    echo "error: session: herdr needs 'herdr' on this runner. See https://herdr.dev" >&2
    return 1
  }
  # Only claude has been run end to end in a session. Other kinds are
  # supported by herdr but their unattended flags differ (pi needs --approve
  # for project skills, codex a sandbox mode), so enable them once proven.
  if [ "$AGENT" != "claude" ]; then
    echo "error: session: herdr is only supported with agent: claude so far." >&2
    return 1
  fi
}

# Stop sessions this action started that are no longer useful: earlier runs
# for the same issue (the new run replaces them, as the workflow's concurrency
# group does for jobs) and any whose session file has not changed within the
# TTL. Only names Ralph generates are touched, never a human's own sessions.
_session_reap() {
  local list name dir
  list="$(_herdr session list --json 2>/dev/null)" || return 0
  echo "$list" | jq -r '.sessions[] | select(.name | test("^ralph-[0-9]+-[0-9]+$")) | "\(.name)\t\(.session_dir)"' |
  while IFS=$'\t' read -r name dir; do
    if [[ "$name" == "ralph-${ISSUE_NUMBER}-"* ]] \
       || [ -n "$(find "$dir" -maxdepth 1 -name session.json -mmin +$((SESSION_TTL_HOURS * 60)) 2>/dev/null)" ]; then
      say "Reaping herdr session ${name}"
      _herdr session stop "$name" >/dev/null 2>&1 || true
      _herdr session delete "$name" >/dev/null 2>&1 || true
    fi
  done
}

_session_start_server() {
  # RUNNER_TRACKING_ID unset: the runner kills every process still carrying its
  # tracking id when the job ends, which would take the session with it.
  #
  # Tokens unset: the session outlives the job, and the workflow token dies
  # with it, so an agent still holding GH_TOKEN would find gh broken the
  # moment a human took over. Without it, gh falls back to the runner user's
  # own login — the agent acts as you, which is the point of this mode.
  env -u RUNNER_TRACKING_ID -u GH_TOKEN -u GITHUB_TOKEN \
      -u ACTIONS_RUNTIME_TOKEN -u ACTIONS_ID_TOKEN_REQUEST_TOKEN -u ACTIONS_ID_TOKEN_REQUEST_URL \
      -u CLAUDECODE -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_CODE_ENTRYPOINT \
      -u HERDR_ENV -u HERDR_SOCKET_PATH -u HERDR_BIN_PATH \
      -u HERDR_PANE_ID -u HERDR_TAB_ID -u HERDR_WORKSPACE_ID \
      nohup herdr --session "$SESSION_NAME" server > "${RUNNER_TEMP:-/tmp}/${SESSION_NAME}.log" 2>&1 &

  local _
  for _ in $(seq 40); do
    _herdr session list --json 2>/dev/null |
      jq -e --arg n "$SESSION_NAME" '.sessions[] | select(.name == $n and .running)' >/dev/null && return 0
    sleep 0.5
  done
  echo "error: herdr session ${SESSION_NAME} did not start. Log: ${RUNNER_TEMP:-/tmp}/${SESSION_NAME}.log" >&2
  return 1
}

_session_status() { _hs agent get "$SESSION_AGENT" 2>/dev/null | jq -r '.result.agent.agent_status // "unknown"'; }

_session_screen() { _hs agent read "$SESSION_AGENT" --source recent-unwrapped --lines "${1:-30}" 2>/dev/null | grep -v '^[[:space:]]*$' || true; }

_session_start_agent() {
  local ws pane out
  # ZELLIJ=0: shell rc files commonly auto-start zellij unless $ZELLIJ is set,
  # which leaves the pane running a multiplexer instead of a free shell.
  ws="$(_hs workspace create --cwd "$PWD" --label "issue-${ISSUE_NUMBER}" --env ZELLIJ=0 --no-focus)"
  pane="$(echo "$ws" | jq -r '.result.root_pane.pane_id')"
  # The pane is only an available shell once the user's rc files have loaded,
  # which under a launchd-started runner can take several seconds; until then
  # herdr answers agent_pane_busy. agent start reports agent_not_ready on
  # stderr, so capture both.
  local attempt
  for attempt in $(seq 15); do
    out="$(_hs agent start "$SESSION_AGENT" --kind "$AGENT" --pane "$pane" --timeout 90000 \
             ${AGENT_ARGS_ARR[@]+"--" "${AGENT_ARGS_ARR[@]}"} 2>&1)" || true
    echo "$out" | grep -q agent_pane_busy || break
    sleep 2
  done

  if echo "$out" | grep -q agent_not_ready; then
    # A checkout claude has not seen asks whether to trust the folder. Ralph
    # just checked it out for this run, so it answers yes.
    if _session_screen 40 | grep -q "trust this folder"; then
      say "Accepting the folder-trust prompt for the fresh checkout."
      _hs agent send-keys "$SESSION_AGENT" down enter >/dev/null
    fi
    _hs agent wait "$SESSION_AGENT" --until idle --until "done" --timeout 60000 >/dev/null 2>&1 || true
  elif ! echo "$out" | grep -q agent_started; then
    echo "error: could not start ${AGENT} in herdr: $out" >&2
    return 1
  fi

  case "$(_session_status)" in
    idle|done) return 0 ;;
    *)
      echo "error: ${AGENT} did not become ready in herdr. Screen:" >&2
      _session_screen 20 >&2
      return 1 ;;
  esac
}

_session_attach_help() {
  echo "On the runner: \`herdr session attach ${SESSION_NAME}\`"
  [ -n "$SESSION_SSH_HOST" ] && \
    echo "From anywhere: \`herdr --remote $(id -un)@${SESSION_SSH_HOST} --session ${SESSION_NAME}\`"
  return 0
}

# Never hand herdr a non-positive timeout; a spent budget still gets one second
# so the call returns "timeout" rather than an argument error.
_ms_left() {
  local ms=$(( (DEADLINE - $(date +%s)) * 1000 ))
  [ "$ms" -lt 1000 ] && ms=1000
  echo "$ms"
}

session_run() {
  local prompt_file="$1" text out state attempt asked=false posted_question="" wait_start

  _session_reap
  say "Starting herdr session ${SESSION_NAME}"
  _session_start_server || return 1
  _session_start_agent  || return 1

  gh issue comment "$ISSUE_NUMBER" --body "$(cat <<EOF
🤖 **Live session.** The agent is running in herdr on \`${RUNNER_LABEL}\`. Join it to watch or chime in:

$(_session_attach_help)

The session stays up after the run for review; the next run for this issue replaces it.
EOF
)" > /dev/null

  # The brief lives in a file, not in the typed prompt: it is long, and the
  # slash command has to lead the input for the harness to resolve it.
  cp "$prompt_file" "$RALPH_DIR/PROMPT.md"
  text="${COMMAND} the work for issue #${ISSUE_NUMBER}. Your full instructions, the rules for this run and the brief, are in ${RALPH_DIR}/PROMPT.md. Read that file completely before doing anything else."

  DEADLINE=$(( $(date +%s) + TIMEOUT_MINUTES * 60 ))

  # Straight after startup the TUI can drop the first input while herdr already
  # reports idle, which herdr surfaces as agent_prompt_stalled.
  for attempt in 1 2 3 4 5; do
    out="$(_hs agent prompt "$SESSION_AGENT" "$text" --wait --timeout "$(_ms_left)" 2>&1)" || true
    echo "$out" | grep -q agent_prompt_stalled || break
    say "Prompt was not picked up (attempt ${attempt}); retrying."
    sleep 3
  done

  while :; do
    if echo "$out" | grep -qE '"code":"[a-z_]*timeout'; then
      say "Agent hit the ${TIMEOUT_MINUTES}m budget; interrupting it. The session stays up."
      _hs agent send-keys "$SESSION_AGENT" esc >/dev/null 2>&1 || true
      state=timeout
    elif echo "$out" | grep -q '"error"'; then
      echo "error: herdr: $out" >&2
      _session_screen 20 >&2
      state=error
    else
      state="$(echo "$out" | jq -r '.result.agent.agent_status // "unknown"' 2>/dev/null)"
      # A blocked report can trail the screen by a moment; confirm it.
      if [ "$state" = blocked ]; then
        sleep 2
        state="$(_session_status)"
      fi
    fi

    case "$state" in
      idle|done)
        # Settled, but a question in plain text looks idle too, so the
        # session preamble has the agent flag one in WAITING.md.
        [ -f "$RALPH_DIR/WAITING.md" ] || break
        if [ "$(cat "$RALPH_DIR/WAITING.md")" != "$posted_question" ]; then
          posted_question="$(cat "$RALPH_DIR/WAITING.md")"
          say "Agent asked a question and is waiting for an answer."
          gh issue comment "$ISSUE_NUMBER" --body "$(cat <<EOF
🤖 **The agent has a question.** Join the session to answer it:

$(_session_attach_help)

$(head -60 "$RALPH_DIR/WAITING.md")
EOF
)" > /dev/null
        fi
        # An answer shows up as the agent going back to work. Waiting for a
        # human is not the agent working, so the agent's clock stops here:
        # the wait has its own cap, and whatever it used is added back to
        # the budget once someone answers.
        wait_start=$(date +%s)
        out="$(_hs agent wait "$SESSION_AGENT" --until working \
                 --timeout $((SESSION_WAIT_MINUTES * 60000)) 2>&1)" || true
        if echo "$out" | grep -q '"error"'; then
          say "Nobody answered within ${SESSION_WAIT_MINUTES}m."
          state=unanswered
          break
        fi
        DEADLINE=$(( DEADLINE + $(date +%s) - wait_start ))
        say "Got an answer; the agent is working again."
        out="$(_hs agent wait "$SESSION_AGENT" --timeout "$(_ms_left)" 2>&1)" || true
        ;;
      blocked)
        # The agent is waiting on a question or an approval. That is what
        # joining is for: say so once, then wait for someone to answer.
        if [ "$asked" = false ]; then
          asked=true
          say "Agent is waiting for input."
          gh issue comment "$ISSUE_NUMBER" --body "$(cat <<EOF
🤖 **The agent is waiting for input.** Join the session to answer:

$(_session_attach_help)
EOF
)" > /dev/null
        fi
        out="$(_hs agent wait "$SESSION_AGENT" --until idle --until "done" --timeout "$(_ms_left)" 2>&1)" || true
        ;;
      *) break ;;
    esac
  done

  # Nobody answered in time. The question is still the most useful thing the
  # run produced, so hand it to the existing blocked path, which opens a PR
  # carrying it.
  if [ -f "$RALPH_DIR/WAITING.md" ]; then
    say "Question went unanswered; reporting it as a block."
    mv "$RALPH_DIR/WAITING.md" "$RALPH_DIR/BLOCKED.md"
  fi

  echo "---- agent screen (tail) ----"
  _session_screen 40 | tail -40
  echo "-----------------------------"

  # shellcheck disable=SC2034  # read by ralph.sh after session_run
  SESSION_NOTE="🖥️ The session is still up for review. $(_session_attach_help | head -1)"

  # An unanswered question is a block (handled above), not a failure: the
  # agent stopped where it was told to.
  case "$state" in
    idle|done|unanswered) return 0 ;;
    timeout)   return 124 ;;
    *)         return 1 ;;
  esac
}
