"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TOPICS } from "@/lib/topics";
import { clearAnswers, saveAnswer, useSavedAnswers } from "@/lib/progress";
import type { Question } from "@/lib/types";
import { QuestionCard } from "./question-card";

// Every question the student got wrong (or gave up on with "Show answer"),
// grouped by topic, so they can retry them before the exam.
export function MistakesList({ allQuestions }: { allQuestions: Question[] }) {
  const savedAnswers = useSavedAnswers();
  // Once the student starts retrying, the list is frozen so cards don't jump around.
  const [frozenQuestionIds, setFrozenQuestionIds] = useState<string[] | null>(null);

  // Step 1: find the current mistakes
  const currentMistakeIds: string[] = [];
  for (const question of allQuestions) {
    const chosenLetter = savedAnswers[question.id];
    if (chosenLetter !== undefined && chosenLetter !== question.answer) {
      currentMistakeIds.push(question.id);
    }
  }
  const shownIds = frozenQuestionIds !== null ? frozenQuestionIds : currentMistakeIds;

  // Freezes the list (if it isn't already) before an answer changes.
  function freezeList() {
    if (frozenQuestionIds === null) {
      setFrozenQuestionIds(currentMistakeIds);
    }
  }

  // Step 2: group the shown questions by topic
  const groups: { slug: string; title: string; questions: Question[] }[] = [];
  for (const topic of TOPICS) {
    const topicQuestions: Question[] = [];
    for (const question of allQuestions) {
      if (question.topicSlug === topic.slug && shownIds.includes(question.id)) {
        topicQuestions.push(question);
      }
    }
    if (topicQuestions.length > 0) {
      groups.push({ slug: topic.slug, title: topic.title, questions: topicQuestions });
    }
  }

  if (groups.length === 0) {
    return (
      <div className="py-10">
        <h2 className="font-serif text-[1.8rem] leading-tight">Nothing here yet.</h2>
        <p className="mt-2 max-w-[52ch] text-muted">
          Questions you get wrong in Practice, or ones where you pressed “Show answer”, collect here so you can
          retry them before the exam.
        </p>
        <Link href="/#topics" className="btn btn-sm btn-primary mt-6">
          Pick a topic <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-3 font-mono text-[0.78rem] text-muted">
        <span>
          <span className="font-semibold text-fg">{currentMistakeIds.length}</span> left to fix
        </span>
        {frozenQuestionIds !== null && (
          <button type="button" className="text-link font-sans" onClick={() => setFrozenQuestionIds(null)}>
            Remove the ones you fixed
          </button>
        )}
      </div>

      {groups.map((group) => (
        <section key={group.slug} className="mt-10">
          <div className="flex items-baseline justify-between gap-3 border-b border-line-strong pb-2">
            <h2 className="text-[1rem] font-semibold">{group.title}</h2>
            <Link href={`/learn/${group.slug}`} className="text-link text-[0.8rem]">
              Re-read the guide
            </Link>
          </div>
          {group.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              mode="practice"
              chosenLetter={savedAnswers[question.id] ?? null}
              onChoose={(letter) => {
                freezeList();
                saveAnswer(question.id, letter);
              }}
              onReveal={() => {
                freezeList();
                saveAnswer(question.id, "?");
              }}
              onRetry={() => {
                freezeList();
                clearAnswers([question.id]);
              }}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
