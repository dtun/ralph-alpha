import type { Metadata } from "next";
import { ActionHeader } from "../_components/action/action-header";
import { Pipeline } from "../_components/action/pipeline";
import { Ownership } from "../_components/action/ownership";
import { AfkGates } from "../_components/action/afk-gates";
import { Traps } from "../_components/action/traps";
import { FileMap } from "../_components/action/file-map";
import { CodeBlock } from "../_components/code-block";
import { Footer } from "../_components/footer";
import {
  actionHeaderContent,
  pipelineStages,
  ownershipContent,
  loopContent,
  afkContent,
  adapterContract,
  pluggableContent,
  trapsContent,
  fileMapContent,
  statusContent,
} from "../_data/action-content";

export const metadata: Metadata = {
  title: "The Action — Ralph Alpha",
  description:
    "Register your machines as runners. Label an issue. Get a pull request.",
};

export default function ActionPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <ActionHeader
          eyebrow={actionHeaderContent.eyebrow}
          title={actionHeaderContent.title}
          subtitle={actionHeaderContent.subtitle}
          description={actionHeaderContent.description}
        />

        <Pipeline stages={pipelineStages} />

        <Ownership
          ralph={ownershipContent.ralph}
          pack={ownershipContent.pack}
          loopHeading={loopContent.heading}
          loopBody={loopContent.body}
        />

        <AfkGates
          heading={afkContent.heading}
          intro={afkContent.intro}
          outro={afkContent.outro}
          gates={afkContent.gates}
        />

        {/* Defaults, and the two axes that swap */}
        <section className="space-y-5">
          <h2 className="font-mono text-xl md:text-2xl font-bold text-accent-yellow">
            {pluggableContent.heading}
          </h2>
          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
            {pluggableContent.body}
          </p>

          <CodeBlock code={pluggableContent.defaults} filename="ralph.yml" />

          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
            {pluggableContent.skillsNote}
          </p>

          <h3 className="font-mono text-base font-bold text-light-text dark:text-text-primary pt-2">
            {pluggableContent.agentsHeading}
          </h3>
          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
            {pluggableContent.agentsBody}
          </p>

          <ul className="flex flex-wrap gap-2">
            {pluggableContent.agents.map((agent) => (
              <li
                key={agent}
                className="font-mono text-sm text-light-text dark:text-text-primary border border-light-border dark:border-dark-border rounded px-3 py-1"
              >
                {agent}
              </li>
            ))}
          </ul>

          <CodeBlock code={adapterContract} filename="adapter contract" />

          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
            {pluggableContent.note}
          </p>
        </section>

        <Traps
          heading={trapsContent.heading}
          intro={trapsContent.intro}
          traps={trapsContent.traps}
        />

        <FileMap
          heading={fileMapContent.heading}
          files={fileMapContent.files}
        />

        {/* Status */}
        <section className="rounded-md border border-light-border dark:border-dark-border bg-light-bg-subtle dark:bg-dark-bg-subtle p-6 md:p-8 space-y-4">
          <h2 className="font-mono text-base md:text-lg font-bold text-light-text dark:text-text-primary">
            {statusContent.heading}
          </h2>
          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed">
            {statusContent.body}
          </p>
          <p className="text-sm md:text-base text-light-text-muted dark:text-text-muted leading-relaxed border-l-2 border-accent-pink pl-4">
            {statusContent.unverified}
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
