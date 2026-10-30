import type { Metadata } from "next";
import Link from "next/link";
import { TOPICS, twoDigits } from "@/lib/topics";
import { getAllQuestions, getQuestionsForTopic } from "@/lib/questions";
import { QuestionCard } from "@/components/question-card";
import { AnswerKeyView } from "@/components/answer-key-view";

export const metadata: Metadata = {
  title: "All MCQs",
  description: "Every Computer Networks MCQ with its options, the correct option highlighted and a worked explanation.",
};

// The whole question bank on one page, like an answer key: every option shown,
// the correct one highlighted, explanation underneath. Switches can hide the
// answers for self-testing.
export default function AllQuestionsPage() {
  const totalQuestions = getAllQuestions().length;

  return (
    <div className="mx-auto flex max-w-[1440px]">
      {/* Jump list on laptops */}
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[290px] shrink-0 overflow-y-auto border-r border-line px-3 py-8 lg:block">
        <p className="eyebrow mb-4 px-3">Jump to topic</p>
        <ul className="text-[0.84rem]">
          {TOPICS.map((topic) => (
            <li key={topic.slug}>
              <a
                href={`#${topic.slug}`}
                className="flex items-start gap-3 rounded-md px-3 py-[0.4rem] leading-snug text-muted transition-colors hover:bg-hover/60 hover:text-fg"
              >
                <span className="mt-[0.2rem] w-5 shrink-0 font-mono text-[0.68rem] tabular-nums text-faint">
                  {twoDigits(topic.number)}
                </span>
                <span className="flex-1">{topic.title}</span>
                <span className="mt-[0.2rem] font-mono text-[0.66rem] tabular-nums text-faint">
                  {getQuestionsForTopic(topic.slug).length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <main id="main" className="min-w-0 flex-1 px-5 pb-24 pt-10 sm:px-8 sm:pt-14 xl:px-12">
        <header className="mb-8 max-w-[760px]">
          <p className="eyebrow">Answer key</p>
          <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">
            All {totalQuestions} MCQs
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Every question with its options. The correct option is highlighted in green with the working underneath.
            Hide the answers to test yourself, or use{" "}
            <Link href="/#topics" className="text-link">
              Practice
            </Link>{" "}
            to answer by tapping and keep score.
          </p>

          {/* Jump chips on phones */}
          <div className="mt-6 flex flex-wrap gap-1.5 lg:hidden">
            {TOPICS.map((topic) => (
              <a
                key={topic.slug}
                href={`#${topic.slug}`}
                className="inline-flex h-[26px] items-center rounded-full border border-line bg-surface px-2.5 text-[0.76rem] text-muted"
              >
                {topic.title}
              </a>
            ))}
          </div>
        </header>

        <div className="max-w-[760px]">
          <AnswerKeyView>
            {TOPICS.map((topic) => (
              <section key={topic.slug} id={topic.slug} className="scroll-mt-28 pt-12">
                <div className="flex items-baseline justify-between gap-3 border-b border-line-strong pb-2">
                  <h2 className="text-[1.05rem] font-semibold">
                    <span className="mr-2 font-mono text-[0.78rem] font-normal text-faint">{twoDigits(topic.number)}</span>
                    {topic.title}
                  </h2>
                  <Link href={`/learn/${topic.slug}`} className="text-link whitespace-nowrap text-[0.8rem]">
                    Read the guide
                  </Link>
                </div>
                {getQuestionsForTopic(topic.slug).map((question) => (
                  <QuestionCard
                    key={question.id}
                    anchorId={`${topic.slug}-q${question.number}`}
                    question={question}
                    mode="key"
                  />
                ))}
              </section>
            ))}
          </AnswerKeyView>
        </div>
      </main>
    </div>
  );
}
