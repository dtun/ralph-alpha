export const actionHeaderContent = {
  eyebrow: "packages/action",
  title: "The Action",
  subtitle:
    "Register your machines as runners. Label an issue. Get a pull request.",
  description:
    "Ralph is an agent orchestrator with a deliberately small surface. It does not decide how software gets built — a skill pack does that. Ralph owns the trigger, the workspace, the clock, and the reporting back to your tracker. Everything else is pluggable.",
};

export interface PipelineStage {
  id: string;
  label: string;
  detail: string;
  seam?: string;
}

export const pipelineStages: PipelineStage[] = [
  {
    id: "trigger",
    label: "Issue labeled ready-for-agent",
    detail:
      "Ralph defines no label of its own. It reuses the one your triage flow already produces, which also posts an Agent Brief — the structured comment Ralph treats as the contract.",
  },
  {
    id: "claim",
    label: "A runner claims it",
    detail:
      "Any machine registered to the repo. One agent per issue, enforced by a concurrency group keyed on the issue number.",
  },
  {
    id: "pack",
    label: "Install the pinned skill pack",
    detail:
      "Defaults to mattpocock/skills at a pinned tag. Cloned, copied into the workspace, then excluded via .git/info/exclude so it never lands in the agent's diff. Point it at your own pack and the rest of the pipeline is unchanged.",
    seam: "skills-repo · skills-ref",
  },
  {
    id: "agent",
    label: "Agent runs the entry skill",
    detail:
      "The AFK preamble is prepended, then the brief. The pack owns iteration, testing and the definition of done — Ralph only holds the wall clock.",
    seam: "agent · agent-args",
  },
  {
    id: "review",
    label: "Draft PR, back on the thread",
    detail:
      "ASSUMPTIONS.md lands in the PR body. Blocked runs, blown budgets and failed verification all ship as drafts that say why.",
  },
];

export interface OwnershipColumn {
  title: string;
  caption: string;
  points: string[];
  note?: string;
}

export const ownershipContent: {
  ralph: OwnershipColumn;
  pack: OwnershipColumn;
} = {
  ralph: {
    title: "Ralph owns",
    caption: "Mechanism",
    points: [
      "The trigger, and which runner claims it",
      "Checkout, branch, and a clean workspace",
      "The wall clock, and what happens when it runs out",
      "Push, pull request, and status on the issue",
      "Never reporting green when nothing was produced",
    ],
  },
  pack: {
    title: "The skill pack owns",
    caption: "Judgment",
    points: [
      "How the work gets planned and sliced",
      "Where tests go, and what a good one is",
      "How many iterations it takes",
      "When the work is done",
      "What counts as a review worth passing",
    ],
    note: "Ships pointed at mattpocock/skills, pinned. Point skills-repo somewhere else and nothing on the left changes.",
  },
};

export const loopContent = {
  heading: "Why there is no loop in the bash",
  body: "The entry skill already drives TDD at agreed seams, typechecks throughout, runs the full suite at the end, and reviews the diff before committing. That is the iterate-until-green loop. Reimplementing it in a shell script would produce a worse version that drifts from the pack every time it ships. So Ralph sets a budget and gets out of the way.",
};

export interface Gate {
  gate: string;
  source: string;
  replacement: string;
}

export const afkContent = {
  heading: "Running interactive skills unattended",
  intro:
    "This is the interesting problem. The pack's skills assume a human is in the room — one of them refuses to write a test at a seam you have not confirmed. On a runner there is nobody to ask, so a naive run either stalls or quietly invents an answer and never mentions it.",
  outro:
    "ASSUMPTIONS.md then lands in the PR body, so review opens with every judgment call made without you. Ambiguity gets an assumption. A genuine block — a product decision, a missing credential — gets BLOCKED.md and a stop, which Ralph turns into a draft PR carrying the question.",
  gates: [
    {
      gate: "Agree the test seams",
      source: "tdd",
      replacement:
        "Derive them from the brief's acceptance criteria, and record the chosen seams before the first test",
    },
    {
      gate: "Pick a review fixed point",
      source: "code-review",
      replacement: "The base ref, no question asked",
    },
    {
      gate: "Locate the originating spec",
      source: "code-review",
      replacement: "The Agent Brief, reproduced in ASSUMPTIONS.md",
    },
    {
      gate: "Anything else needing confirmation",
      source: "any skill",
      replacement:
        "Make the call, then record it with one line of reasoning — recording is not optional",
    },
  ] satisfies Gate[],
};

