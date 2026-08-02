#!/usr/bin/env bash
# Adapter contract:
#   agent_preflight       -> exit 0 if the CLI exists and is authenticated
#   agent_run <promptfile> -> run the agent to completion against $PWD
#   AGENT_COMMITS=true|false — does the agent commit its own work?
#
# A pack that drives /implement expects to commit as it goes, so this must be
# true for skill-driven runs. Adapters whose agent does not commit are still
# supported; ralph.sh commits for them at the end.
# shellcheck disable=SC2034  # read by ralph.sh after sourcing
AGENT_COMMITS=true

agent_preflight() {
  command -v claude >/dev/null 2>&1 || {
    echo "error: 'claude' not found on this runner. Install with: npm i -g @anthropic-ai/claude-code" >&2
    return 1
  }
  # Either an API key in the environment or a persisted subscription login.
  if [ -z "${ANTHROPIC_API_KEY:-}" ] && [ ! -d "$HOME/.claude" ]; then
    echo "error: claude is not authenticated. Run 'claude auth login' on this runner, or set ANTHROPIC_API_KEY." >&2
    return 1
  fi
}

agent_run() {
  local prompt_file="$1"
  claude --print \
    --permission-mode acceptEdits \
    --add-dir "$PWD" \
    ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
    "$(cat "$prompt_file")"
}
