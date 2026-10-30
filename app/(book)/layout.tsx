import { TopicNav } from "@/components/topic-nav";
import { getQuestionCounts } from "@/lib/questions";

// Pages inside (book) get the topic list as a left sidebar on laptops.
// On phones the same list is in the header's menu instead.
export default function BookLayout({ children }: { children: React.ReactNode }) {
  const questionCounts = getQuestionCounts();

  return (
    <div className="mx-auto flex max-w-[1440px]">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[290px] shrink-0 overflow-y-auto border-r border-line px-3 py-8 lg:block">
        <TopicNav questionCounts={questionCounts} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