export const adapterContract = `AGENT_COMMITS=true|false   # does the agent commit its own work?

agent_preflight()          # exit non-zero with a fixable message if the
                           # CLI is missing or unauthenticated

agent_run <prompt_file>    # run to completion against $PWD, non-interactive
                           # must forward "\${AGENT_ARGS_ARR[@]}"`;

export const pluggableContent = {
  heading: "Defaults in the box, nothing welded shut",
  body: "Ralph ships pointed at a real skill pack and a real agent, so the zero-config path works on day one. Neither is baked in. Both are inputs, and changing either is one line of YAML.",
  defaults: `# what you get without configuring anything
skills-repo: mattpocock/skills
skills-ref:  v1.1.0
agent:       claude`,
  skillsNote:
    "The pack is the bigger lever of the two. It decides how work gets planned, where tests go, and when something is done — so pointing skills-repo at your own pack changes how every agent behaves without changing a line of the orchestrator.",
  agentsHeading: "Agents",
  agentsBody:
    "An adapter is one file implementing a three-part contract. Adding an agent never touches the orchestrator.",
  agents: ["claude", "codex", "opencode", "pi"],
  note: "pi is the one worth calling out. It already reads .agents/skills — the same path this action installs packs into — so a pack drops in with no special-casing at all. It is also multi-provider, which makes it the one adapter where bring-your-own-agent extends to bring-your-own-model.",
};

export interface Trap {
  title: string;
  body: string;
  tell: string;
}

export const trapsContent = {
  heading: "Traps worth knowing about",
  intro:
    "Every one of these was caught by testing rather than reading. They share a shape: the failure exits zero.",
  traps: [
    {
      title: "pi silently runs with no skills",
      tell: "exits 0",
      body: "In non-interactive modes pi never prompts for trust — it falls back to defaultProjectTrust, which defaults to ask, and ask ignores project-local resources. An installed skill pack is a project-local resource. Without --approve you get a plausible pull request built from none of the workflow, and nothing in the log says so. The adapter always passes it.",
    },
    {
      title: "An absent agent brief looked present",
      tell: "1 byte",
      body: "jq writes a trailing newline even for an empty result, so the brief file was never zero-length and the emptiness check always passed. Every unbriefed issue would have claimed a contract it did not have. The check now tests for non-whitespace content.",
    },
    {
      title: "Passthrough flags vanished at the boundary",
      tell: "silently dropped",
      body: "timeout(1) needs a command, so the adapter function is serialized into a subshell — and arrays are not exported. Model and provider flags were being dropped on exactly the path that runs in production. The array is now serialized alongside the function, verified identical on both sides.",
    },
    {
      title: "macOS runners still ship bash 3.2",
      tell: "unbound variable",
      body: "Expanding an empty array under set -u aborts the run on bash 3.2, which is what /bin/bash still is on a current Mac. Every adapter guards the expansion. The same machines have no timeout(1) at all, so the budget falls back to the job-level timeout and says so in the log.",
    },
    {
      title: "CI will not run on Ralph's pull requests",
      tell: "by design",
      body: "GitHub does not trigger pull_request workflows for pull requests opened with the default token, to prevent recursion. Left alone, the agent's work would be the only work arriving unchecked. Pass a PAT or App token to get CI back.",
    },
  ] satisfies Trap[],
};

export interface FileEntry {
  path: string;
  role: string;
}

export const fileMapContent = {
  heading: "What is in the package",
  files: [
    { path: "action.yml", role: "Composite manifest — 12 inputs, 3 outputs" },
    {
      path: "scripts/ralph.sh",
      role: "Intake, branch, prompt, run, assess, ship",
    },
    {
      path: "scripts/install-skills.sh",
      role: "Pinned pack install, kept out of the diff",
    },
    {
      path: "scripts/afk-preamble.md",
      role: "Converts interactive gates into recorded decisions",
    },
    {
      path: "scripts/agents/*.sh",
      role: "One file per agent, three-part contract",
    },
    {
      path: "examples/ralph.yml",
      role: "The workflow you copy into your repo",
    },
  ] satisfies FileEntry[],
};

export const statusContent = {
  heading: "Status",
  body: "Shellcheck clean and dry-run tested: the pack installs to both harness paths, argument plumbing produces identical argv on bash 3.2 and bash 5, and the brief extractor picks the latest revision on a real issue payload.",
  unverified:
    "One assumption has not been proven on a runner — that invoking an entry skill in print mode resolves the skill rather than treating it as literal text. Everything else is plumbing around that. If it does not hold, the fix is inlining the skill body into the prompt and the rest stands.",
};
