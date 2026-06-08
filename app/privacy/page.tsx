import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Solfege Ear Trainer.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <section className="simple-page legal-page">
      <div className="page-heading">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: June 8, 2026</p>
      </div>
      <article>
        <h2>Local practice data</h2>
        <p>
          The v1 trainer stores settings, recent results, and session statistics in your browser's
          localStorage. This keeps practice available without an account.
        </p>
        <h2>Waitlist email</h2>
        <p>
          The waitlist form sends your email address through Web3Forms so the site owner can
          receive signup notifications. The page may also keep a local browser copy as a backup
          confirmation.
        </p>
        <h2>No microphone input</h2>
        <p>
          The v1 trainer does not use your microphone. Audio is generated in the browser with Web
          Audio API.
        </p>
      </article>
    </section>
  );
}
