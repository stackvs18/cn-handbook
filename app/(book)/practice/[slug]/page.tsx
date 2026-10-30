import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOPICS, getTopic } from "@/lib/topics";
import { getQuestionsForTopic } from "@/lib/questions";
import { TopicHeader, TopicPager } from "@/components/topic-header";
import { PracticeSession } from "@/components/practice-session";

// Only the known topics exist; anything else is a 404
export const dynamicParams = false;

// Builds one practice page per topic at build time.
export function generateStaticParams() {
  const allParams: { slug: string }[] = [];
  for (const topic of TOPICS) {
    allParams.push({ slug: topic.slug });
  }
  return allParams;
}

// Sets the browser tab title and description for this topic's practice page.
export async function generateMetadata({ params }: PageProps<"/practice/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getTopic(slug);
  if (found === null) {
    return {};
  }
  return { title: `${found.topic.title} practice`, description: `Practise ${found.topic.title} MCQs with instant answers.` };
}

// The Practice tab: every question for one topic, answered by tapping.
export default async function PracticePage({ params }: PageProps<"/practice/[slug]">) {
  const { slug } = await params;
  const found = getTopic(slug);
  if (found === null) {
    notFound();
  }

  const questions = getQuestionsForTopic(slug);

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14 xl:px-12">
      <TopicHeader topicSlug={slug} activeTab="practice" questionCount={questions.length} />

      <p className="mb-6 max-w-[760px] rounded-xl border border-accent-line bg-accent-bg px-4 py-3 text-[0.92rem] text-muted">
        In the real paper each MCQ has <span className="text-fg">8 options (A–H)</span> in a different order. Remember
        the answer <span className="text-fg">text</span>, not the letter.
      </p>

      <div className="max-w-[760px]">
        <PracticeSession topicSlug={slug} questions={questions} />
      </div>

      <TopicPager topicSlug={slug} activeTab="practice" />
    </main>
  );
}
