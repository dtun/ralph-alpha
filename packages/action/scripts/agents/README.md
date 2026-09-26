# Agent adapters

The BYO-agent seam. An adapter is a sourced shell file that teaches Ralph how to
invoke one CLI. Adding an agent should not require touching `ralph.sh`.

## Contract

```bash
AGENT_COMMITS=true|false   # does the agent commit its own work?

agent_preflight()          # exit non-zero with a fixable message if the CLI
                           # is missing or unauthenticated

agent_run <prompt_file>    # run to completion against $PWD, non-interactive
                           # must forward "${AGENT_ARGS_ARR[@]}"
```

### `AGENT_COMMITS`

Skill packs that drive a `/implement`-style flow expect the agent to commit as
it goes, so most adapters set `true`. Ralph then treats any leftover working-tree
changes as a safety-net sweep.

Set `false` for an agent that only edits files. Ralph commits the result itself
with a conventional message derived from the issue title. Defaults to `true` if
the adapter does not say.

### `agent_preflight`

Runs before anything else, including the branch cut. Fail loudly and
actionably — the person reading it is looking at a CI log, not a terminal, and
needs to know exactly what to install or authenticate.

### `agent_run`

Must be fully non-interactive: no TTY, no prompts, no permission dialogs. Ralph
wraps the call in `timeout(1)` and sends `SIGINT` at the budget, so prefer flags
that let the agent exit cleanly on interrupt.

`$PWD` is the repo checkout on the correct branch, with the skill pack already
installed under `.claude/skills/` (Claude) or `.agents/skills/` (everything
else). Do not `cd`, push, or touch git remotes.

### `AGENT_ARGS_ARR`

The `agent-args` input, already split into an array by `ralph.sh`. Every adapter
must forward it, or the input silently does nothing for that agent:

```bash
your-cli --your-flags \
  ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} \
  "$(cat "$prompt_file")"
```

The `[@]+` guard is not decoration. macOS runners still ship bash 3.2, where
expanding an empty array under `set -u` is an error; the guard makes the empty
case expand to nothing instead of aborting the run.
