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
        <h2>Third-party processing</h2>
        <p>
          Waitlist submissions are processed by Web3Forms (web3forms.com), which delivers the
          notification email to the site owner. Your email address leaves your browser only when you
          submit the waitlist form, and it is handled under Web3Forms&apos; own privacy policy. We do
          not use analytics, advertising, or third-party tracking cookies.
        </p>
        <h2>Data retention and your choices</h2>
        <p>
          Practice data stored in localStorage stays on your device until you clear your browser
          storage. Waitlist emails are kept only while the Pro waitlist is active. You can request
          access to or deletion of your waitlist email at any time by contacting the site owner, and
          we will remove it from our records.
        </p>
      </article>
    </section>
  );
}
