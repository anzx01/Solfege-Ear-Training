import { XCircle } from "lucide-react";
import {
  SOLFEGE,
  SOLFEGE_LABELS,
  SUPPORTED_KEYS,
  type Cadence,
  type Difficulty,
  type KeyMode,
  type PracticeSettings,
  type Solfege
} from "@/lib/music";

type SettingsPanelProps = {
  settings: PracticeSettings;
  onClose: () => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onToggleSyllable: (syllable: Solfege, enabled: boolean) => void;
  onChange: (updater: (current: PracticeSettings) => PracticeSettings) => void;
};

export function SettingsPanel({
  settings,
  onClose,
  onSelectDifficulty,
  onToggleSyllable,
  onChange
}: SettingsPanelProps) {
  return (
    <div className="settings-backdrop" onClick={onClose}>
      <aside
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-header">
          <h2 id="settings-heading">Settings</h2>
          <button className="button icon-button" type="button" onClick={onClose} aria-label="Close settings">
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
                onClick={() => onSelectDifficulty(difficulty)}
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
                onClick={() => onChange((current) => ({ ...current, keyMode: mode }))}
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
                onChange((current) => ({
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
                onClick={() => onChange((current) => ({ ...current, cadence }))}
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
                    onChange={(event) => onToggleSyllable(syllable, event.target.checked)}
                  />
                  <span>{SOLFEGE_LABELS[syllable]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <button className="button primary full-width" type="button" onClick={onClose}>
          Apply
        </button>
      </aside>
    </div>
  );
}
