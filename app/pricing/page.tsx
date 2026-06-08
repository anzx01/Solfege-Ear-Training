import type { Metadata } from "next";
import { Check } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start practicing solfege ear training for free. Join the Pro waitlist for progress history and weak-point training.",
  alternates: {
    canonical: "/pricing"
  }
};

export default function PricingPage() {
  return (
    <section className="simple-page pricing-page">
      <div className="page-heading">
        <p className="eyebrow">Pricing</p>
        <h1>Start practicing instantly</h1>
        <p>Free practice is available now. Pro is planned for progress history and weak spots.</p>
      </div>

      <div className="pricing-grid">
        <article className="pricing-card">
          <h2>Free</h2>
          <p className="price">$0</p>
          <ul>
            <li>
              <Check size={18} aria-hidden="true" /> Start practicing instantly
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> No account required
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Basic solfege ear training
            </li>
          </ul>
        </article>

        <article className="pricing-card is-pro">
          <h2>Pro</h2>
          <p className="price">Waitlist</p>
          <ul>
            <li>
              <Check size={18} aria-hidden="true" /> Track your progress
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Train weak spots
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Build a daily practice habit
            </li>
          </ul>
          <WaitlistForm />
        </article>
      </div>
    </section>
  );
}
