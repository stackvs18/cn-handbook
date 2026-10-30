import type { Metadata } from "next";
import { getAllQuestions } from "@/lib/questions";
import { MockTest } from "@/components/mock-test";

export const metadata: Metadata = {
  title: "Mock test",
  description: "A timed mock test drawn at random from every Computer Networks MCQ, with a unit-by-unit breakdown.",
};

// The mock test page. The test itself runs in the browser (components/mock-test.tsx).
export default function MockPage() {
  const allQuestions = getAllQuestions();

  return (
    <main id="main" className="mx-auto max-w-[820px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <p className="eyebrow">Mock test · exam conditions</p>
      <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.02em] sm:text-[3.2rem]">
        Test yourself <em className="text-muted">like it’s the real paper.</em>
      </h1>
      <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">
        Questions are drawn at random from the whole bank. Answers stay hidden until you finish. Then you get a score,
        a unit-by-unit breakdown and every explanation.
      </p>
      <MockTest allQuestions={allQuestions} />
    </main>
  );
}
