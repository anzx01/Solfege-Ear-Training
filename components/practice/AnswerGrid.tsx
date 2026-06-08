import { SOLFEGE_LABELS, type Exercise, type Solfege } from "@/lib/music";
import type { Feedback } from "@/components/practice/types";

type AnswerGridProps = {
  options: Solfege[];
  exercise: Exercise | null;
  feedback: Feedback;
  hasResolvedQuestion: boolean;
  isPlaying: boolean;
  onAnswer: (syllable: Solfege) => void;
};

export function AnswerGrid({
  options,
  exercise,
  feedback,
  hasResolvedQuestion,
  isPlaying,
  onAnswer
}: AnswerGridProps) {
  const showWrong = feedback.state === "incorrect" || feedback.state === "retry";

  return (
    <div className="answer-grid" aria-label="Solfege answer choices">
      {options.map((syllable) => {
        const isTarget = exercise?.target.syllable === syllable;
        const isChosen = feedback.chosen === syllable;
        const stateClass =
          hasResolvedQuestion && isTarget
            ? "is-target"
            : showWrong && isChosen
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
