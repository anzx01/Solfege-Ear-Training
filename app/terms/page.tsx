import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Solfege Ear Trainer.",
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsPage() {
  return (
    <section className="simple-page legal-page">
      <div className="page-heading">
        <p className="eyebrow">Terms</p>
        <h1>Terms of Use</h1>
        <p>Last updated: June 8, 2026</p>
      </div>
      <article>
        <h2>Use of the tool</h2>
        <p>
          Solfege Ear Trainer is provided as an educational browser tool. It is not a replacement
          for a teacher, assessment, or formal music curriculum.
        </p>
        <h2>Availability</h2>
        <p>
          The tool may change as new practice modes, account features, and Pro features are tested.
        </p>
        <h2>Prototype waitlist</h2>
        <p>
          The v1 waitlist is a product validation entry point and does not create a paid
          subscription.
        </p>
      </article>
    </section>
  );
}
