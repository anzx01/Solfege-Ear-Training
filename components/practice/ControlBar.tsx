import { Eye, Play, RotateCcw, SkipForward, SlidersHorizontal, Volume2 } from "lucide-react";
import type { Exercise } from "@/lib/music";

type ControlBarProps = {
  exercise: Exercise | null;
  isPlaying: boolean;
  hasResolvedQuestion: boolean;
  onStart: () => void;
  onReplayKey: () => void;
  onReplayNote: () => void;
  onShowAnswer: () => void;
  onNext: () => void;
  onOpenSettings: () => void;
};

export function ControlBar({
  exercise,
  isPlaying,
  hasResolvedQuestion,
  onStart,
  onReplayKey,
  onReplayNote,
  onShowAnswer,
  onNext,
  onOpenSettings
}: ControlBarProps) {
  return (
    <div className="tool-actions" aria-label="Practice controls">
      <button className="button primary" type="button" onClick={onStart} disabled={isPlaying}>
        <Play size={18} aria-hidden="true" />
        Start Practice
      </button>
      <button className="button" type="button" onClick={onReplayKey} disabled={!exercise || isPlaying}>
        <RotateCcw size={18} aria-hidden="true" />
        Replay Key
      </button>
      <button className="button" type="button" onClick={onReplayNote} disabled={!exercise || isPlaying}>
        <Volume2 size={18} aria-hidden="true" />
        Replay Note
      </button>
      <button
        className="button"
        type="button"
        onClick={onShowAnswer}
        disabled={!exercise || isPlaying || hasResolvedQuestion}
      >
        <Eye size={18} aria-hidden="true" />
        Show Answer
      </button>
      <button
        className="button"
        type="button"
        onClick={onNext}
        disabled={!exercise || isPlaying || !hasResolvedQuestion}
      >
        <SkipForward size={18} aria-hidden="true" />
        Next
      </button>
      <button
        className="button icon-button"
        type="button"
        onClick={onOpenSettings}
        aria-label="Open settings"
      >
        <SlidersHorizontal size={19} aria-hidden="true" />
      </button>
    </div>
  );
}
