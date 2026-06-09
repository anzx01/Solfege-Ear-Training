import { Check, X } from "lucide-react";
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
        // marker 让答对/答错不只靠颜色区分（无障碍：屏幕阅读器与色盲用户）。
        const marker =
          hasResolvedQuestion && isTarget
            ? "correct"
            : showWrong && isChosen
              ? "wrong"
              : null;
        const stateClass =
          marker === "correct" ? "is-target" : marker === "wrong" ? "is-wrong" : "";
        const statusLabel =
          marker === "correct"
            ? ", correct answer"
            : marker === "wrong"
              ? ", incorrect choice"
              : "";

        return (
          <button
            key={syllable}
            type="button"
            className={`answer-button ${stateClass}`}
            onClick={() => onAnswer(syllable)}
            disabled={Boolean(exercise) && (isPlaying || hasResolvedQuestion)}
            aria-label={`Answer ${SOLFEGE_LABELS[syllable]}${statusLabel}`}
          >
            <span>{SOLFEGE_LABELS[syllable]}</span>
            {marker === "correct" ? (
              <Check size={16} aria-hidden="true" />
            ) : marker === "wrong" ? (
              <X size={16} aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
