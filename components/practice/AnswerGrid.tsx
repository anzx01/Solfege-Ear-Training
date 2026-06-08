import { SOLFEGE, SOLFEGE_LABELS, type Exercise, type Solfege } from "@/lib/music";
import type { Feedback } from "@/components/practice/types";

type AnswerGridProps = {
  exercise: Exercise | null;
  feedback: Feedback;
  hasResolvedQuestion: boolean;
  isPlaying: boolean;
  onAnswer: (syllable: Solfege) => void;
};

export function AnswerGrid({
  exercise,
  feedback,
  hasResolvedQuestion,
  isPlaying,
  onAnswer
}: AnswerGridProps) {
  return (
    <div className="answer-grid" aria-label="Solfege answer choices">
      {SOLFEGE.map((syllable) => {
        const isTarget = exercise?.target.syllable === syllable;
        const isChosen = feedback.chosen === syllable;
        const stateClass =
          hasResolvedQuestion && isTarget
            ? "is-target"
            : feedback.state === "incorrect" && isChosen
              ? "is-wrong"
              : "";

        return (
          <button
            key={syllable}
            type="button"
            className={`answer-button ${stateClass}`}
            onClick={() => onAnswer(syllable)}
            disabled={Boolean(exercise) && (isPlaying || hasResolvedQuestion)}
            aria-label={`Answer ${SOLFEGE_LABELS[syllable]}`}
          >
            <span>{SOLFEGE_LABELS[syllable]}</span>
          </button>
        );
      })}
    </div>
  );
}
