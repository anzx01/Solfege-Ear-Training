import assert from "node:assert/strict";
import {
  createExercise,
  DEFAULT_SETTINGS,
  midiForSolfege,
  normalizeEnabledDegrees,
  SOLFEGE,
  type PracticeSettings
} from "../lib/music";

assert.equal(midiForSolfege("C", "do"), 60, "C major Do should be C4");
assert.equal(midiForSolfege("C", "re"), 62, "C major Re should be D4");
assert.equal(midiForSolfege("C", "mi"), 64, "C major Mi should be E4");
assert.equal(midiForSolfege("G", "do"), 67, "G major Do should be G4");
assert.equal(midiForSolfege("G", "ti"), 66, "G major Ti should be F#4 after range adjustment");
assert.equal(midiForSolfege("Bb", "mi"), 62, "Bb major Mi should be D4");

for (const key of ["C", "D", "E", "F", "G", "A", "B", "Bb", "Eb"] as const) {
  for (const syllable of SOLFEGE) {
    const midi = midiForSolfege(key, syllable);
    assert.ok(midi >= 60 && midi <= 71, `${key} ${syllable} should stay around C4-B4`);
  }
}

assert.deepEqual(normalizeEnabledDegrees(["mi", "sol"]), ["mi", "sol"]);
assert.deepEqual(normalizeEnabledDegrees([]), DEFAULT_SETTINGS.enabledDegrees);

const fixedSettings: PracticeSettings = {
  difficulty: "practice",
  keyMode: "fixed",
  fixedKey: "Eb",
  cadence: "I-IV-V-I",
  enabledDegrees: ["ti"]
};

for (let index = 0; index < 10; index += 1) {
  const exercise = createExercise(fixedSettings, () => 0.2);
  assert.equal(exercise.key, "Eb");
  assert.equal(exercise.target.syllable, "ti");
}

console.log("music logic tests passed");
