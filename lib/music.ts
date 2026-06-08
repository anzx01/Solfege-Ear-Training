export const SOLFEGE = ["do", "re", "mi", "fa", "sol", "la", "ti"] as const;
export type Solfege = (typeof SOLFEGE)[number];

export type Difficulty = "beginner" | "practice";
export type KeyMode = "random" | "fixed";
export type Cadence = "I-V-I" | "I-IV-V-I";

export const SOLFEGE_LABELS: Record<Solfege, string> = {
  do: "Do",
  re: "Re",
  mi: "Mi",
  fa: "Fa",
  sol: "Sol",
  la: "La",
  ti: "Ti"
};

export const SUPPORTED_KEYS = ["C", "D", "E", "F", "G", "A", "B", "Bb", "Eb"] as const;
export type SupportedKey = (typeof SUPPORTED_KEYS)[number];

export type PracticeSettings = {
  difficulty: Difficulty;
  keyMode: KeyMode;
  fixedKey: SupportedKey;
  cadence: Cadence;
  enabledDegrees: Solfege[];
};

export type Exercise = {
  id: string;
  key: SupportedKey;
  target: {
    degree: number;
    syllable: Solfege;
    midi: number;
  };
  options: Solfege[];
  createdAt: string;
};

export type ExerciseResult = {
  exerciseId: string;
  key: SupportedKey;
  targetSyllable: Solfege;
  answer: Solfege;
  correct: boolean;
  attempts: number;
  responseMs: number;
  createdAt: string;
  method: "user" | "show-answer";
};

export type SessionStats = {
  total: number;
  correct: number;
  accuracy: number;
  streak: number;
  bySyllable: Record<
    Solfege,
    {
      total: number;
      correct: number;
      accuracy: number;
    }
  >;
};

const KEY_PITCH_CLASS: Record<SupportedKey, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
  Bb: 10,
  Eb: 3
};

const DEGREE_INTERVALS: Record<Solfege, number> = {
  do: 0,
  re: 2,
  mi: 4,
  fa: 5,
  sol: 7,
  la: 9,
  ti: 11
};

const DEGREE_NUMBERS: Record<Solfege, number> = {
  do: 1,
  re: 2,
  mi: 3,
  fa: 4,
  sol: 5,
  la: 6,
  ti: 7
};

export const DEFAULT_SETTINGS: PracticeSettings = {
  difficulty: "beginner",
  keyMode: "random",
  fixedKey: "C",
  cadence: "I-V-I",
  enabledDegrees: ["do", "mi", "sol"]
};

export function isSolfege(value: unknown): value is Solfege {
  return typeof value === "string" && SOLFEGE.includes(value as Solfege);
}

export function isSupportedKey(value: unknown): value is SupportedKey {
  return typeof value === "string" && SUPPORTED_KEYS.includes(value as SupportedKey);
}

export function normalizeEnabledDegrees(degrees: readonly unknown[]): Solfege[] {
  const unique = SOLFEGE.filter((syllable) => degrees.includes(syllable));
  return unique.length > 0 ? unique : [...DEFAULT_SETTINGS.enabledDegrees];
}

export function settingsForDifficulty(difficulty: Difficulty): PracticeSettings {
  if (difficulty === "practice") {
    return {
      ...DEFAULT_SETTINGS,
      difficulty: "practice",
      keyMode: "random",
      cadence: "I-IV-V-I",
      enabledDegrees: [...SOLFEGE]
    };
  }

  return {
    ...DEFAULT_SETTINGS,
    difficulty: "beginner",
    cadence: "I-V-I",
    enabledDegrees: ["do", "mi", "sol"]
  };
}

export function sanitizeSettings(value: unknown): PracticeSettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_SETTINGS, enabledDegrees: [...DEFAULT_SETTINGS.enabledDegrees] };
  }

  const record = value as Partial<PracticeSettings>;
  const difficulty: Difficulty = record.difficulty === "practice" ? "practice" : "beginner";
  const keyMode: KeyMode = record.keyMode === "fixed" ? "fixed" : "random";
  const fixedKey = isSupportedKey(record.fixedKey) ? record.fixedKey : DEFAULT_SETTINGS.fixedKey;
  const cadence: Cadence = record.cadence === "I-IV-V-I" ? "I-IV-V-I" : "I-V-I";
  const enabledDegrees = Array.isArray(record.enabledDegrees)
    ? normalizeEnabledDegrees(record.enabledDegrees)
    : [...settingsForDifficulty(difficulty).enabledDegrees];

  return {
    difficulty,
    keyMode,
    fixedKey,
    cadence,
    enabledDegrees
  };
}

