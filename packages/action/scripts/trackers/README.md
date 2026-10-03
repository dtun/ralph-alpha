# Tracker adapters

The seam between Ralph and wherever the issue lives. A tracker adapter is a
sourced shell file that teaches Ralph how to read one issue and talk back on it.
Adding a tracker should not require touching `ralph.sh`.

Only [`github.sh`](./github.sh) exists so far, and `ralph.sh` sources it
unconditionally.

## Contract

```bash
tracker_preflight             # exit non-zero with a fixable message if the CLI
                              # or credentials are missing

tracker_fetch <id> <out_json> # write the issue as {title, body, comments[]}

tracker_comment <id> <body>   # post a markdown comment; quiet on success

tracker_ref <id>              # the id as a human writes it: "#12"

tracker_closes_line <id>      # first line of the PR body: "Closes #12"
```

### `tracker_preflight`

Runs after the agent and session preflights, before the issue is read. As with
agent adapters, the person reading the failure is looking at a CI log, so say
exactly what to install or authenticate.

### `tracker_fetch`

The output shape is the one `gh issue view --json title,body,comments` produces,
because that is what the intake in `ralph.sh` was written against:

```json
{
  "title": "…",
  "body": "…",
  "comments": [{ "body": "…" }]
}
```

`body` may be null. `comments` must be in chronological order, oldest first:
Ralph takes the **last** comment containing an Agent Brief heading as the
specification, because briefs get revised during triage. A tracker whose API
returns comments in another order has to sort them here.

### `tracker_comment`

Bodies are GitHub-flavoured markdown. Send nothing to stdout. Return gh's (or
the API's) exit status unchanged: most call sites run under `set -e` and
should fail with it, and the one that must not fail guards it with `||`.

### `tracker_ref` and `tracker_closes_line`

Used in log lines and the PR body, so a reviewer sees the id in the form their
tracker uses. `tracker_closes_line` should be whatever makes the tracker close
or link the issue when the PR merges.

## Not the tracker's job

Pushing the branch and opening the pull request stay in `ralph.sh`. They belong
to the code host, which is GitHub whichever tracker the issue lives in.
