import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Solfege Ear Trainer is a free browser-based movable-do ear training tool for singers, music students, and beginners.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <section className="simple-page">
      <div className="page-heading">
        <p className="eyebrow">About</p>
        <h1>A focused solfege practice tool</h1>
        <p>
          Solfege Ear Trainer is built for one small but useful action: hear a key, hear a note,
          and choose its movable-do syllable.
        </p>
      </div>
      <div className="article-columns">
        <article>
          <h2>Why it exists</h2>
          <p>
            Many learners want a quick way to practice relative pitch without installing an app or
            starting a full course. This v1 keeps the workflow narrow and immediate.
          </p>
        </article>
        <article>
          <h2>What v1 includes</h2>
          <p>
            The tool supports major keys, Beginner and Practice modes, cadence replay, target-note
            replay, instant answer feedback, and local session statistics.
          </p>
        </article>
      </div>
    </section>
  );
}
