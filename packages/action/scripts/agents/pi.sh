#!/usr/bin/env bash
# Pi adapter — https://pi.dev
#
# Pi already reads `.agents/skills/`, which is where install-skills.sh puts
# packs for non-Claude agents, so a pack installs here with no special casing.
# Pi's full search order is:
#   ~/.pi/agent/skills/  ~/.agents/skills/  .pi/skills/  .agents/skills/
#
# Pi is multi-provider. Pass --provider/--model through `agent-args` to pick
# one; without it pi uses whatever the runner's config defaults to.
# shellcheck disable=SC2034  # read by ralph.sh after sourcing
AGENT_COMMITS=true

agent_preflight() {
  command -v pi >/dev/null 2>&1 || {
    echo "error: 'pi' not found on this runner. Install with:" >&2
    echo "         npm install -g --ignore-scripts @earendil-works/pi-coding-agent" >&2
    echo "       or: curl -fsSL https://pi.dev/install.sh | sh" >&2
    return 1
  }

  # Pi supports 15+ providers, so there is no single key to check for. A
  # persisted `/login` covers the subscription path; otherwise look for any
  # provider key. PI_CODING_AGENT_DIR overrides the config location.
  local cfg="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
  if [ ! -d "$cfg" ] \
     && [ -z "${ANTHROPIC_API_KEY:-}" ] \
     && [ -z "${OPENAI_API_KEY:-}" ] \
     && [ -z "${GEMINI_API_KEY:-}" ] \
     && [ -z "${GOOGLE_API_KEY:-}" ]; then
    echo "error: pi is not authenticated. Run 'pi' then '/login' on this runner," >&2
    echo "       or set a provider key (e.g. ANTHROPIC_API_KEY) in the workflow env." >&2
    return 1
  fi
}

agent_run() {
  local prompt_file="$1"

  # -a is not optional here. In non-interactive modes pi falls back to
  # `defaultProjectTrust`, which is `ask` by default and *silently ignores*
  # project-local resources. The skill pack we just installed is a
  # project-local resource, so without -a pi would run with no skills loaded
  # and still exit 0 — a plausible PR built from none of the workflow.
  pi --print --approve \
    ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
    "$(cat "$prompt_file")"
}
