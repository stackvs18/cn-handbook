"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UNITS, getTopicsInUnit, twoDigits } from "@/lib/topics";
import { countAnsweredInTopic, useSavedAnswers } from "@/lib/progress";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All MCQs", href: "/questions" },
  { label: "Mock test", href: "/mock" },
  { label: "Sums sheet", href: "/formulas" },
  { label: "Mistakes", href: "/mistakes" },
];

type TopicNavProps = {
  questionCounts: Record<string, number>;
  onNavigate?: () => void; // the phone drawer passes this so it can close itself
};

// The sidebar list: quick links, then every syllabus unit with its topics and progress.
export function TopicNav({ questionCounts, onNavigate }: TopicNavProps) {
  const pathname = usePathname();
  const savedAnswers = useSavedAnswers();

  return (
    <nav aria-label="Topics" className="text-[0.84rem]">
      <ul className="mb-7">
        {QUICK_LINKS.map((quickLink) => {
          const isActive = pathname === quickLink.href;
          return (
            <li key={quickLink.href}>
              <Link
                href={quickLink.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-md px-3 py-[0.4rem] transition-colors ${
                  isActive ? "bg-hover text-fg" : "text-muted hover:bg-hover/60 hover:text-fg"
                }`}
              >
                {quickLink.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {UNITS.map((unit) => {
        const weightText = unit.syllabusLabel.split(" · ")[1];
        return (
          <div key={unit.id} className="mb-7">
            <p className="mb-2 flex justify-between gap-2 px-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              <span>{unit.name}</span>
              <span>{weightText}</span>
            </p>
            <ul>
              {getTopicsInUnit(unit.id).map((topic) => {
                const isActive =
                  pathname === `/learn/${topic.slug}` || pathname === `/practice/${topic.slug}`;
                const answeredCount = countAnsweredInTopic(savedAnswers, topic.slug);
                const totalCount = questionCounts[topic.slug] ?? 0;
                const isFinished = totalCount > 0 && answeredCount >= totalCount;
                return (
                  <li key={topic.slug}>
                    <Link
                      href={`/learn/${topic.slug}`}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-start gap-3 rounded-md px-3 py-[0.4rem] leading-snug transition-colors ${
                        isActive ? "bg-hover text-fg" : "text-muted hover:bg-hover/60 hover:text-fg"
                      }`}
                    >
                      <span
                        className={`mt-[0.2rem] w-5 shrink-0 font-mono text-[0.68rem] tabular-nums ${
                          isActive ? "text-accent" : "text-faint"
                        }`}
                      >
                        {twoDigits(topic.number)}
                      </span>
                      <span className="flex-1">{topic.title}</span>
                      <span
                        className={`mt-[0.2rem] shrink-0 font-mono text-[0.66rem] tabular-nums ${
                          isFinished ? "text-good" : "text-faint"
                        }`}
                      >
                        {answeredCount}/{totalCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
