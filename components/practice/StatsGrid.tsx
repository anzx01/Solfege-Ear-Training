import { SOLFEGE_LABELS, type SessionStats, type Solfege } from "@/lib/music";

type StatsGridProps = {
  stats: SessionStats;
  weakest: Solfege | null;
};

export function StatsGrid({ stats, weakest }: StatsGridProps) {
  return (
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
  );
}
