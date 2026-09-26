export const headerContent = {
  brand: "Ralph Alpha",
  title: "Multiplayer AI Coding",
  subtitle: "Your team's laptops. One AI-powered fleet.",
};

export const bigIdeaContent = {
  heading: "Code together. Apart.",
  description:
    "Ralph Alpha lets anyone trigger a task. Any idle machine picks it up. Every change becomes a PR the whole team reviews. It's pair programming—multiplied.",
};

export interface SubPlayer {
  id: string;
  label: string;
}

export interface PlayerData {
  id: string;
  title: string;
  description: string;
  subPlayers?: SubPlayer[];
}

export const componentsContent: PlayerData[] = [
  {
    id: "runners",
    title: "Self-Hosted Runners",
    description: "Your laptops, ready to work.",
  },
  {
    id: "actions",
    title: "GitHub Actions",
    description: "Orchestrates the magic.",
  },
  {
    id: "skills",
    title: "Skill Pack",
    description: "A default playbook. Or yours.",
  },
  {
    id: "agents",
    title: "Coding Agents",
    description: "Does the actual coding.",
    subPlayers: [
      { id: "claude", label: "Claude Code" },
      { id: "codex", label: "Codex" },
      { id: "opencode", label: "OpenCode" },
      { id: "pi", label: "Pi" },
    ],
  },
];

// Unified workflow steps with player associations
export interface UnifiedStep {
  label: string;
  description: string;
  details: string;
  code?: string;
  codeLanguage?: string;
  playerIds: string[]; // Which players are active for this step
  anchor?: string; // Matching stage on /action, for the deep link
}

export const unifiedSteps: UnifiedStep[] = [
  {
    label: "Trigger",
    description: "Someone kicks off an AI task",
    details:
      "Label an issue and the workflow fires. Triage decides when something is ready — Ralph only picks up what a human already marked.",
    code: `gh issue edit 42 \\
  --add-label ready-for-agent`,
    codeLanguage: "bash",
    playerIds: ["actions"],
    anchor: "trigger",
  },
  {
    label: "Runner Claims",
    description: "Next available machine picks up the job",
    details:
      "Whichever team member's self-hosted runner is idle picks up the work. Could be anyone's laptop, and the agent runs as that person: their agent login, their skills, their harness.",
    code: `runs-on: self-hosted
# Any registered runner can claim this`,
    codeLanguage: "yaml",
    playerIds: ["runners"],
    anchor: "claim",
  },
  {
    label: "AI Codes",
    description: "Your coding agent iterates through the task",
    details:
      "Ralph installs a pinned skill pack and hands the agent the brief. The pack owns the workflow: test, iterate, review. A real pack ships as the default — swap it, or the agent, without touching Ralph.",
    code: `skills-repo: mattpocock/skills   # the default
agent: claude                    # or codex, opencode, pi`,
    codeLanguage: "yaml",
    playerIds: ["skills", "claude", "codex", "opencode", "pi"],
    anchor: "pack",
  },
  {
    label: "PR & Review",
    description: "Changes pushed, team reviews",
    details:
      "All changes committed to a feature branch. GitHub CLI creates a PR automatically with context about the task. The whole team can review the AI's work, request changes, or approve.",
    code: `gh pr create \\
  --title "AI: $TASK" \\
  --base main`,
    codeLanguage: "bash",
    playerIds: ["actions"],
    anchor: "review",
  },
];

export const comparisonContent = {
  heading: "Why go multiplayer?",
  before: {
    title: "Solo Mode",
    points: [
      "One machine. One AI session.",
      "Everyone else waits.",
      "Changes stuck on one branch.",
    ],
  },
  after: {
    title: "Multiplayer Mode",
    points: [
      "Any machine. Any time.",
      "Parallel AI sessions.",
      "PRs for the whole team.",
    ],
  },
};

