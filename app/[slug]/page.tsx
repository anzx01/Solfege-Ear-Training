import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PracticeTrainer } from "@/components/PracticeTrainer";
import { SEO_PAGES, SEO_SLUGS } from "@/lib/content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return SEO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = SEO_PAGES[slug];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/${page.slug}`,
      type: "website"
    }
  };
}

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = SEO_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <>
      <section className="article-hero">
        <div className="article-copy">
          <p className="eyebrow">Online ear training</p>
          <h1>{page.h1}</h1>
          <p>{page.intro}</p>
        </div>
        <PracticeTrainer />
      </section>

      <section className="content-band">
        <div className="article-columns">
          {page.sections.map((section) => (
            <article key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="link-band" aria-labelledby="related-heading">
        <h2 id="related-heading">Keep practicing</h2>
        <div className="link-list">
          {page.related.map((relatedSlug) => (
            <Link key={relatedSlug} href={`/${relatedSlug}`}>
              {SEO_PAGES[relatedSlug].h1}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
