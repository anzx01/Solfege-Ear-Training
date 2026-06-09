"use client";

import {
  cadenceFunctions,
  chordForFunction,
  midiToFrequency,
  type Cadence,
  type Difficulty,
  type Exercise,
  type PracticeSettings,
  type SupportedKey
} from "@/lib/music";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

type PlaybackSpeed = {
  chordDuration: number;
  chordSpacing: number;
  targetDelay: number;
  targetDuration: number;
};

function speedForDifficulty(difficulty: Difficulty): PlaybackSpeed {
  if (difficulty === "practice") {
    return {
      chordDuration: 0.44,
      chordSpacing: 0.56,
      targetDelay: 0.32,
      targetDuration: 0.7
    };
  }

  return {
    chordDuration: 0.62,
    chordSpacing: 0.78,
    targetDelay: 0.46,
    targetDuration: 0.86
  };
}

function voice(
  context: AudioContext,
  frequency: number,
  type: OscillatorType,
  startAt: number,
  duration: number,
  volume: number
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.025);
  gain.gain.setValueAtTime(volume, Math.max(startAt + 0.03, startAt + duration - 0.08));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.05);
}

// 主音用三角波，叠加一个低增益的八度泛音(正弦)，让音色更饱满、更接近真实乐器。
function playTone(
  context: AudioContext,
  midi: number,
  startAt: number,
  duration: number,
  volume: number
) {
  const frequency = midiToFrequency(midi);
  voice(context, frequency, "triangle", startAt, duration, volume);
  voice(context, frequency * 2, "sine", startAt, duration, volume * 0.3);
}

// midis[0] 是低音根音，音量略突出以强化调性中心。
function scheduleChord(
  context: AudioContext,
  midis: number[],
  startAt: number,
  duration: number
) {
  midis.forEach((midi, index) => {
    const volume = index === 0 ? 0.1 : 0.07;
    playTone(context, midi, startAt + index * 0.012, duration, volume);
  });
}

export class SolfegeAudioEngine {
  private context: AudioContext | null = null;

  async init() {
    if (!this.context) {
      const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextCtor) {
        throw new Error("Web Audio API is not available in this browser.");
      }

      this.context = new AudioContextCtor();
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  async playCadence(key: SupportedKey, settings: Pick<PracticeSettings, "cadence" | "difficulty">) {
    await this.init();
    const context = this.context;
    if (!context) return;

    const speed = speedForDifficulty(settings.difficulty);
    const start = context.currentTime + 0.04;
    let cursor = start;

    for (const chord of cadenceFunctions(settings.cadence)) {
      scheduleChord(context, chordForFunction(key, chord), cursor, speed.chordDuration);
      cursor += speed.chordSpacing;
    }

    await wait(Math.ceil((cursor - start + 0.08) * 1000));
  }

  async playNote(midi: number, difficulty: Difficulty) {
    await this.init();
    const context = this.context;
    if (!context) return;

    const speed = speedForDifficulty(difficulty);
    const start = context.currentTime + 0.04;
    playTone(context, midi, start, speed.targetDuration, 0.18);
    await wait(Math.ceil((speed.targetDuration + 0.1) * 1000));
  }

  async playExercise(exercise: Exercise, settings: Pick<PracticeSettings, "cadence" | "difficulty">) {
    await this.init();
    const context = this.context;
    if (!context) return;

    const speed = speedForDifficulty(settings.difficulty);
    const start = context.currentTime + 0.04;
    let cursor = start;

    for (const chord of cadenceFunctions(settings.cadence)) {
      scheduleChord(context, chordForFunction(exercise.key, chord), cursor, speed.chordDuration);
      cursor += speed.chordSpacing;
    }

    cursor += speed.targetDelay;
    playTone(context, exercise.target.midi, cursor, speed.targetDuration, 0.18);

    await wait(Math.ceil((cursor - start + speed.targetDuration + 0.12) * 1000));
  }
}