export const fileTreeContent = {
  heading: "What You Need",
  items: [
    {
      name: ".github/",
      type: "folder" as const,
      children: [
        {
          name: "workflows/",
          type: "folder" as const,
          children: [
            {
              name: "ai-pair.yml",
              type: "file" as const,
              comment: "GitHub Actions workflow",
            },
          ],
        },
      ],
    },
    {
      name: "scripts/",
      type: "folder" as const,
      children: [
        {
          name: "ralph.sh",
          type: "file" as const,
          comment: "Runs Claude Code in a loop",
        },
      ],
    },
    {
      name: "README.md",
      type: "file" as const,
    },
  ],
};

export const setupChecklistContent = {
  heading: "Setup Checklist",
  steps: [
    {
      title: "Install Claude Code CLI on each dev machine",
      command: "brew install claude-code",
    },
    {
      title: "Authenticate Claude Code",
      command: "claude auth login",
    },
    {
      title: "Register machines as GitHub self-hosted runners",
      command: "./config.sh --url https://github.com/org/repo",
    },
    {
      title: "Add ai-pair.yml workflow to your repo",
      description: "Copy the workflow file to .github/workflows/",
    },
    {
      title: "Add ralph.sh script to your repo",
      description: "Copy the script to scripts/",
    },
    {
      title: "Start runners on participating machines",
      command: "./run.sh",
    },
  ],
};

// Where this is heading: the run becomes a session you can join.
// Keep each status honest. The evidence lives on dtun/ralph-alpha#12.
export type RoadmapStatus = "v0" | "spike" | "building" | "next";

export const roadmapStatusLabels: Record<RoadmapStatus, string> = {
  v0: "v0 · runs today",
  spike: "proven in a spike",
  building: "in progress",
  next: "next",
};

export interface RunsAsYouItem {
  label: string;
  detail: string;
}

export interface SessionStep {
  label: string;
  detail: string;
  status: RoadmapStatus;
}

export const joinableSessionContent = {
  eyebrow: "Where this is heading",
  heading: "Your agentic env, deployed.",
  intro:
    "Write the context. File the issue. An agent picks it up on your machine and does the work as you. Not a cloud bot in a blank sandbox: your own setup, running in a live session you can join by pasting one command into a terminal.",
  runsAsYou: [
    {
      label: "Your machine",
      detail:
        "A self-hosted runner on your own laptop. Your compute, your checkout.",
    },
    {
      label: "Your Claude",
      detail:
        "Interactive claude on your account, with your ~/.claude settings.",
    },
    {
      label: "Your skills & harness",
      detail: "The same skills and hooks you use at the keyboard.",
    },
  ] satisfies RunsAsYouItem[],
  steps: [
    {
      label: "An issue is filed",
      detail: "Write the context and label it ready-for-agent.",
      status: "v0",
    },
    {
      label: "Your machine picks it up",
      detail: "A self-hosted runner claims the job and checks out a branch.",
      status: "v0",
    },
    {
      label: "Your agent runs in a live session",
      detail:
        "The job starts a headless herdr session, launches interactive claude as you, and sends the brief. herdr reads the screen, so it knows whether the agent is idle, working, blocked or done.",
      status: "spike",
    },
    {
      label: "The session outlives the job",
      detail:
        "The job goes green and the session stays up. Attach, read what the agent did, type to it, and it answers.",
      status: "spike",
    },
    {
      label: "The join command lands on the issue",
      detail:
        "An opt-in session: herdr input. When the agent settles, Ralph pushes and opens the draft PR as it does today, leaves the session up, and posts the attach command.",
      status: "building",
    },
    {
      label: "Join from anywhere",
      detail:
        "Attach over SSH from another machine. Relax the AFK rules when a person is there to answer the agent's questions.",
      status: "next",
    },
  ] satisfies SessionStep[],
  comment: {
    titlebar: "issue #42 · comment",
    author: "github-actions",
    status: "session live on your-mac · claude · idle",
    pr: "draft PR opened · #43",
    localLabel: "join on this machine",
    localCommand: "herdr session attach ralph-42",
    remoteLabel: "join from anywhere · next, not working yet",
    remoteCommand: "herdr --remote you@your-mac --session ralph-42",
  },
  whyHerdr:
    "Why herdr and not zellij: on a runner nobody is attached, and herdr can still read the agent's screen and tell when it has finished. zellij can't do that headless.",
};
