import Link from "next/link";
import { PracticeTrainer } from "@/components/PracticeTrainer";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SEO_PAGES } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Free browser practice</p>
          <h1>Movable Do Solfege Ear Training Online</h1>
          <p className="hero-subtitle">
            Practice hearing Do, Re, Mi, Fa, Sol, La, and Ti in different keys.
          </p>
        </div>
        <PracticeTrainer />
      </section>

      <section className="content-band">
        <div className="content-grid">
          <article>
            <h2>What is movable do?</h2>
            <p>
              Movable do names notes by their place inside the current key. Do is the tonic, Re is
              the second scale degree, and Ti is the leading tone. When the key changes, the names
              move with it.
            </p>
          </article>
          <article>
            <h2>How to practice</h2>
            <p>
              Listen to the cadence, keep the key center in mind, then identify the target note by
              its solfege syllable. Beginner mode starts with Do, Mi, and Sol before opening all
              seven syllables.
            </p>
          </article>
          <article>
            <h2>FAQ</h2>
            <p>
              The first version uses major keys and browser-generated audio. No account, download,
              microphone, or app install is required.
            </p>
          </article>
        </div>
      </section>

      <section className="link-band" aria-labelledby="practice-links">
        <h2 id="practice-links">Related practice pages</h2>
        <div className="link-list">
          {Object.values(SEO_PAGES).map((page) => (
            <Link key={page.slug} href={`/${page.slug}`}>
              {page.h1}
            </Link>
          ))}
        </div>
      </section>

      <section className="waitlist-band" aria-labelledby="pro-heading">
        <div>
          <p className="eyebrow">Pro waitlist</p>
          <h2 id="pro-heading">Practice smarter with weak-point training and progress history.</h2>
        </div>
        <WaitlistForm />
      </section>
    </>
  );
}
