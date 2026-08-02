"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { ComponentCard } from "./component-card";
import { CodeBlock } from "./code-block";
import { UnifiedStep, PlayerData } from "../_data/explainer-content";

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
  const [randomSubPlayerId, setRandomSubPlayerId] = useState<string | null>(
    null,
  );

  const step = steps[activeStep];
  const basePlayerIds = step.playerIds;

  // Collect all sub-player IDs from players
  const allSubPlayers = players.flatMap((p) => p.subPlayers || []);
  const allSubPlayerIds = allSubPlayers.map((sp) => sp.id);

  // Find which sub-players are referenced in the current step
  const activeSubPlayerIds = basePlayerIds.filter((id) =>
    allSubPlayerIds.includes(id),
  );

  // Build the effective activePlayerIds (non-sub-players + randomly selected sub-player)
  const activePlayerIds = [
    ...basePlayerIds.filter((id) => !allSubPlayerIds.includes(id)),
    ...(randomSubPlayerId && activeSubPlayerIds.includes(randomSubPlayerId)
      ? [randomSubPlayerId]
      : []),
  ];

  const hasPrevious = activeStep > 0;
  const hasNext = activeStep < steps.length - 1;

  // Pick a random sub-player when step changes
  useEffect(() => {
    if (activeSubPlayerIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeSubPlayerIds.length);
      setRandomSubPlayerId(activeSubPlayerIds[randomIndex]);
    } else {
      setRandomSubPlayerId(null);
    }
  }, [activeStep]);

  // Auto-advance through steps (with a11y consideration)
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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
        {players.map((player) => {
          // Check if the player itself or any of its sub-players are active
          const subPlayerIds = player.subPlayers?.map((sp) => sp.id) || [];
          const isActive =
            activePlayerIds.includes(player.id) ||
            subPlayerIds.some((id) => activePlayerIds.includes(id));

          // Build sub-players with their active states
          const subPlayersWithState = player.subPlayers?.map((sp) => ({
            ...sp,
            isActive: activePlayerIds.includes(sp.id),
          }));

          return (
            <ComponentCard
              key={player.id}
              icon={iconMap[player.id]}
              title={player.title}
              description={player.description}
              isActive={isActive}
              subPlayers={subPlayersWithState}
            />
          );
        })}
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

          {step.anchor && (
            <div className="mb-4 text-right">
              <Link
                href={`/action#${step.anchor}`}
                // Stop the carousel on intent to click, so the link cannot
                // advance to a different step under the cursor.
                onMouseEnter={() => setIsPlaying(false)}
                onFocus={() => setIsPlaying(false)}
                className="font-mono text-xs text-light-text-muted dark:text-text-muted hover:text-accent-yellow hover:underline transition-colors duration-150"
              >
                How this step works {"-->"}
              </Link>
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
