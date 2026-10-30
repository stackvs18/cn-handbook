import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, PenLine } from "lucide-react";
import { getTopic, twoDigits } from "@/lib/topics";

type TopicTab = "learn" | "practice";

// The top of a topic page: unit, title, summary, and the Learn / Practice tabs.
export function TopicHeader({ topicSlug, activeTab, questionCount }: { topicSlug: string; activeTab: TopicTab; questionCount: number }) {
  const found = getTopic(topicSlug);
  if (found === null) {
    return null;
  }
  const { topic, unit } = found;

  const tabs = [
    { tab: "learn", label: "Learn", href: `/learn/${topic.slug}`, icon: <BookOpen size={14} /> },
    { tab: "practice", label: `Practice · ${questionCount}`, href: `/practice/${topic.slug}`, icon: <PenLine size={14} /> },
  ];

  return (
    <header className="mb-10 max-w-[760px]">
      <p className="eyebrow">
        {unit.name} · {unit.syllabusLabel}
      </p>
      <div className="mt-6 flex items-baseline gap-4">
        <span className="font-mono text-sm tabular-nums text-faint">{twoDigits(topic.number)}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs text-faint">{topic.source}</span>
      </div>
      <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">{topic.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{topic.summary}</p>

      <nav className="mt-7 inline-flex gap-0.5 rounded-full border border-line bg-surface p-[3px]" aria-label="Topic sections">
        {tabs.map((tabLink) => {
          const isActive = tabLink.tab === activeTab;
          return (
            <Link
              key={tabLink.tab}
              href={tabLink.href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-[34px] items-center gap-2 rounded-full px-4 text-[0.86rem] transition-colors ${
                isActive ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {tabLink.icon}
              {tabLink.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

// Previous / next topic cards at the bottom of a topic page. Stays on the same tab.
export function TopicPager({ topicSlug, activeTab }: { topicSlug: string; activeTab: TopicTab }) {
  const found = getTopic(topicSlug);
  if (found === null) {
    return null;
  }
  const { previousTopic, nextTopic } = found;

  return (
    <nav className="mt-16 grid max-w-[760px] gap-3 sm:grid-cols-2" aria-label="Topic navigation">
      {previousTopic !== null ? (
        <Link href={`/${activeTab}/${previousTopic.slug}`} className="card group p-5">
          <span className="flex items-center gap-2 text-xs text-faint">
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="mt-2 block font-medium leading-snug">{previousTopic.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {nextTopic !== null && (
        <Link href={`/${activeTab}/${nextTopic.slug}`} className="card group p-5 text-right">
          <span className="flex items-center justify-end gap-2 text-xs text-faint">
            Next
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 block font-medium leading-snug">{nextTopic.title}</span>
        </Link>
      )}
    </nav>
  );
}
