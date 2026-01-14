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
    id: "ralph",
    title: "Ralph Script",
    description: "Keeps the AI in the loop.",
  },
  {
    id: "agents",
    title: "Coding Agents",
    description: "Does the actual coding.",
    subPlayers: [
      { id: "claude", label: "Claude Code" },
      { id: "opencode", label: "OpenCode" },
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
}

export const unifiedSteps: UnifiedStep[] = [
  {
    label: "Trigger",
    description: "Someone kicks off an AI task",
    details:
      "Via GitHub Actions UI, CLI command, or Slack bot. The task gets queued as a workflow_dispatch event.",
    code: `gh workflow run ai-pair.yml \\
  -f task="Add input validation"`,
    codeLanguage: "bash",
    playerIds: ["actions"],
  },
  {
    label: "Runner Claims",
    description: "Next available machine picks up the job",
    details:
      "Whichever team member's self-hosted runner is idle picks up the work. Could be anyone's laptop.",
    code: `runs-on: self-hosted
# Any registered runner can claim this`,
    codeLanguage: "yaml",
    playerIds: ["runners"],
  },
  {
    label: "AI Codes",
    description: "Your coding agent iterates through the task",
    details:
      "The ralph.sh script runs your coding agent in a loop: plan → code → test → reflect. Repeats until done or stuck.",
    code: `for i in $(seq 1 $MAX_ITERATIONS); do
  $CODING_AGENT --prompt-file prompt.txt
  npm test
done`,
    codeLanguage: "bash",
    playerIds: ["ralph", "claude", "opencode"],
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
