"use client";

import { useState } from "react";

// Wraps the All MCQs list with two switches. The cards themselves are rendered on the
// server; these switches only add data attributes that globals.css uses to hide things.
export function AnswerKeyView({ children }: { children: React.ReactNode }) {
  const [areAnswersHidden, setAreAnswersHidden] = useState(false);
  const [areExplanationsHidden, setAreExplanationsHidden] = useState(false);

  return (
    <div data-hide-answers={areAnswersHidden} data-hide-explanations={areExplanationsHidden}>
      <div className="sticky top-14 z-20 -mx-1 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-line bg-bg/85 px-1 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="eyebrow">Answers</span>
          <div className="segmented" role="group" aria-label="Answers">
            <button type="button" aria-pressed={!areAnswersHidden} onClick={() => setAreAnswersHidden(false)}>
              Highlighted
            </button>
            <button type="button" aria-pressed={areAnswersHidden} onClick={() => setAreAnswersHidden(true)}>
              Hidden
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="eyebrow">Explanations</span>
          <div className="segmented" role="group" aria-label="Explanations">
            <button type="button" aria-pressed={!areExplanationsHidden} onClick={() => setAreExplanationsHidden(false)}>
              Shown
            </button>
            <button type="button" aria-pressed={areExplanationsHidden} onClick={() => setAreExplanationsHidden(true)}>
              Hidden
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
