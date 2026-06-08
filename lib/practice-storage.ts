import {
  DEFAULT_SETTINGS,
  isSolfege,
  isSupportedKey,
  sanitizeSettings,
  type ExerciseResult,
  type PracticeSettings
} from "@/lib/music";

export const SETTINGS_KEY = "solfege.settings.v1";
export const RESULTS_KEY = "solfege.session.results.v1";
export const RECENT_RESULTS_KEY = "solfege.recent.results.v1";

export function readSettings(): PracticeSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? sanitizeSettings(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS, enabledDegrees: [...DEFAULT_SETTINGS.enabledDegrees] };
  }
}

export function isExerciseResult(value: unknown): value is ExerciseResult {
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

export function readResults(): ExerciseResult[] {
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isExerciseResult) : [];
  } catch {
    return [];
  }
}

export function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is intentionally optional for the v1 tool.
  }
}
