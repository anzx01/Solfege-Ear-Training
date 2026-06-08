import Link from "next/link";
import { Music2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="Solfege Ear Trainer home">
        <span className="brand-mark" aria-hidden="true">
          <Music2 size={20} strokeWidth={2.2} />
        </span>
        <span>Solfege Ear Trainer</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/movable-do-ear-training">Movable Do</Link>
        <Link href="/solfege-ear-training">Solfege</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
