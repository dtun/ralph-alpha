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
  # The prompt goes in on stdin, not argv.
  #
  # --add-dir takes <directories...> and is variadic, so a positional prompt
  # after it is swallowed as another directory and claude exits with "Input
  # must be provided either through stdin or as a prompt argument". $PWD is
  # already the working directory, so --add-dir was redundant regardless.
  #
  # stdin is also the safer channel: a preamble plus a long brief can run to
  # several KB, which argv should not have to carry.
  # acceptEdits auto-accepts file edits but still gates bash, and in print mode
  # there is nobody to approve — so the agent could edit files but could not run
  # a test or commit. That silently disables the whole workflow: /tdd cannot do
  # red-green without executing anything, /implement cannot commit, and
  # /code-review has no diff to review. The work still lands, unexecuted and
  # unreviewed, which is worse than failing.
  #
  # bypassPermissions is a blunt fix. The agent inherits this runner's
  # credentials, so prefer a dedicated runner account until this is an explicit
  # --allowedTools allowlist instead.
  claude --print \
    --permission-mode bypassPermissions \
    ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
    < "$prompt_file"
}
