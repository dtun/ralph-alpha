"use client";

import { useState, useEffect, ReactNode } from "react";
import { ComponentCard } from "./component-card";
import { CodeBlock } from "./code-block";
import { UnifiedStep } from "../_data/explainer-content";

interface PlayerData {
  id: string;
  title: string;
  description: string;
}

interface PlayerWorkflowProps {
  players: PlayerData[];
  steps: UnifiedStep[];
  iconMap: Record<string, ReactNode>;
}

function StepIndicator({
  stepNumber,
  label,
  isActive,
  onClick,
}: {
  stepNumber: number;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 group cursor-pointer
        transition-all duration-150
      `}
    >
      <div
        className={`
          w-10 h-10 rounded-md flex items-center justify-center
          font-mono font-semibold text-sm transition-all duration-150 border
          ${
            isActive
              ? "bg-accent-yellow/10 text-accent-yellow border-accent-yellow scale-105"
              : "bg-light-bg-subtle dark:bg-dark-bg-subtle text-light-text-muted dark:text-text-muted border-light-border dark:border-dark-border group-hover:border-accent-yellow group-hover:text-accent-yellow"
          }
        `}
      >
        {stepNumber}
      </div>
      <span
        className={`
          font-mono text-xs font-medium transition-colors duration-150
          ${
            isActive
              ? "text-accent-yellow"
              : "text-light-text-muted dark:text-text-muted group-hover:text-light-text dark:group-hover:text-text-primary"
          }
        `}
      >
        {label}
      </span>
    </button>
  );
}

function TerminalDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>
  );
}

export function PlayerWorkflow({
  players,
  steps,
  iconMap,
}: PlayerWorkflowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const step = steps[activeStep];
  const activePlayerIds = step.playerIds;

  const hasPrevious = activeStep > 0;
  const hasNext = activeStep < steps.length - 1;

  // Auto-advance through steps (with a11y consideration)
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length); // Loop back to 0
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Handle manual step click - pause auto-play
  const handleStepClick = (index: number) => {
    setIsPlaying(false); // User took control
    setActiveStep(index);
  };

  return (
    <section>
      <h2 className="font-mono text-xl md:text-2xl font-semibold text-light-text dark:text-text-primary mb-8 text-center">
        The Players
      </h2>

      {/* Player cards - 4 across, highlight based on active step */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {players.map((player) => (
          <ComponentCard
            key={player.id}
            icon={iconMap[player.id]}
            title={player.title}
            description={player.description}
            isActive={activePlayerIds.includes(player.id)}
          />
        ))}
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
        {steps.map((s, index) => (
          <StepIndicator
            key={index}
            stepNumber={index + 1}
            label={s.label}
            isActive={index === activeStep}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </div>

      {/* Step detail panel */}
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <TerminalDots />
          <span className="font-mono text-xs text-light-text-muted dark:text-text-muted ml-2">
            step-{activeStep + 1}.md
          </span>

          {/* Pause/Play button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-auto font-mono text-xs text-text-muted hover:text-accent-yellow transition-colors duration-150"
            aria-label={isPlaying ? "Pause auto-play" : "Resume auto-play"}
            title={isPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isPlaying ? "||" : "▶"}
          </button>
        </div>

        <div className="terminal-content">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm text-accent-yellow">
              [{activeStep + 1}]
            </span>
            <h3 className="font-mono text-lg font-semibold text-light-text dark:text-text-primary">
              {step.label}
            </h3>
          </div>

          <p className="text-base text-light-text dark:text-text-primary mb-3">
            {step.description}
          </p>
          <p className="text-sm text-light-text-muted dark:text-text-muted mb-6">
            {step.details}
          </p>

          {step.code && (
            <div className="mb-6">
              <CodeBlock code={step.code} language={step.codeLanguage} bare />
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-light-border dark:border-dark-border">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={!hasPrevious}
              className={`
                font-mono text-sm px-4 py-2 rounded border transition-colors duration-150
                ${
                  hasPrevious
                    ? "border-light-border dark:border-dark-border text-light-text dark:text-text-primary hover:border-accent-yellow hover:text-accent-yellow"
                    : "opacity-40 cursor-not-allowed border-light-border dark:border-dark-border text-light-text-muted dark:text-text-muted"
                }
              `}
            >
              {"<--"} Previous
            </button>
            <button
              onClick={() =>
                setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
              }
              disabled={!hasNext}
              className={`
                font-mono text-sm px-4 py-2 rounded border transition-colors duration-150
                ${
                  hasNext
                    ? "border-accent-yellow bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow/20"
                    : "opacity-40 cursor-not-allowed border-light-border dark:border-dark-border text-light-text-muted dark:text-text-muted"
                }
              `}
            >
              Next {"-->"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
