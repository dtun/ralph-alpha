# Ralph

Register your machines as runners. Label an issue. Get a pull request.

Ralph is an agent orchestrator with a deliberately small surface. It does not
decide how software gets built — a **skill pack** does that. Ralph owns the
trigger, the workspace, the clock, and the reporting back to your tracker.
Everything else is pluggable.

```
issue labeled ready-for-agent
        │
        ▼
  your runner claims it        ← GitHub Actions, your hardware
        │
        ▼
  install pinned skill pack    ← mattpocock/skills@v1.1.0, or yours
        │
        ▼
  agent runs /implement        ← claude | codex | opencode | pi
        │
        ▼
  draft PR + ASSUMPTIONS.md    ← back on the issue thread
```

## Why it triggers on `ready-for-agent`

Ralph does not define its own label. It reuses the one your triage flow already
produces.

In [mattpocock/skills](https://github.com/mattpocock/skills), `/triage` moves
issues through a state machine, and `ready-for-agent` means _fully specified,
ready for an AFK agent_. Moving an issue there also posts an **Agent Brief** — a
structured comment with current behaviour, desired behaviour, key interfaces,
acceptance criteria, and explicit scope boundaries.

That brief is exactly the contract an unattended agent needs, and a human wrote
or approved it. Ralph reads the most recent one on the issue and treats it as
the specification; the issue body is demoted to context. If no brief is present
Ralph still runs, but says so loudly on the PR.

The upshot: **the human gate is triage**, where it belongs. Ralph is the
mechanism that fires once a human has said the work is ready.

## Why the skill pack owns the loop

`/implement` already drives TDD at agreed seams, runs typechecks throughout and
the full suite at the end, then runs `/code-review` before committing. That is
the iterate-until-green loop. Reimplementing it in bash would produce a worse
version that drifts from the pack.

So Ralph does not loop. It sets a wall-clock budget and gets out of the way.
Iteration count, stop conditions, and what "done" means are the pack's business.

## Setup

**Once per machine** — register a self-hosted runner, then install the agent and
tools it needs:

```bash
npm i -g @anthropic-ai/claude-code && claude auth login
brew install gh jq coreutils   # coreutils gives macOS a timeout(1)
gh auth login
```

**Once per repo** — run the pack's setup skill locally, in a normal session:

```
/setup-matt-pocock-skills
```

That writes `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, and
`docs/agents/domain.md`. Ralph reads the same config, so there is no separate
`ralph.yml` to maintain. If your triage labels differ from the defaults, change
the workflow's `if:` to match the right-hand column of `triage-labels.md`.

Then copy [`examples/ralph.yml`](./examples/ralph.yml) into `.github/workflows/`.

## Versioning

```yaml
- uses: dtun/ralph-alpha/packages/action@v0
```

**`v0` means no stability promise.** Inputs may be renamed and behaviour may
change between releases while the design is still being proven on real runs.
The tag moves as fixes land, so you get them without editing your workflow —
and you inherit breaking changes the same way. Pin a commit SHA instead if you
need a workflow that cannot shift under you.

`v1` will mean the inputs have settled. It does not exist yet, and the
[open questions](#what-has-actually-been-observed) below are why.

## Inputs

| Input             | Default             | Notes                                                                  |
| ----------------- | ------------------- | ---------------------------------------------------------------------- |
| `issue-number`    | triggering issue    |                                                                        |
| `agent`           | `claude`            | `claude`, `codex`, `opencode`, `pi` — see [adapters](./scripts/agents) |
| `agent-args`      | —                   | flags passed straight to the agent CLI, split on whitespace            |
| `skills-repo`     | `mattpocock/skills` | any Agent Skills pack                                                  |
| `skills-ref`      | `v1.1.0`            | always pin                                                             |
| `skills`          | all                 | space-separated allowlist — must be transitively closed                |
| `command`         | `/implement`        | entry skill                                                            |
| `base`            | default branch      |                                                                        |
| `verify`          | —                   | outer guard; failure forces draft                                      |
| `timeout-minutes` | `45`                | wall-clock budget                                                      |
| `draft`           | `true`              |                                                                        |
| `github-token`    | `github.token`      | pass a PAT to get CI on Ralph's PRs                                    |

Outputs: `status` (`success` \| `blocked` \| `no-changes` \| `failed`),
`pr-url`, `branch`.

Skills invoke each other, so an allowlist has to include the whole chain —
`/implement` drives `/tdd` and `/code-review`, which reach for
`/codebase-design` and `/domain-modeling`. Leaving the default empty installs
all 28 non-deprecated skills and avoids the problem; narrow it only once you
know what your entry skill actually reaches for.

## Your own skills, on top

You do not have to choose between the pack and skills of your own. Three
sources reach the agent, and only the middle one is pinned:

1. **Your repo** — anything committed under `.claude/skills/` or
   `.agents/skills/`. **These win.** On a name collision the pack is skipped
   and yours is left alone, because a committed skill is a deliberate override.
2. **The pack** — cloned at `skills-ref` and copied in _around_ what your repo
   already defines. It fills gaps rather than replacing the set.
3. **The runner** — agents also read skills under `$HOME`, so whatever the
   person who set that machine up has installed is in scope. Ralph cannot pin
   this layer. It is the first place to look when two runners disagree.

Every run logs the split:

```
==> pack: 26 installed from mattpocock/skills@v1.1.0 (pinned)
==> repo: 1 kept over the pack (tdd), 1 repo-only
==> home: skills under $HOME on this runner are visible too ...
```

Local-wins is not only ergonomics. `.git/info/exclude` cannot suppress a
_tracked_ file, so overwriting a skill you had committed would show as a
modification and get swept into the agent's commit — silently shipping the
pack's version of your skill inside an unrelated pull request.

## Agents

Adapters live in [`scripts/agents/`](./scripts/agents). Each is one file
implementing a three-part contract, so adding an agent never touches
`ralph.sh`.

[**pi**](https://pi.dev) is the one worth calling out, for two reasons.

It already reads `.agents/skills/` — the same path Codex and other Agent
Skills harnesses use, and the one this action installs packs into. A pack drops
in with no special-casing, which is the clearest evidence so far that the
pack-level seam is genuinely portable rather than just claimed.

It is also multi-provider, so with pi "BYO agent" extends to "BYO model":

```yaml
with:
  agent: pi
  agent-args: --provider anthropic --model claude-opus-4-5
```

One trap, handled in the adapter but worth knowing about if you run pi by hand.
In non-interactive modes pi does not prompt for trust — it falls back to
`defaultProjectTrust`, which defaults to `ask`, and `ask` _ignores_
project-local resources. An installed skill pack is a project-local resource.
So `pi -p "/implement …"` without `--approve` runs your prompt with **zero
skills loaded and still exits 0**: a plausible PR built from none of the
workflow, with nothing in the log saying so. The adapter always passes `-a`.

## Running unattended skills that were written to be interactive

This is the interesting problem, and it is what
[`scripts/afk-preamble.md`](./scripts/afk-preamble.md) exists to solve.

The pack's skills assume a human is present. `/tdd` says _"No test is written at
an unconfirmed seam"_ — it wants you to agree the seams first. `/code-review`
asks for a fixed point if you did not give it one. On a runner there is nobody
to ask, so a naive run either stalls or silently invents an answer.

The preamble converts each interactive gate into a recorded decision:

- **Seam agreement** → derive seams from the brief's acceptance criteria, and
  write the chosen seams into `ASSUMPTIONS.md` before the first test.
- **Review fixed point** → the base ref, no question asked.
- **Spec location** → the Agent Brief, reproduced in `ASSUMPTIONS.md`.
- **Anything else** → make the call, record it with one line of reasoning.

`ASSUMPTIONS.md` then lands in the PR body, so the review starts with _"here is
every judgment call I made without you"_. That artifact is the point. An
unrecorded assumption is indistinguishable from a bug to whoever reviews this.

The preamble also draws a line: ambiguity gets an assumption, but a genuine
block — a product decision, a missing credential — gets `BLOCKED.md` and a stop.
Ralph turns that into a draft PR with the question on it, so a blocked run is a
useful outcome rather than a wasted one.

## Failure modes it handles

- **Agent produces nothing** — no PR, a comment on the issue saying so. It never
  pushes an empty branch and reports green.
- **Agent leaves work uncommitted** — swept into a commit so partial work
  survives.
- **Budget exhausted** — the work so far ships as a draft, flagged on the PR.
- **`verify` fails** — draft PR with the tail of the output in the body.
- **No agent brief** — runs conservatively, flags it prominently.

## What has actually been observed

**Skills resolve in print mode.** This is the assumption the whole design
rested on. A project-scoped skill placed in `.claude/skills/` and invoked as
`/name` through `claude --print` on stdin runs — confirmed against Claude Code
2.1.220 with a canary skill whose only job was to prove it.

**The pipeline runs on a real self-hosted runner.** Checkout, pinned pack
install, brief extraction from a live issue, branch creation and the
no-commits path have all executed on macOS/arm64.

Still unobserved:

- **A complete run ending in a pull request.** Every stage has run; they have
  not yet run in sequence all the way to one.
- **Whether the output is worth reviewing.** Whether the entry skill reliably
  produces mergeable work, and whether `ASSUMPTIONS.md` records decisions a
  reviewer actually wants, is a question about the skill pack and the preamble
  rather than the orchestrator. It needs a sample, not a single run.
- **More than one runner.** The multiplayer claim has never been tested with
  two machines.

The tag stays `v0` until the input names have settled.

## Known gaps

- **Isolation.** The agent runs with write access to the workspace and inherits
  the runner's `gh` and agent credentials. On a shared laptop that is a real
  blast radius. Use a dedicated runner account now; containers are the answer
  for anyone with a security review.
- **CI on Ralph's PRs.** GitHub does not trigger `pull_request` workflows for
  PRs opened with `GITHUB_TOKEN`. Pass a PAT or App token via `github-token`.
- **Marketplace.** Listing requires `action.yml` at a repo root, so this needs
  to move to its own repo before it can be listed. `owner/repo/path@ref` works
  fine in the meantime.
