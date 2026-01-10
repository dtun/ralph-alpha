import { WorkflowStep } from "../_components/workflow-steps/step-detail-panel";

export const headerContent = {
  title: "Multiplayer AI Coding",
  subtitle:
    "Team-based AI pair programming using self-hosted GitHub Action runners + Claude Code",
};

export const bigIdeaContent = {
  heading: "The Big Idea",
  description:
    "Instead of one person running Claude Code on their machine, the whole team's machines become a pool of AI workers. Anyone can trigger a task, any available machine picks it up, and the result is always a PR for the team to review together.",
};

export const componentsContent = [
  {
    id: "runners",
    title: "Self-Hosted Runners",
    description: "Dev machines registered with GitHub Actions",
  },
  {
    id: "actions",
    title: "GitHub Actions",
    description: "Workflow orchestration and triggers",
  },
  {
    id: "ralph",
    title: "Ralph Script",
    description: "Bash script that runs Claude Code in a loop",
  },
  {
    id: "claude",
    title: "Claude Code",
    description: "CLI tool that does the actual coding",
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    label: "Trigger",
    description: "Someone kicks off an AI task",
    details:
      "Via GitHub Actions UI, CLI command, or Slack bot. The task gets queued as a workflow_dispatch event.",
    code: `gh workflow run ai-pair.yml \\
  -f task="Add input validation"`,
    codeLanguage: "bash",
  },
  {
    label: "Runner Picks Up",
    description: "Next available machine claims the job",
    details:
      "Whichever team member's self-hosted runner is idle picks up the work. Could be anyone's laptop.",
    code: `runs-on: self-hosted
# Any registered runner can claim this`,
    codeLanguage: "yaml",
  },
  {
    label: "Ralph Loop",
    description: "Claude Code iterates on the task",
    details:
      "The ralph.sh script runs Claude Code in a loop: plan → code → test → reflect. Repeats until done or stuck.",
    code: `for i in $(seq 1 $MAX_ITERATIONS); do
  claude code --prompt-file prompt.txt
  npm test
done`,
    codeLanguage: "bash",
  },
  {
    label: "PR Created",
    description: "Changes pushed, PR opened",
    details:
      "All changes committed to a feature branch. GitHub CLI creates a PR automatically with context about the task.",
    code: `gh pr create \\
  --title "AI: $TASK" \\
  --base main`,
    codeLanguage: "bash",
  },
  {
    label: "Team Reviews",
    description: "Humans approve and merge",
    details:
      "The whole team can see the PR, review the AI's work, request changes, or approve. AI can't merge—only humans can.",
  },
];

export const comparisonContent = {
  heading: "Why Multiplayer?",
  before: {
    title: "Single Player (Before)",
    points: [
      "One person runs Claude Code on their machine",
      "Others wait or work on separate tasks",
      "Changes live on one person's branch",
      "Limited parallelism",
    ],
  },
  after: {
    title: "Multiplayer (After)",
    points: [
      "Anyone can trigger AI tasks",
      "Any idle machine picks up work",
      "PRs go to the whole team",
      "Parallel AI sessions across the fleet",
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
