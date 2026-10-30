import type { Metadata } from "next";
import Link from "next/link";
import { getFormulaGroups, renderExtra } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Sums sheet",
  description: "Every Computer Networks sum method on one page, plus the traps that cost marks and how to work the paper.",
};

// The last-hour revision page: formula cards, calculation toolkit, traps and strategy.
export default async function FormulasPage() {
  const formulaGroups = await getFormulaGroups();
  const toolkit = await renderExtra("toolkit");
  const traps = await renderExtra("traps");
  const strategy = await renderExtra("strategy");

  const sections = [
    { id: "toolkit", title: "Hex, binary and powers of 2", html: toolkit.html },
    { id: "traps", title: "Traps that cost marks", html: traps.html },
    { id: "strategy", title: "In the exam hall", html: strategy.html },
  ];

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14 xl:px-12">
      <header className="mb-12 max-w-[760px]">
        <p className="eyebrow">Last-hour revision</p>
        <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">Sums sheet</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          The method for every sum type on one page, then hex and binary conversion, the traps that cost marks, and how
          to work the paper.
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex h-[26px] items-center rounded-full border border-line bg-surface px-2.5 text-[0.78rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {section.title}
            </a>
          ))}
        </div>
      </header>

      <div className="columns-1 gap-3.5 md:columns-2">
        {formulaGroups.map((group) => (
          <div key={group.title} className="mb-3.5 break-inside-avoid rounded-[0.9rem] border border-line bg-surface px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[0.95rem] font-semibold">{group.title}</h2>
              {group.topicSlug !== null && (
                <Link
                  href={`/learn/${group.topicSlug}`}
                  className="whitespace-nowrap font-mono text-[0.66rem] uppercase tracking-[0.06em] text-faint transition-colors hover:text-fg"
                >
                  Guide →
                </Link>
              )}
            </div>
            <div className="formula-card prose mt-2" dangerouslySetInnerHTML={{ __html: group.html }} />
          </div>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-16 max-w-[720px] scroll-mt-20 border-t border-line pt-10">
          <h2 className="mb-6 font-serif text-[1.9rem] leading-tight tracking-[-0.015em]">{section.title}</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: section.html }} />
        </section>
      ))}
    </main>
  );
}
