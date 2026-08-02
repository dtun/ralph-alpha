# AFK run

You are running unattended on a CI runner. No human will read your questions or
answer them. Nothing you print to the terminal will be seen. The only artifacts
that survive are **commits**, **`ASSUMPTIONS.md`**, and **`BLOCKED.md`**.

The skills you are about to use were written for an interactive session, so
several of them will tell you to confirm something with the user. That
instruction cannot be followed here. The rules below replace it.

## The contract

The **Agent Brief** below is the authoritative specification. The issue body and
its discussion are context; the brief is the contract. Its **acceptance
criteria** are your definition of done, and its **out of scope** list is a hard
boundary — do not cross it, even if the change looks obviously beneficial.

## Replacing the interactive gates

- **Agreeing test seams** (`/tdd` requires pre-agreed seams): derive them from
  the acceptance criteria. Each criterion is an observable behaviour, so the
  public interface it is observed through is the seam. Write the seams you chose
  into `ASSUMPTIONS.md` before you write the first test.
- **Choosing a review fixed point** (`/code-review` asks for one): use
  `{{BASE_REF}}`. Do not ask.
- **Locating the spec** (`/code-review` looks for the originating spec): it is
  the Agent Brief below, reproduced in `ASSUMPTIONS.md`.
- **Any other "confirm with the user" step**: make the call a competent engineer
  on this codebase would make, then record it in `ASSUMPTIONS.md` with one line
  of reasoning. Recording it is not optional — an unrecorded assumption is
  indistinguishable from a bug to the human reviewing this.

## `ASSUMPTIONS.md`

Create it at the repo root. It is read by the human reviewing your PR and is
deleted before merge. Structure:

```markdown
# Assumptions — Issue #{{ISSUE_NUMBER}}

## Test seams

- `InterfaceName` — chosen because acceptance criterion N is observed through it

## Decisions made without confirmation

- Decision — one line of reasoning

## Things the reviewer should look at first

- Anything you are less than confident about
```

## When to stop

Blocked means you cannot proceed without information that does not exist in the
repo, the brief, or the issue thread — a product decision, a credential, an
external system. It does not mean the work is hard or ambiguous; ambiguity is
what `ASSUMPTIONS.md` is for.

If you are genuinely blocked: commit whatever partial work is coherent, write
`BLOCKED.md` at the repo root stating the single specific question that would
unblock you and what you tried, and stop. A clear block is a good outcome. A
guess at a product decision is not.

## Ground rules

- Commit your work to the current branch as you go, using conventional commits
  with `(#{{ISSUE_NUMBER}})` at the end of each subject line.
- Do not modify anything under `.claude/skills/` or `.agents/skills/` — that is
  the pinned skill pack, not source code.
- Do not push, open a pull request, or alter git remotes. Ralph does that.
- Do not modify CI workflows unless the brief explicitly asks for it.
