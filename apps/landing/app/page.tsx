import { Header } from "./_components/header";
import { BigIdeaSection } from "./_components/big-idea-section";
import { PlayerWorkflow } from "./_components/player-workflow";
import { ComparisonSection } from "./_components/comparison-section";
import { FileTree } from "./_components/file-tree";
import { SetupChecklist } from "./_components/setup-checklist";
import { Footer } from "./_components/footer";
import {
  LaptopIcon,
  WorkflowIcon,
  TerminalIcon,
  SparklesIcon,
} from "./_components/icons";
import {
  headerContent,
  bigIdeaContent,
  componentsContent,
  unifiedSteps,
  comparisonContent,
  fileTreeContent,
  setupChecklistContent,
} from "./_data/explainer-content";

const iconMap: Record<string, React.ReactNode> = {
  runners: <LaptopIcon />,
  actions: <WorkflowIcon />,
  ralph: <TerminalIcon />,
  claude: <SparklesIcon />,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Header */}
        <Header title={headerContent.title} subtitle={headerContent.subtitle} />

        {/* The Big Idea */}
        <BigIdeaSection
          heading={bigIdeaContent.heading}
          description={bigIdeaContent.description}
        />

        {/* Why Multiplayer - Context before implementation */}
        <ComparisonSection
          heading={comparisonContent.heading}
          before={comparisonContent.before}
          after={comparisonContent.after}
        />

        {/* The Players - Interactive workflow with player highlighting */}
        <PlayerWorkflow
          players={componentsContent}
          steps={unifiedSteps}
          iconMap={iconMap}
        />

        {/* File Structure */}
        <FileTree heading={fileTreeContent.heading} items={fileTreeContent.items} />

        {/* Setup Checklist */}
        <SetupChecklist
          heading={setupChecklistContent.heading}
          steps={setupChecklistContent.steps}
        />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
