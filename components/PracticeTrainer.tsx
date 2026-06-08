"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Play,
  RotateCcw,
  SkipForward,
  SlidersHorizontal,
  Volume2,
  XCircle
} from "lucide-react";
import { SolfegeAudioEngine } from "@/lib/audio";
import {
  computeSessionStats,
  createExercise,
  DEFAULT_SETTINGS,
  isSolfege,
  isSupportedKey,
  sanitizeSettings,
  settingsForDifficulty,
  SOLFEGE,
  SOLFEGE_LABELS,
  SUPPORTED_KEYS,
  weakestSyllable,
  type Cadence,
  type Difficulty,
  type Exercise,
  type ExerciseResult,
  type KeyMode,
  type PracticeSettings,
  type Solfege
} from "@/lib/music";

const SETTINGS_KEY = "solfege.settings.v1";
const RESULTS_KEY = "solfege.session.results.v1";
const RECENT_RESULTS_KEY = "solfege.recent.results.v1";

type Feedback =
  | { state: "idle"; message: string; chosen?: undefined }
  | { state: "correct"; message: string; chosen: Solfege }
  | { state: "incorrect"; message: string; chosen: Solfege }
  | { state: "shown"; message: string; chosen: Solfege };

const idleFeedback: Feedback = {
  state: "idle",
  message: "Click Start Practice"
};

function readSettings(): PracticeSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? sanitizeSettings(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS, enabledDegrees: [...DEFAULT_SETTINGS.enabledDegrees] };
  }
}

function isExerciseResult(value: unknown): value is ExerciseResult {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ExerciseResult>;
  return (
    typeof record.exerciseId === "string" &&
    isSupportedKey(record.key) &&
    isSolfege(record.targetSyllable) &&
    isSolfege(record.answer) &&
    typeof record.correct === "boolean" &&
    typeof record.attempts === "number" &&
    typeof record.responseMs === "number" &&
    typeof record.createdAt === "string" &&
    (record.method === "user" || record.method === "show-answer")
  );
}

function readResults(): ExerciseResult[] {
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isExerciseResult) : [];
  } catch {
    return [];
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is intentionally optional for the v1 tool.
  }
}

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
    (answer: Solfege, method: ExerciseResult["method"]) => {
      if (!exercise || hasResolvedQuestion) return;

      const correct = method === "user" && answer === exercise.target.syllable;
      const result: ExerciseResult = {
        exerciseId: exercise.id,
        key: exercise.key,
        targetSyllable: exercise.target.syllable,
        answer,
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
        chosen: answer
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
        enabledDegrees: next.length > 0 ? SOLFEGE.filter((item) => next.includes(item)) : current.enabledDegrees
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

      <div className="tool-actions" aria-label="Practice controls">
        <button className="button primary" type="button" onClick={startNewExercise} disabled={isPlaying}>
          <Play size={18} aria-hidden="true" />
          Start Practice
        </button>
        <button className="button" type="button" onClick={replayKey} disabled={!exercise || isPlaying}>
          <RotateCcw size={18} aria-hidden="true" />
          Replay Key
        </button>
        <button className="button" type="button" onClick={replayNote} disabled={!exercise || isPlaying}>
          <Volume2 size={18} aria-hidden="true" />
          Replay Note
        </button>
        <button
          className="button"
          type="button"
          onClick={showAnswer}
          disabled={!exercise || isPlaying || hasResolvedQuestion}
        >
          <Eye size={18} aria-hidden="true" />
          Show Answer
        </button>
        <button
          className="button"
          type="button"
          onClick={startNewExercise}
          disabled={!exercise || isPlaying || !hasResolvedQuestion}
        >
          <SkipForward size={18} aria-hidden="true" />
          Next
        </button>
        <button className="button icon-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="Open settings">
          <SlidersHorizontal size={19} aria-hidden="true" />
        </button>
      </div>

      <div className={`feedback-line ${feedback.state}`} role="status" aria-live="polite">
        {statusIcon}
        <span>{isPlaying ? "Playing" : feedback.message}</span>
      </div>

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
              onClick={() => answer(syllable)}
              disabled={Boolean(exercise) && (isPlaying || hasResolvedQuestion)}
              aria-label={`Answer ${SOLFEGE_LABELS[syllable]}`}
            >
              <span>{SOLFEGE_LABELS[syllable]}</span>
            </button>
          );
        })}
      </div>

      <dl className="stats-grid" aria-label="Session statistics">
        <div>
          <dt>Total questions</dt>
          <dd>{stats.total}</dd>
        </div>
        <div>
          <dt>Correct answers</dt>
          <dd>{stats.correct}</dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{stats.accuracy}%</dd>
        </div>
        <div>
          <dt>Current streak</dt>
          <dd>{stats.streak}</dd>
        </div>
        <div>
          <dt>Weakest syllable</dt>
          <dd>{weakest ? SOLFEGE_LABELS[weakest] : "None yet"}</dd>
        </div>
      </dl>

      {settingsOpen ? (
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
          <aside
            className="settings-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-header">
              <h2 id="settings-heading">Settings</h2>
              <button className="button icon-button" type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings">
                <XCircle size={19} aria-hidden="true" />
              </button>
            </div>

            <fieldset className="setting-group">
              <legend>Difficulty</legend>
              <div className="segmented-control">
                {(["beginner", "practice"] as Difficulty[]).map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    className={settings.difficulty === difficulty ? "is-selected" : ""}
                    onClick={() => updateDifficulty(difficulty)}
                  >
                    {difficulty === "beginner" ? "Beginner" : "Practice"}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="setting-group">
              <legend>Key</legend>
              <div className="segmented-control">
                {(["random", "fixed"] as KeyMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={settings.keyMode === mode ? "is-selected" : ""}
                    onClick={() => setSettings((current) => ({ ...current, keyMode: mode }))}
                  >
                    {mode === "random" ? "Random" : "Fixed"}
                  </button>
                ))}
              </div>
              <label className="select-label" htmlFor="fixed-key">
                Fixed key
                <select
                  id="fixed-key"
                  value={settings.fixedKey}
                  disabled={settings.keyMode !== "fixed"}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      fixedKey: event.target.value as PracticeSettings["fixedKey"]
                    }))
                  }
                >
                  {SUPPORTED_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>

            <fieldset className="setting-group">
              <legend>Cadence</legend>
              <div className="segmented-control">
                {(["I-V-I", "I-IV-V-I"] as Cadence[]).map((cadence) => (
                  <button
                    key={cadence}
                    type="button"
                    className={settings.cadence === cadence ? "is-selected" : ""}
                    onClick={() => setSettings((current) => ({ ...current, cadence }))}
                  >
                    {cadence}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="setting-group">
              <legend>Enabled syllables</legend>
              <div className="checkbox-grid">
                {SOLFEGE.map((syllable) => {
                  const checked = settings.enabledDegrees.includes(syllable);
                  return (
                    <label key={syllable}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => updateEnabled(syllable, event.target.checked)}
                      />
                      <span>{SOLFEGE_LABELS[syllable]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button className="button primary full-width" type="button" onClick={() => setSettingsOpen(false)}>
              Apply
            </button>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
