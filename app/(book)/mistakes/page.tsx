import type { Metadata } from "next";
import { getAllQuestions } from "@/lib/questions";
import { MistakesList } from "@/components/mistakes-list";

export const metadata: Metadata = {
  title: "Mistakes",
  description: "Every question you got wrong, grouped by topic, ready to retry.",
};

// Lists the student's wrong answers. The list itself is worked out in the browser,
// because that's where their answers are saved.
export default function MistakesPage() {
  const allQuestions = getAllQuestions();

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14 xl:px-12">
      <header className="mb-10 max-w-[760px]">
        <p className="eyebrow">Review</p>
        <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">Mistakes</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Read the explanation, press “Try again” and answer it fresh. Fixed questions drop off the list.
        </p>
      </header>
      <div className="max-w-[760px]">
        <MistakesList allQuestions={allQuestions} />
      </div>
    </main>
  );
}
