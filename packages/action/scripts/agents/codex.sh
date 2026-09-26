#!/usr/bin/env bash
# Codex adapter. The pack ships agents/openai.yaml metadata alongside each
# SKILL.md, so skills installed under .agents/skills are discoverable here.
# shellcheck disable=SC2034  # read by ralph.sh after sourcing
AGENT_COMMITS=true

agent_preflight() {
  command -v codex >/dev/null 2>&1 || {
    echo "error: 'codex' not found on this runner. Install with: npm i -g @openai/codex" >&2
    return 1
  }
  if [ -z "${OPENAI_API_KEY:-}" ] && [ ! -d "$HOME/.codex" ]; then
    echo "error: codex is not authenticated. Run 'codex login' on this runner, or set OPENAI_API_KEY." >&2
    return 1
  fi
}

agent_run() {
  local prompt_file="$1"
  codex exec \
    --sandbox workspace-write \
    --cd "$PWD" \
    ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
    "$(cat "$prompt_file")"
}
