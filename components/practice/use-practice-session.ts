"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SolfegeAudioEngine } from "@/lib/audio";
import {
  computeSessionStats,
  createExercise,
  DEFAULT_SETTINGS,
  normalizeEnabledDegrees,
  settingsForDifficulty,
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
import type { Feedback } from "@/components/practice/types";

const idleFeedback: Feedback = {
  state: "idle",
  message: "Click Start Practice"
};

export function usePracticeSession() {
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
  const attemptsRef = useRef(0);

  const stats = useMemo(() => computeSessionStats(results), [results]);
  const weakest = weakestSyllable(stats);
  const hasResolvedQuestion = feedback.state === "correct" || feedback.state === "shown";
  // 当前可答的唱名：开始答题后跟随题目的 options(=已启用级数)，未开始时回退到设置。
  const options = useMemo(
    () => (exercise ? exercise.options : normalizeEnabledDegrees(settings.enabledDegrees)),
    [exercise, settings.enabledDegrees]
  );

  useEffect(() => {
    setSettings(readSettings());
    setResults(readResults());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeLocal(SETTINGS_KEY, settings);
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
        setFeedback({ state: "idle", message: "Audio could not start in this browser." });
      } finally {
        setIsPlaying(false);
      }
    },
    [engine, settings]
  );

  const startNewExercise = useCallback(async () => {
    const nextExercise = createExercise(settings);
    attemptsRef.current = 0;
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

  // 一道题只在答对或主动看答案时落一条结果，attempts 记录到那一刻的累计尝试次数。
  const finishWithResult = useCallback(
    (answerValue: Solfege, correct: boolean, method: ExerciseResult["method"]) => {
      if (!exercise) return;
      const result: ExerciseResult = {
        exerciseId: exercise.id,
        key: exercise.key,
        targetSyllable: exercise.target.syllable,
        answer: answerValue,
        correct,
        attempts: attemptsRef.current,
        responseMs: startedAt ? Date.now() - startedAt : 0,
        createdAt: new Date().toISOString(),
        method
      };
      setResults((current) => [...current, result].slice(-250));
    },
    [exercise, startedAt]
  );

  const answer = useCallback(
    (syllable: Solfege) => {
      if (!exercise) {
        setFeedback({ state: "idle", message: "Press Start Practice first" });
        return;
      }
      if (isPlaying || hasResolvedQuestion) return;

      attemptsRef.current += 1;

      if (syllable === exercise.target.syllable) {
        finishWithResult(syllable, true, "user");
        setFeedback({ state: "correct", message: "Correct", chosen: syllable });
        return;
      }

      // 答错不结束题目：提示再试一次，可重听后继续作答。
      setFeedback({
        state: "retry",
        message: `Not ${SOLFEGE_LABELS[syllable]} — listen again and try once more.`,
        chosen: syllable
      });
    },
    [exercise, finishWithResult, hasResolvedQuestion, isPlaying]
  );

  const showAnswer = useCallback(() => {
    if (!exercise || isPlaying || hasResolvedQuestion) return;
    finishWithResult(exercise.target.syllable, false, "show-answer");
    setFeedback({
      state: "shown",
      message: `The answer was ${SOLFEGE_LABELS[exercise.target.syllable]}.`,
      chosen: exercise.target.syllable
    });
  }, [exercise, finishWithResult, hasResolvedQuestion, isPlaying]);

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
      if (Number.isInteger(index) && index >= 0 && index < options.length) {
        event.preventDefault();
        answer(options[index]);
      }

      if (event.key === "Enter" && exercise && hasResolvedQuestion && !isPlaying) {
        event.preventDefault();
        void startNewExercise();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, exercise, hasResolvedQuestion, isPlaying, options, startNewExercise]);

  const updateDifficulty = useCallback((difficulty: Difficulty) => {
    setSettings((current) => ({
      ...settingsForDifficulty(difficulty),
      keyMode: current.keyMode,
      fixedKey: current.fixedKey
    }));
  }, []);

  const updateEnabled = useCallback((syllable: Solfege, enabled: boolean) => {
    setSettings((current) => {
      const next = enabled
        ? [...current.enabledDegrees, syllable]
        : current.enabledDegrees.filter((item) => item !== syllable);
      return {
        ...current,
        enabledDegrees: next.length > 0 ? normalizeEnabledDegrees(next) : current.enabledDegrees
      };
    });
  }, []);

  return {
    settings,
    setSettings,
    exercise,
    feedback,
    isPlaying,
    settingsOpen,
    setSettingsOpen,
    stats,
    weakest,
    hasResolvedQuestion,
    options,
    startNewExercise,
    replayKey,
    replayNote,
    answer,
    showAnswer,
    updateDifficulty,
    updateEnabled
  };
}
