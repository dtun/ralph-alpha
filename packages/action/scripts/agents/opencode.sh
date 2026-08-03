#!/usr/bin/env bash
# OpenCode adapter.
# shellcheck disable=SC2034  # read by ralph.sh after sourcing
AGENT_COMMITS=true

agent_preflight() {
  command -v opencode >/dev/null 2>&1 || {
    echo "error: 'opencode' not found on this runner. See https://opencode.ai for install." >&2
    return 1
  }
}

agent_run() {
  local prompt_file="$1"
  opencode run \
    ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
    "$(cat "$prompt_file")"
}
