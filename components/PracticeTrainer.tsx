"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { AnswerGrid } from "@/components/practice/AnswerGrid";
import { ControlBar } from "@/components/practice/ControlBar";
import { SettingsPanel } from "@/components/practice/SettingsPanel";
import { StatsGrid } from "@/components/practice/StatsGrid";
import { usePracticeSession } from "@/components/practice/use-practice-session";

export function PracticeTrainer() {
  const session = usePracticeSession();
  const { exercise, feedback, isPlaying, hasResolvedQuestion, settings, options } = session;

  const statusIcon =
    feedback.state === "correct" ? (
      <CheckCircle2 size={22} aria-hidden="true" />
    ) : feedback.state === "retry" ? (
      <XCircle size={22} aria-hidden="true" />
    ) : null;

  // retry 借用 incorrect 的视觉样式（红色提示），语义上同为“答错”。
  const feedbackClass = feedback.state === "retry" ? "incorrect" : feedback.state;

  return (
    <section className="trainer-shell" aria-label="Movable-do solfege practice tool">
      <div className="trainer-top">
        <div>
          <p className="tool-kicker">Movable-do trainer</p>
          <h2>Hear the note, name the syllable</h2>
        </div>
        <div className="question-meta" aria-live="polite">
          <span>{exercise ? `${exercise.key} major` : "Key: not started"}</span>
          <span>{settings.difficulty === "beginner" ? "Beginner" : "Practice"}</span>
        </div>
      </div>

      <ControlBar
        exercise={exercise}
        isPlaying={isPlaying}
        hasResolvedQuestion={hasResolvedQuestion}
        onStart={session.startNewExercise}
        onReplayKey={session.replayKey}
        onReplayNote={session.replayNote}
        onShowAnswer={session.showAnswer}
        onNext={session.startNewExercise}
        onOpenSettings={() => session.setSettingsOpen(true)}
      />

      <div className={`feedback-line ${feedbackClass}`} role="status" aria-live="polite">
        {statusIcon}
        <span>{isPlaying ? "Playing audio..." : feedback.message}</span>
      </div>

      <AnswerGrid
        options={options}
        exercise={exercise}
        feedback={feedback}
        hasResolvedQuestion={hasResolvedQuestion}
        isPlaying={isPlaying}
        onAnswer={session.answer}
      />

      <StatsGrid stats={session.stats} weakest={session.weakest} />

      {session.settingsOpen ? (
        <SettingsPanel
          settings={settings}
          onClose={() => session.setSettingsOpen(false)}
          onSelectDifficulty={session.updateDifficulty}
          onToggleSyllable={session.updateEnabled}
          onChange={session.setSettings}
        />
      ) : null}
    </section>
  );
}
