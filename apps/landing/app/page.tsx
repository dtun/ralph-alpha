import { Header } from "./_components/header";
import { BigIdeaSection } from "./_components/big-idea-section";
import { ComponentCard } from "./_components/component-card";
import { ComponentGrid } from "./_components/component-grid";
import { WorkflowSteps } from "./_components/workflow-steps";
import { ComparisonSection } from "./_components/comparison-section";
import { FileTree } from "./_components/file-tree";
import { SetupChecklist } from "./_components/setup-checklist";
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
  workflowSteps,
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Header */}
        <Header title={headerContent.title} subtitle={headerContent.subtitle} />

        {/* The Big Idea */}
        <BigIdeaSection
          heading={bigIdeaContent.heading}
          description={bigIdeaContent.description}
        />

        {/* Components Grid */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            The Players
          </h2>
          <ComponentGrid>
            {componentsContent.map((component) => (
              <ComponentCard
                key={component.id}
                icon={iconMap[component.id]}
                title={component.title}
                description={component.description}
              />
            ))}
          </ComponentGrid>
        </section>

        {/* Interactive Workflow */}
        <WorkflowSteps steps={workflowSteps} />

        {/* Why Multiplayer */}
        <ComparisonSection
          heading={comparisonContent.heading}
          before={comparisonContent.before}
          after={comparisonContent.after}
        />

        {/* File Structure */}
        <FileTree heading={fileTreeContent.heading} items={fileTreeContent.items} />

        {/* Setup Checklist */}
        <SetupChecklist
          heading={setupChecklistContent.heading}
          steps={setupChecklistContent.steps}
        />
      </div>
    </main>
  );
}
