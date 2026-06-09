import Link from "next/link";
import { VisitCounter } from "@/components/VisitCounter";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Solfege Ear Trainer</strong>
        <p>Free movable-do practice in the browser.</p>
        <VisitCounter />
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/pricing">Pro waitlist</Link>
      </nav>
    </footer>
  );
}
