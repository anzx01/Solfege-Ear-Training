import { SOLFEGE, SOLFEGE_LABELS, type SessionStats, type Solfege } from "@/lib/music";

type StatsGridProps = {
  stats: SessionStats;
  weakest: Solfege | null;
};

export function StatsGrid({ stats, weakest }: StatsGridProps) {
  const TARGET_ACCURACY = 80; // 目标准确率
  const hasPracticed = stats.total > 0;

  return (
    <div className="stats-section">
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
          <dd className={stats.accuracy >= TARGET_ACCURACY ? "stat-highlight" : ""}>
            {stats.accuracy}%
            {hasPracticed && stats.accuracy < TARGET_ACCURACY && (
              <span className="stat-goal" aria-label={`Goal: ${TARGET_ACCURACY}%`}>
                / {TARGET_ACCURACY}%
              </span>
            )}
          </dd>
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

      {hasPracticed && (
        <details className="stats-details">
          <summary>Accuracy by syllable</summary>
          <div className="syllable-stats">
            {SOLFEGE.map((syllable) => {
              const data = stats.bySyllable[syllable];
              if (data.total === 0) return null;

              return (
                <div key={syllable} className="syllable-stat-row">
                  <span className="syllable-stat-label">{SOLFEGE_LABELS[syllable]}</span>
                  <div className="syllable-stat-bar-container">
                    <div
                      className="syllable-stat-bar"
                      style={{ width: `${data.accuracy}%` }}
                      aria-label={`${data.accuracy}% accuracy`}
                    />
                  </div>
                  <span className="syllable-stat-value">
                    {data.correct}/{data.total}
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
