"use client";

import { useEffect, useState } from "react";
import { clearAnswers, saveAnswer, setLastTopic, useSavedAnswers } from "@/lib/progress";
import type { Question } from "@/lib/types";
import { QuestionCard } from "./question-card";

type Filter = "all" | "unanswered" | "wrong";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unanswered", label: "Unanswered" },
  { value: "wrong", label: "Wrong" },
];

// The Practice tab of a topic: every question, tap to answer, with a score and filters.
export function PracticeSession({ topicSlug, questions }: { topicSlug: string; questions: Question[] }) {
  const savedAnswers = useSavedAnswers();
  const [filter, setFilter] = useState<Filter>("all");
  // When a filter is picked we freeze its list, so a question doesn't vanish the
  // moment you answer it (you still want to read its explanation).
  const [frozenQuestionIds, setFrozenQuestionIds] = useState<string[]>([]);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Remember this topic for the "Continue" button on the home page
  useEffect(() => {
    setLastTopic(topicSlug);
  }, [topicSlug]);

  // Step 1: count answered and correct questions
  let answeredCount = 0;
  let correctCount = 0;
  for (const question of questions) {
    const chosenLetter = savedAnswers[question.id];
    if (chosenLetter !== undefined) {
      answeredCount = answeredCount + 1;
      if (chosenLetter === question.answer) {
        correctCount = correctCount + 1;
      }
    }
  }

  // Step 2: decide which questions to show
  const visibleQuestions: Question[] = [];
  for (const question of questions) {
    if (filter === "all" || frozenQuestionIds.includes(question.id)) {
      visibleQuestions.push(question);
    }
  }

  // Switches the filter and freezes the list of questions it matches right now.
  function chooseFilter(newFilter: Filter) {
    const matchingIds: string[] = [];
    for (const question of questions) {
      const chosenLetter = savedAnswers[question.id];
      const isUnanswered = chosenLetter === undefined;
      const isWrong = chosenLetter !== undefined && chosenLetter !== question.answer;
      if ((newFilter === "unanswered" && isUnanswered) || (newFilter === "wrong" && isWrong)) {
        matchingIds.push(question.id);
      }
    }
    setFrozenQuestionIds(matchingIds);
    setFilter(newFilter);
  }

  // Clears every answer in this topic (after the student confirms).
  function resetTopic() {
    const topicQuestionIds: string[] = [];
    for (const question of questions) {
      topicQuestionIds.push(question.id);
    }
    clearAnswers(topicQuestionIds);
    setIsConfirmingReset(false);
    setFilter("all");
  }

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-1 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-line bg-bg/85 px-1 py-2.5 backdrop-blur-md">
        <p className="font-mono text-[0.78rem] tabular-nums text-muted">
          <span className="font-semibold text-fg">{correctCount}</span> correct · {answeredCount}/{questions.length} answered
        </p>
        <span className="flex-1" />
        <div className="segmented" role="group" aria-label="Filter questions">
          {FILTERS.map((filterOption) => (
            <button
              key={filterOption.value}
              type="button"
              aria-pressed={filter === filterOption.value}
              onClick={() => chooseFilter(filterOption.value)}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
        {answeredCount > 0 && !isConfirmingReset && (
          <button type="button" className="text-link text-[0.8rem]" onClick={() => setIsConfirmingReset(true)}>
            Reset topic
          </button>
        )}
        {isConfirmingReset && (
          <span className="flex items-center gap-2 text-[0.8rem] text-muted">
            Clear {answeredCount} answers?
            <button type="button" className="btn btn-sm btn-primary" onClick={resetTopic}>
              Clear
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setIsConfirmingReset(false)}>
              Keep
            </button>
          </span>
        )}
      </div>

      {visibleQuestions.length === 0 ? (
        <div className="py-14">
          <h2 className="font-serif text-[1.8rem] leading-tight">
            {filter === "wrong" ? "No wrong answers here." : "Everything is answered."}
          </h2>
          <p className="mt-2 max-w-[48ch] text-muted">
            {filter === "wrong"
              ? "Every question you answered in this topic is correct."
              : "You have answered every question in this topic."}
          </p>
          <button type="button" className="btn btn-sm btn-ghost mt-6" onClick={() => setFilter("all")}>
            Show all questions
          </button>
        </div>
      ) : (
        visibleQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            anchorId={`q-${question.number}`}
            question={question}
            mode="practice"
            chosenLetter={savedAnswers[question.id] ?? null}
            onChoose={(letter) => saveAnswer(question.id, letter)}
            onReveal={() => saveAnswer(question.id, "?")}
            onRetry={() => clearAnswers([question.id])}
          />
        ))
      )}
    </div>
  );
}