// 主音(do)居中锚定在 C4 附近，避免跨调时绝对音高漂移过大。
function rootMidi(key: SupportedKey): number {
  const pitchClass = KEY_PITCH_CLASS[key];
  const centered = pitchClass <= 6 ? pitchClass : pitchClass - 12;
  return 60 + centered;
}

// 音阶级数在主音上方的一个八度内自然上行（do 最低、ti 最高），
// 保证同一唱名在所有调里保持一致的相对音高，这是 movable-do 练耳的根基。
export function midiForSolfege(key: SupportedKey, syllable: Solfege): number {
  return rootMidi(key) + DEGREE_INTERVALS[syllable];
}

// 目标音抬高一个八度(+12)，明显高于和弦体，避免被终止式余音淹没。
export function midiForTarget(key: SupportedKey, syllable: Solfege): number {
  return midiForSolfege(key, syllable) + 12;
}

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function getKeyForExercise(
  settings: PracticeSettings,
  random: () => number = Math.random
): SupportedKey {
  if (settings.keyMode === "fixed") {
    return settings.fixedKey;
  }

  const index = Math.floor(random() * SUPPORTED_KEYS.length);
  return SUPPORTED_KEYS[Math.min(index, SUPPORTED_KEYS.length - 1)];
}

const CHORD_TONES: Record<"I" | "IV" | "V", Solfege[]> = {
  I: ["do", "mi", "sol"],
  IV: ["fa", "la", "do"],
  V: ["sol", "ti", "re"]
};

// 和弦根音落在和弦体下方一个八度，形成 do→sol→do 的低音线以确立调性。
export function chordForFunction(key: SupportedKey, chord: "I" | "IV" | "V"): number[] {
  const tones = CHORD_TONES[chord];
  const body = tones.map((syllable) => midiForSolfege(key, syllable));
  const bass = midiForSolfege(key, tones[0]) - 12;
  return [bass, ...body];
}

export function cadenceFunctions(cadence: Cadence): Array<"I" | "IV" | "V"> {
  return cadence === "I-IV-V-I" ? ["I", "IV", "V", "I"] : ["I", "V", "I"];
}

export function createExercise(
  settings: PracticeSettings,
  random: () => number = Math.random
): Exercise {
  const enabledDegrees = normalizeEnabledDegrees(settings.enabledDegrees);
  const targetIndex = Math.floor(random() * enabledDegrees.length);
  const syllable = enabledDegrees[Math.min(targetIndex, enabledDegrees.length - 1)];
  const key = getKeyForExercise(settings, random);

  return {
    id: `${Date.now().toString(36)}-${Math.floor(random() * 100000000).toString(36)}`,
    key,
    target: {
      degree: DEGREE_NUMBERS[syllable],
      syllable,
      midi: midiForTarget(key, syllable)
    },
    options: enabledDegrees,
    createdAt: new Date().toISOString()
  };
}

function emptyBySyllable(): SessionStats["bySyllable"] {
  return SOLFEGE.reduce((acc, syllable) => {
    acc[syllable] = { total: 0, correct: 0, accuracy: 0 };
    return acc;
  }, {} as SessionStats["bySyllable"]);
}

export function computeSessionStats(results: ExerciseResult[]): SessionStats {
  const bySyllable = emptyBySyllable();

  for (const result of results) {
    const entry = bySyllable[result.targetSyllable];
    entry.total += 1;
    if (result.correct) {
      entry.correct += 1;
    }
  }

  for (const syllable of SOLFEGE) {
    const entry = bySyllable[syllable];
    entry.accuracy = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
  }

  let streak = 0;
  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (!results[index].correct) break;
    streak += 1;
  }

  const total = results.length;
  const correct = results.filter((result) => result.correct).length;

  return {
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    streak,
    bySyllable
  };
}

export function weakestSyllable(stats: SessionStats): Solfege | null {
  let weakest: Solfege | null = null;

  for (const syllable of SOLFEGE) {
    const entry = stats.bySyllable[syllable];
    if (entry.total === 0) continue;

    if (!weakest) {
      weakest = syllable;
      continue;
    }

    const currentWeakest = stats.bySyllable[weakest];
    if (
      entry.accuracy < currentWeakest.accuracy ||
      (entry.accuracy === currentWeakest.accuracy && entry.total > currentWeakest.total)
    ) {
      weakest = syllable;
    }
  }

  return weakest;
}
