import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TOPICS, getTopic } from "@/lib/topics";
import { renderTopicGuide } from "@/lib/markdown";
import { getQuestionsForTopic } from "@/lib/questions";
import { TopicHeader, TopicPager } from "@/components/topic-header";
import { RememberTopic } from "@/components/home-widgets";

// Only the known topics exist; anything else is a 404
export const dynamicParams = false;

// Builds one page per topic at build time.
export function generateStaticParams() {
  const allParams: { slug: string }[] = [];
  for (const topic of TOPICS) {
    allParams.push({ slug: topic.slug });
  }
  return allParams;
}

// Sets the browser tab title and description for this topic.
export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getTopic(slug);
  if (found === null) {
    return {};
  }
  return { title: found.topic.title, description: found.topic.summary };
}

// The Learn tab: the full guide for one topic, then a nudge to practise.
export default async function LearnPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const found = getTopic(slug);
  if (found === null) {
    notFound();
  }

  const guide = await renderTopicGuide(slug);
  const questionCount = getQuestionsForTopic(slug).length;

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14 xl:px-12">
      <RememberTopic topicSlug={slug} />
      <TopicHeader topicSlug={slug} activeTab="learn" questionCount={questionCount} />

      <div className="prose max-w-[720px]" dangerouslySetInnerHTML={{ __html: guide.html }} />

      <div className="mt-16 flex max-w-[720px] flex-wrap items-center justify-between gap-4 border-y border-line py-6">
        <p className="max-w-[44ch] text-muted">
          Now try <span className="text-fg">{questionCount} questions</span> on {found.topic.title}. Doing them straight
          after reading is what makes it stick.
        </p>
        <Link href={`/practice/${slug}`} className="btn btn-sm btn-primary group">
          Practise now
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <TopicPager topicSlug={slug} activeTab="learn" />
    </main>
  );
}
