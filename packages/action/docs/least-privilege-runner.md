# A least-privilege runner

Follow this once per machine. What comes out is a runner that can push to one
repository and demonstrably cannot reach another — not a sandbox, and the
difference matters enough that half this page is about what is still exposed.

The steps are macOS, because that is what has been run. The
[non-macOS section](#when-the-runner-is-not-a-mac) lists what has to be
re-checked elsewhere.

## Why the agent runs with this much permission

Ralph invokes Claude with `--permission-mode bypassPermissions`. That looks
careless until you try the milder setting.

`acceptEdits` auto-accepts file edits but still gates shell commands, and in
print mode there is nobody to approve one. The agent can therefore write code
and cannot run it: `/tdd` cannot do red-green without executing anything,
`/implement` cannot commit, and `/code-review` has no diff to review. The work
still lands — unexecuted and unreviewed — which is worse than failing. That is
an observed failure, not a hypothesis.

So the permission stays until it can be replaced by an explicit `--allowedTools`
allowlist. The cost is that the agent inherits everything the runner process can
reach, and the correct response to that is to make the runner process reach very
little.

## What you are defending against

The issue body reaches the agent's prompt by design. Ralph never interpolates
it — issue text is only ever concatenated, so it cannot inject shell — but
concatenation is exactly how a prompt injection gets in. Anyone who can file an
issue on your repository can write text that the agent reads as instruction, and
on a triaged repository that is anyone with read access.

The question is what that text can reach. On a typical operator's laptop:

| Credential                | Where it lives                                  | Reaches, unscoped                          |
| ------------------------- | ----------------------------------------------- | ------------------------------------------ |
| `gh` login on the runner  | login keychain, `gh:github.com`                  | every repository the operator can          |
| agent session             | login keychain, `Claude Code-credentials`        | the operator's personal subscription       |
| `github-token` input      | the step environment, visible to the agent       | whatever that token was scoped to          |
| the home directory        | `~/.ssh`, `~/.aws`, `~/.config`, browser state   | everything else                            |

The last row is the one people forget. The agent has a shell.

## The runbook

### 1. A standard account, not an administrator

```bash
sudo sysadminctl -addUser ralph -fullName "Ralph Runner" -password -
```

No `-admin`. An administrator can `sudo`, and a runner that can `sudo` has
undone the whole exercise. Check it did not end up there anyway:

```bash
dscl . -read /Groups/admin GroupMembership   # ralph must not appear
```

### 2. Close the operator's home directory

macOS creates home directories group-readable — `drwxr-x---`, group `staff` —
and every local account is in `staff`. So `ralph` can traverse your home and
read anything group-readable in it, which by default includes `~/.gitconfig`,
`~/.zshrc`, `~/.config/`, and `~/.claude/`. Check yours and close it:

```bash
ls -ld /Users/*                    # look for the group bit
sudo chmod 700 /Users/<operator>
```

`~/.ssh`, `~/Library`, `~/Documents` and the other TCC-protected folders are
already `700`. `~/Public` file sharing stops working after this; nothing else
should notice.

### 3. Register the runner as that account

Log in as `ralph` — a GUI login, for reasons that arrive in a moment — then
follow **Settings → Actions → Runners → New self-hosted runner** on the
repository. Registering needs repository admin, and the registration token the
page hands you is valid for one hour. The credentials `config.sh` then writes
into the runner directory are issued by GitHub for that repository only, so
this runner cannot be handed jobs from anywhere else.

`./svc.sh install` writes a **LaunchAgent** to
`~/Library/LaunchAgents/actions.runner.*.plist` and loads it with
`launchctl load -w`. A LaunchAgent runs in a login session, which has two
consequences worth knowing before you find them out at 2am:

- The account must be logged in for the runner to be online. After a reboot it
  is not, unless you enable automatic login
  (`sysadminctl -autologin set -userName ralph`) — which stores the password on
  disk and is unavailable with FileVault on — or leave the account logged in via
  fast user switching.
- Keychain-backed credentials are only readable inside an unlocked login
  session. Start the runner over SSH with no session and `gh` and `claude`
  authentication degrade rather than fail cleanly. If you want a genuinely
  headless runner, prefer environment credentials (`ANTHROPIC_API_KEY`, and the
  workflow's own token) over interactive logins.

### 4. Install the tools inside that account

Homebrew's prefix belongs to the admin who installed it, so install shared tools
once as the operator and put them on `ralph`'s path rather than trying to
`brew install` as a standard user:

```bash
# as ralph
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
npm config set prefix ~/.npm-global               # global installs need a writable prefix
npm i -g @anthropic-ai/claude-code
claude auth login                                 # this account's own session
```

`ralph.sh` hard-fails without `gh` and `jq`, and warns without `coreutils`, so
confirm all three resolve in this account before you rely on it.

The agent session created here is `ralph`'s, stored in `ralph`'s login keychain,
and encrypted under `ralph`'s password. Your own stays where it is. Use a
separate subscription or API key if you would rather the agent could not spend
yours.

### 5. Scope the GitHub credentials

Two different tokens reach the agent, and only one of them is a problem.

**The workflow token.** `github-token` defaults to `github.token`, which is an
installation token scoped to the repository containing the workflow and expiring
when the job finishes. That is already least privilege. Leave it.

**The token you pass to get CI.** GitHub does not trigger `pull_request`
workflows for PRs opened with `GITHUB_TOKEN`, so the README suggests passing a
PAT. Note what that means: the token is set in the step environment and the
agent inherits it. A classic PAT with `repo` covers every repository you can
reach, which recreates the blast radius you just spent four steps removing.

Best is a **GitHub App installation token** — mint it in the workflow with
[`actions/create-github-app-token`](https://github.com/actions/create-github-app-token),
which defaults to the current repository, accepts an explicit `repositories`
list, expires after an hour and is revoked when the job ends.

Failing that, a **fine-grained PAT** with **Only select repositories** set to
this one. A fine-grained token is limited to a single owner and, within that
owner, to the repositories you list. It needs:

| Permission    | Level          | Used for                                     |
| ------------- | -------------- | -------------------------------------------- |
| Contents      | Read and write | checkout, and pushing the `ralph/*` branch   |
| Pull requests | Read and write | `gh pr create`                               |
| Issues        | Read and write | the claim comment and the outcome comment    |
| Metadata      | Read           | mandatory, granted implicitly                |

Set the shortest expiry you will tolerate re-issuing; the ceiling is 366 days
and organisations can cap it lower or require approval. Add `Administration:
Read and write` only if you intend to mint runner registration tokens through
the API rather than the settings page — and drop it again afterwards.

The same rule applies to any `gh auth login` you did in step 4. Whatever token
is sitting in `ralph`'s keychain is reachable by the agent, so it must be the
scoped one too.

## Proving it

The runbook is worth nothing unless the result is checked. As `ralph`:

```bash
gh api repos/<owner>/<repo> --jq .full_name             # the served repo: works
gh api repos/<owner>/<other> --jq .full_name            # anything else: fails
git ls-remote https://github.com/<owner>/<other-private>  # fails
ls /Users/<operator>/                                   # Permission denied
security find-generic-password -s "Claude Code-credentials"  # ralph's own item, or none
```

Expect the out-of-scope API call to come back **404 rather than 403** — the API
does not distinguish "not yours" from "not there". Then run one real Ralph job
end to end and confirm the branch pushes and the PR opens, because a token
scoped one permission too tightly fails in the middle of a run rather than at
setup.

## What this does not protect against

Say this part out loud, because a runbook that oversells its protection is worse
than none.

- **It is a permission boundary, not a sandbox.** Same kernel, same hardware,
  same everything. A standard account is one local privilege-escalation bug away
  from root, and those get found.
- **The network is untouched.** The runner sits on your LAN, behind your VPN,
  inside whatever your Mac can route to — router, NAS, staging, printers.
  Nothing above changes that by one hop.
- **Exfiltration is unaddressed.** The agent has a shell and outbound network.
  Scoping limits what it can read; it does nothing about what it can send.
- **It still holds a valid token for the repository it serves.** That is the
  job. A prompt-injected run can push a branch and open a pull request full of
  whatever it was told to write. The control there is review — keep the PR a
  draft, and protect the base branch so nothing merges unattended.
- **The runner is not ephemeral.** GitHub's own guidance is that self-hosted
  runners "can be persistently compromised by untrusted code in a workflow".
  `ralph`'s home survives between jobs, and agents read skills from `$HOME` —
  the unpinned third layer the README already warns about. One poisoned run can
  plant a skill there that shapes every later run on that machine, with nothing
  in any diff to show for it. Treat a suspect run as a reason to rebuild the
  account, not to rerun the job.
- **Any workflow in the repository can target this runner.** Repository write
  access is code execution on this machine as `ralph`. On a public repository
  it is worse still — GitHub says self-hosted runners should "almost never" be
  used there, because a fork's pull request can run on your hardware.

## Containers, and why they are awkward here

A fresh container per job is the stronger answer, and for the right reasons: the
filesystem is discarded at the end, no ambient credential exists to inherit, and
the network is something you can actually restrict rather than merely describe.

On a Mac it is awkward.

macOS cannot be containerised. It can only be virtualised, and Apple's licence
allows at most two virtualised macOS instances per machine — a limit the
Virtualization framework enforces, not merely states. Per-job macOS isolation
does not scale past two, and full macOS VMs are heavy.

Everything that does work — Docker Desktop, Colima, and Apple's own
[`container`](https://github.com/apple/container) (1.0, June 2026, Apple silicon
only) — runs **Linux** guests. If your repository builds Linux artefacts, that is
the right answer today and this page is a stopgap. If it needs Xcode, a
simulator or codesigning, none of that exists inside the container and you are
back to a whole machine.

The practical ladder on macOS: dedicated account, then Linux container for Linux
work, then a dedicated physical Mac for Mac work.

## When the runner is not a Mac

None of the mechanics above transfer unchecked. Re-verify at least:

- **Account and privilege model.** `useradd` semantics, default home mode, and
  whether the account lands in a sudoers group. The claim to re-establish is the
  same one: the runner account cannot escalate and cannot read the operator's
  files.
- **Service model.** The Linux runner installs a **systemd** unit, not a
  LaunchAgent, so the login-session and keychain caveats in step 3 disappear —
  and systemd gives you hardening the Mac cannot: `ProtectHome`, `PrivateTmp`,
  `NoNewPrivileges`, address-family restrictions. Windows installs a service
  under yet another account model.
- **Credential storage.** There is no login keychain. `gh` uses the Secret
  Service when one is running and **falls back to plaintext**
  `~/.config/gh/hosts.yml` when it is not; the agent's session lands in a file
  under `$HOME` rather than an encrypted store. "Encrypted at rest under the
  other account's password" is a macOS claim only — elsewhere, file permissions
  are the whole of it.
- **Whether this page is still the right trade.** On Linux the container route
  is neither exotic nor lossy, so the honest advice there is to skip the
  dedicated account and run the job in a container.
