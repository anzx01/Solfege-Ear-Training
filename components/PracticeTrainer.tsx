"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SolfegeAudioEngine } from "@/lib/audio";
import {
  computeSessionStats,
  createExercise,
  DEFAULT_SETTINGS,
  settingsForDifficulty,
  SOLFEGE,
  SOLFEGE_LABELS,
  weakestSyllable,
  type Difficulty,
  type Exercise,
  type ExerciseResult,
  type PracticeSettings,
  type Solfege
} from "@/lib/music";
import {
  RECENT_RESULTS_KEY,
  RESULTS_KEY,
  SETTINGS_KEY,
  readResults,
  readSettings,
  writeLocal
} from "@/lib/practice-storage";
import { AnswerGrid } from "@/components/practice/AnswerGrid";
import { ControlBar } from "@/components/practice/ControlBar";
import { SettingsPanel } from "@/components/practice/SettingsPanel";
import { StatsGrid } from "@/components/practice/StatsGrid";
import type { Feedback } from "@/components/practice/types";

const idleFeedback: Feedback = {
  state: "idle",
  message: "Click Start Practice"
};

export function PracticeTrainer() {
  const [settings, setSettings] = useState<PracticeSettings>({
    ...DEFAULT_SETTINGS,
    enabledDegrees: [...DEFAULT_SETTINGS.enabledDegrees]
  });
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(idleFeedback);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const audioRef = useRef<SolfegeAudioEngine | null>(null);

  const stats = useMemo(() => computeSessionStats(results), [results]);
  const weakest = weakestSyllable(stats);
  const hasResolvedQuestion = feedback.state !== "idle";

  useEffect(() => {
    setSettings(readSettings());
    setResults(readResults());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      writeLocal(SETTINGS_KEY, settings);
    }
  }, [hydrated, settings]);

  useEffect(() => {
    if (hydrated) {
      writeLocal(RESULTS_KEY, results);
      writeLocal(RECENT_RESULTS_KEY, results.slice(-50));
    }
  }, [hydrated, results]);

  const engine = useCallback(() => {
    audioRef.current ??= new SolfegeAudioEngine();
    return audioRef.current;
  }, []);

  const playWholeExercise = useCallback(
    async (nextExercise: Exercise) => {
      setIsPlaying(true);
      try {
        await engine().playExercise(nextExercise, settings);
      } catch {
        setFeedback({
          state: "idle",
          message: "Audio could not start in this browser."
        });
      } finally {
        setIsPlaying(false);
      }
    },
    [engine, settings]
  );

  const startNewExercise = useCallback(async () => {
    const nextExercise = createExercise(settings);
    setExercise(nextExercise);
    setFeedback({ state: "idle", message: "Question ready" });
    setStartedAt(Date.now());
    await playWholeExercise(nextExercise);
  }, [playWholeExercise, settings]);

  const replayKey = useCallback(async () => {
    if (!exercise || isPlaying) return;
    setIsPlaying(true);
    try {
      await engine().playCadence(exercise.key, settings);
    } finally {
      setIsPlaying(false);
    }
  }, [engine, exercise, isPlaying, settings]);

  const replayNote = useCallback(async () => {
    if (!exercise || isPlaying) return;
    setIsPlaying(true);
    try {
      await engine().playNote(exercise.target.midi, settings.difficulty);
    } finally {
      setIsPlaying(false);
    }
  }, [engine, exercise, isPlaying, settings.difficulty]);

  const recordResult = useCallback(
    (answerValue: Solfege, method: ExerciseResult["method"]) => {
      if (!exercise || hasResolvedQuestion) return;

      const correct = method === "user" && answerValue === exercise.target.syllable;
      const result: ExerciseResult = {
        exerciseId: exercise.id,
        key: exercise.key,
        targetSyllable: exercise.target.syllable,
        answer: answerValue,
        correct,
        attempts: method === "user" ? 1 : 0,
        responseMs: startedAt ? Date.now() - startedAt : 0,
        createdAt: new Date().toISOString(),
        method
      };

      setResults((current) => [...current, result].slice(-250));

      if (method === "show-answer") {
        setFeedback({
          state: "shown",
          message: `The answer was ${SOLFEGE_LABELS[exercise.target.syllable]}.`,
          chosen: exercise.target.syllable
        });
        return;
      }

      setFeedback({
        state: correct ? "correct" : "incorrect",
        message: correct
          ? "Correct"
          : `The answer was ${SOLFEGE_LABELS[exercise.target.syllable]}.`,
        chosen: answerValue
      });
    },
    [exercise, hasResolvedQuestion, startedAt]
  );

  const answer = useCallback(
    (syllable: Solfege) => {
      if (!exercise) {
        setFeedback({
          state: "idle",
          message: "Press Start Practice first"
        });
        return;
      }

      if (isPlaying || hasResolvedQuestion) return;
      recordResult(syllable, "user");
    },
    [exercise, hasResolvedQuestion, isPlaying, recordResult]
  );

  const showAnswer = useCallback(() => {
    if (!exercise || isPlaying || hasResolvedQuestion) return;
    recordResult(exercise.target.syllable, "show-answer");
  }, [exercise, hasResolvedQuestion, isPlaying, recordResult]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < SOLFEGE.length) {
        event.preventDefault();
        answer(SOLFEGE[index]);
      }

      if (event.key === "Enter" && exercise && hasResolvedQuestion && !isPlaying) {
        event.preventDefault();
        void startNewExercise();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, exercise, hasResolvedQuestion, isPlaying, startNewExercise]);

  function updateDifficulty(difficulty: Difficulty) {
    setSettings((current) => ({
      ...settingsForDifficulty(difficulty),
      keyMode: current.keyMode,
      fixedKey: current.fixedKey
    }));
  }

  function updateEnabled(syllable: Solfege, enabled: boolean) {
    setSettings((current) => {
      const next = enabled
        ? [...current.enabledDegrees, syllable]
        : current.enabledDegrees.filter((item) => item !== syllable);

      return {
        ...current,
        enabledDegrees:
          next.length > 0 ? SOLFEGE.filter((item) => next.includes(item)) : current.enabledDegrees
      };
    });
  }

  const statusIcon =
    feedback.state === "correct" ? (
      <CheckCircle2 size={22} aria-hidden="true" />
    ) : feedback.state === "incorrect" ? (
      <XCircle size={22} aria-hidden="true" />
    ) : null;

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
        onStart={startNewExercise}
        onReplayKey={replayKey}
        onReplayNote={replayNote}
        onShowAnswer={showAnswer}
        onNext={startNewExercise}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className={`feedback-line ${feedback.state}`} role="status" aria-live="polite">
        {statusIcon}
        <span>{isPlaying ? "Playing" : feedback.message}</span>
      </div>

      <AnswerGrid
        exercise={exercise}
        feedback={feedback}
        hasResolvedQuestion={hasResolvedQuestion}
        isPlaying={isPlaying}
        onAnswer={answer}
      />

      <StatsGrid stats={stats} weakest={weakest} />

      {settingsOpen ? (
        <SettingsPanel
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onSelectDifficulty={updateDifficulty}
          onToggleSyllable={updateEnabled}
          onChange={setSettings}
        />
      ) : null}
    </section>
  );
}
