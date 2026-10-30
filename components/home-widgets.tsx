"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { ArrowRight, Check } from "lucide-react";
import { STUDY_PLAN } from "@/lib/plan";
import { TOPICS } from "@/lib/topics";
import {
  countAnsweredInTopic,
  setLastTopic,
  togglePlanBlock,
  useLastTopic,
  useSavedAnswers,
  useTickedPlanBlocks,
} from "@/lib/progress";

// Small interactive pieces of the home page. They read progress from the
// browser, so they live in a "use client" file while the page itself stays static.

// ---------------------------------------------------------------- greeting

// The greeting never needs to update while the page is open
function subscribeToNothing() {
  return () => {};
}

// Picks a greeting for the time of day on the student's own clock.
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Late-night revision";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// "Good evening" etc. Shows "Hello" on the server, where there's no local clock.
export function Greeting() {
  const greeting = useSyncExternalStore(subscribeToNothing, getGreeting, () => "Hello");
  return <span className="text-fg">{greeting}</span>;
}

// ---------------------------------------------------------------- continue button

// The main button in the hero: "Continue <last topic>" or "Start with Percentage".
export function ContinueButton() {
  const lastTopicSlug = useLastTopic();

  let buttonHref = "/learn/percentage";
  let buttonLabel = "Start with Percentage";
  for (const topic of TOPICS) {
    if (topic.slug === lastTopicSlug) {
      buttonHref = `/learn/${topic.slug}`;
      buttonLabel = `Continue ${topic.title}`;
    }
  }

  return (
    <Link href={buttonHref} className="btn btn-primary group h-12 px-6 text-[0.95rem]">
      {buttonLabel}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

// Remembers the topic being read, for the continue button. Renders nothing.
export function RememberTopic({ topicSlug }: { topicSlug: string }) {
  useEffect(() => {
    setLastTopic(topicSlug);
  }, [topicSlug]);
  return null;
}

// ---------------------------------------------------------------- stats row

// The four numbers under the hero: questions, topics, answered, accuracy.
export function HomeStats({ answerKey }: { answerKey: Record<string, string> }) {
  const savedAnswers = useSavedAnswers();

  // Count answered and correct questions
  let answeredCount = 0;
  let correctCount = 0;
  for (const questionId of Object.keys(savedAnswers)) {
    const correctLetter = answerKey[questionId];
    if (correctLetter === undefined) {
      continue; // an old answer to a question that no longer exists
    }
    answeredCount = answeredCount + 1;
    if (savedAnswers[questionId] === correctLetter) {
      correctCount = correctCount + 1;
    }
  }
  const accuracyText = answeredCount > 0 ? `${Math.round((correctCount * 100) / answeredCount)}%` : "–";

  const stats = [
    { label: "questions", value: String(Object.keys(answerKey).length) },
    { label: "topics", value: String(TOPICS.length) },
    { label: "answered", value: String(answeredCount) },
    { label: "accuracy", value: accuracyText },
  ];

  return (
    <dl className="rise mt-14 grid max-w-[760px] grid-cols-2 border-y border-line sm:grid-cols-4" style={{ animationDelay: "240ms" }}>
      {stats.map((stat, statIndex) => (
        <div
          key={stat.label}
          className={`flex flex-col-reverse py-5 ${statIndex % 2 === 1 ? "border-l border-line pl-5" : ""} ${
            statIndex >= 2 ? "border-t border-line sm:border-t-0" : ""
          } ${statIndex === 2 ? "sm:border-l sm:border-line sm:pl-5" : ""}`}
        >
          <dt className="mt-1 text-xs text-faint">{stat.label}</dt>
          <dd className="font-serif text-3xl tabular-nums tracking-tight sm:text-4xl">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------- topic progress

// The little bar and "3/24" next to a topic on the home page.
export function TopicProgress({ topicSlug, totalCount }: { topicSlug: string; totalCount: number }) {
  const savedAnswers = useSavedAnswers();
  const answeredCount = countAnsweredInTopic(savedAnswers, topicSlug);
  const percentDone = totalCount > 0 ? Math.round((answeredCount * 100) / totalCount) : 0;
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] tabular-nums text-faint">
      <span className="h-1 w-14 overflow-hidden rounded-full bg-line">
        <span className="block h-full rounded-full bg-fg" style={{ width: `${percentDone}%` }} />
      </span>
      {answeredCount}/{totalCount}
    </span>
  );
}

// ---------------------------------------------------------------- study plan

// Tonight's plan as a checklist. Ticks are saved in the browser.
export function StudyPlan() {
  const tickedBlocks = useTickedPlanBlocks();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 border-b border-line-strong pb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-faint">
        <span>Block</span>
        <span>
          {tickedBlocks.length} of {STUDY_PLAN.length} done
        </span>
      </div>
      <ol>
        {STUDY_PLAN.map((block, blockIndex) => {
          const isDone = tickedBlocks.includes(blockIndex);
          return (
            <li
              key={block.title}
              className="grid grid-cols-[26px_minmax(0,1fr)] gap-x-3.5 gap-y-1 border-b border-line py-4 sm:grid-cols-[26px_64px_minmax(0,1fr)]"
            >
              <button
                type="button"
                onClick={() => togglePlanBlock(blockIndex)}
                aria-pressed={isDone}
                aria-label={`Mark block ${blockIndex + 1} done`}
                className={`mt-0.5 grid h-[22px] w-[22px] place-items-center rounded-md border-[1.5px] transition-colors ${
                  isDone ? "border-fg bg-fg text-bg" : "border-line-strong text-transparent hover:border-fg"
                }`}
              >
                <Check size={13} strokeWidth={2.75} />
              </button>
              <span className="col-start-2 pt-1 font-mono text-[0.76rem] tabular-nums text-faint sm:col-start-auto">
                {block.time}
              </span>
              <div className="col-start-2 min-w-0 sm:col-start-auto">
                <p className={`font-medium ${isDone ? "text-faint line-through" : ""}`}>{block.title}</p>
                <p className="mt-0.5 text-[0.88rem] text-muted">{block.why}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {block.links.map((planLink) => (
                    <Link
                      key={planLink.href}
                      href={planLink.href}
                      className="inline-flex h-[26px] items-center rounded-full border border-line bg-surface px-2.5 text-[0.78rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      {planLink.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
