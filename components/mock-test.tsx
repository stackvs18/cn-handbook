"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TOPICS, UNITS, twoDigits } from "@/lib/topics";
import type { Question } from "@/lib/types";
import { QuestionCard } from "./question-card";

type Phase = "setup" | "running" | "finished";
type Scope = "all" | "quant" | "reasoning";

const ONE_MINUTE = 60 * 1000;

// Shuffles a list in place (Fisher–Yates) and returns it.
function shuffleList<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporary = items[index];
    items[index] = items[randomIndex];
    items[randomIndex] = temporary;
  }
  return items;
}

// Formats milliseconds as "mm:ss".
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

// Finds which syllabus unit a topic belongs to, for the results breakdown.
function getUnitName(topicSlug: string): string {
  for (const topic of TOPICS) {
    if (topic.slug === topicSlug) {
      for (const unit of UNITS) {
        if (unit.id === topic.unitId) {
          return unit.name;
        }
      }
    }
  }
  return "Other";
}

// Keeps only the questions that match the chosen scope.
function getQuestionPool(allQuestions: Question[], scope: Scope): Question[] {
  const pool: Question[] = [];
  for (const question of allQuestions) {
    const isReasoning = getUnitName(question.topicSlug) === "Units 1–4 revision";
    if (scope === "all" || (scope === "reasoning" && isReasoning) || (scope === "quant" && !isReasoning)) {
      pool.push(question);
    }
  }
  return pool;
}

// A small row of toggle buttons used on the setup screen.
function ChoiceRow<T extends string | number | boolean>({
  label,
  value,
  choices,
  onChange,
}: {
  label: string;
  value: T;
  choices: { value: T; label: string }[];
  onChange: (newValue: T) => void;
}) {
  return (
    <div className="grid gap-2.5 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[150px_1fr] sm:items-center">
      <span className="eyebrow">{label}</span>
      <div className="segmented w-fit" role="group" aria-label={label}>
        {choices.map((choice) => (
          <button
            key={String(choice.value)}
            type="button"
            aria-pressed={value === choice.value}
            onClick={() => onChange(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// A mixed, timed test drawn at random from the whole question bank.
// Answers stay hidden until the end. Results don't change topic progress.
export function MockTest({ allQuestions }: { allQuestions: Question[] }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [questionCount, setQuestionCount] = useState(20);
  const [scope, setScope] = useState<Scope>("all");
  const [isTimed, setIsTimed] = useState(true);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [finishedAt, setFinishedAt] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isConfirmingFinish, setIsConfirmingFinish] = useState(false);

  const timeLimit = isTimed ? testQuestions.length * ONE_MINUTE : 0;

  // While the test runs, tick once a second, and finish it when time runs out
  useEffect(() => {
    if (phase !== "running") {
      return;
    }
    const timerId = window.setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (timeLimit > 0 && now - startedAt >= timeLimit) {
        setFinishedAt(now);
        setPhase("finished");
      }
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [phase, startedAt, timeLimit]);

  // Keyboard shortcuts during the test: a–e picks an option, ← → move between questions
  useEffect(() => {
    if (phase !== "running") {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || event.ctrlKey || event.metaKey) {
        return;
      }
      const question = testQuestions[currentIndex];
      const pressedKey = event.key.toLowerCase();
      let isValidLetter = false;
      for (const option of question.options) {
        if (option.letter === pressedKey) {
          isValidLetter = true;
        }
      }
      if (isValidLetter) {
        setPicks((previousPicks) => ({ ...previousPicks, [question.id]: pressedKey }));
      } else if (event.key === "ArrowRight" && currentIndex < testQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (event.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentIndex, testQuestions]);

  // Draws a fresh set of questions and starts the clock.
  function startTest() {
    const pool = getQuestionPool(allQuestions, scope);
    const chosenQuestions = shuffleList([...pool]).slice(0, questionCount);
    const now = Date.now();
    setTestQuestions(chosenQuestions);
    setPicks({});
    setCurrentIndex(0);
    setStartedAt(now);
    setCurrentTime(now);
    setIsConfirmingFinish(false);
    setPhase("running");
    window.scrollTo(0, 0);
  }

  // Ends the test. If some questions are blank, asks first.
  function requestFinish() {
    const answeredCount = Object.keys(picks).length;
    if (answeredCount < testQuestions.length && !isConfirmingFinish) {
      setIsConfirmingFinish(true);
      window.scrollTo(0, 0);
      return;
    }
    setFinishedAt(Date.now());
    setPhase("finished");
    window.scrollTo(0, 0);
  }

  // Moves to another question in the test.
  function goToQuestion(newIndex: number) {
    setCurrentIndex(newIndex);
    setIsConfirmingFinish(false);
  }

  // ---------------------------------------------------------------- setup screen
  if (phase === "setup") {
    const poolSize = getQuestionPool(allQuestions, scope).length;
    const realCount = Math.min(questionCount, poolSize);
    return (
      <div>
        <div className="mt-10 overflow-hidden rounded-[0.9rem] border border-line bg-surface">
          <ChoiceRow
            label="Questions"
            value={questionCount}
            choices={[
              { value: 20, label: "20" },
              { value: 40, label: "40" },
              { value: 60, label: "60" },
            ]}
            onChange={setQuestionCount}
          />
          <ChoiceRow
            label="Topics"
            value={scope}
            choices={[
              { value: "all", label: "All topics" },
              { value: "quant", label: "Units 5–10" },
              { value: "reasoning", label: "Units 1–4" },
            ]}
            onChange={setScope}
          />
          <ChoiceRow
            label="Timer"
            value={isTimed}
            choices={[
              { value: true, label: "1 min per question" },
              { value: false, label: "Untimed" },
            ]}
            onChange={setIsTimed}
          />
        </div>
        <p className="mt-3 text-[0.82rem] text-faint">{poolSize} questions in this pool.</p>
        <button type="button" className="btn btn-primary mt-8" onClick={startTest}>
          Start {realCount}-question test <ArrowRight size={15} />
        </button>
        <p className="mt-5 text-[0.85rem] text-muted">Mock answers are kept separate and don’t change your topic progress.</p>
      </div>
    );
  }

  // ---------------------------------------------------------------- results screen
  if (phase === "finished") {
    // Step 1: score the test, overall and per unit
    let correctCount = 0;
    const unitScores: Record<string, { correct: number; total: number }> = {};
    for (const question of testQuestions) {
      const unitName = getUnitName(question.topicSlug);
      if (unitScores[unitName] === undefined) {
        unitScores[unitName] = { correct: 0, total: 0 };
      }
      unitScores[unitName].total = unitScores[unitName].total + 1;
      if (picks[question.id] === question.answer) {
        correctCount = correctCount + 1;
        unitScores[unitName].correct = unitScores[unitName].correct + 1;
      }
    }
    const percentCorrect = Math.round((correctCount * 100) / testQuestions.length);

    let advice = "Start with your weakest unit below, re-read its guides, then take another test.";
    if (percentCorrect >= 90) {
      advice = "That is exam-ready. Keep it warm with the sums sheet.";
    } else if (percentCorrect >= 70) {
      advice = "Close. Go through the misses below, then retake.";
    }

    // Step 2: list the misses first in the review
    const missedQuestions: Question[] = [];
    const correctQuestions: Question[] = [];
    for (const question of testQuestions) {
      if (picks[question.id] === question.answer) {
        correctQuestions.push(question);
      } else {
        missedQuestions.push(question);
      }
    }
    const reviewOrder = [...missedQuestions, ...correctQuestions];

    return (
      <div>
        <p className="eyebrow mt-10">Finished in {formatTime(finishedAt - startedAt)}</p>
        <p className="mt-4 font-serif text-[4.2rem] leading-none tracking-[-0.03em] sm:text-[5.5rem]">
          {correctCount} <span className="text-muted">/ {testQuestions.length}</span>
        </p>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
          <span className="font-medium text-fg">{percentCorrect}% correct.</span> {advice}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setPhase("setup")}>
            New test <ArrowRight size={15} />
          </button>
          <Link href="/#topics" className="btn btn-ghost">
            Back to topics
          </Link>
        </div>

        <div className="mt-12 border-t border-line-strong">
          {UNITS.map((unit) => {
            const score = unitScores[unit.name];
            if (score === undefined) {
              return null;
            }
            const barWidth = Math.round((score.correct * 100) / score.total);
            return (
              <div key={unit.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-b border-line py-3 sm:grid-cols-[1fr_200px_70px]">
                <span className="text-[0.92rem]">{unit.name}</span>
                <span className="col-span-2 h-1 overflow-hidden rounded-full bg-line sm:order-none sm:col-span-1">
                  <span className="block h-full rounded-full bg-fg" style={{ width: `${barWidth}%` }} />
                </span>
                <span className="row-start-1 text-right font-mono text-[0.76rem] tabular-nums text-muted sm:row-start-auto">
                  {score.correct} / {score.total}
                </span>
              </div>
            );
          })}
        </div>

        <h2 className="mt-14 border-b border-line-strong pb-2 text-[1rem] font-semibold">Review · misses first</h2>
        {reviewOrder.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            mode="review"
            showTopic
            chosenLetter={picks[question.id] ?? null}
            displayNumber={testQuestions.indexOf(question) + 1}
          />
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------- running screen
  const question = testQuestions[currentIndex];
  const pickedLetter = picks[question.id];
  const answeredCount = Object.keys(picks).length;
  const elapsed = currentTime - startedAt;
  const timeShown = timeLimit > 0 ? formatTime(timeLimit - elapsed) : formatTime(elapsed);
  const isRunningLow = timeLimit > 0 && timeLimit - elapsed < ONE_MINUTE;
  const isLastQuestion = currentIndex === testQuestions.length - 1;

  return (
    <div className="mt-6">
      <div className="sticky top-14 z-20 bg-bg/85 pt-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.8rem] tabular-nums text-muted">
            Question {currentIndex + 1} / {testQuestions.length}
          </span>
          <span className="flex-1" />
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.9rem] tabular-nums ${
              isRunningLow ? "border-bad-line text-bad" : "border-line text-fg"
            }`}
            aria-label="Time"
          >
            {timeShown}
          </span>
          <button type="button" className="btn btn-sm btn-ghost" onClick={requestFinish}>
            Finish
          </button>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line">
          <span
            className="block h-full bg-fg transition-[width] duration-300"
            style={{ width: `${Math.round((answeredCount * 100) / testQuestions.length)}%` }}
          />
        </div>
      </div>

      {isConfirmingFinish && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[0.65rem] border border-warn-line bg-warn-bg px-4 py-3 text-[0.9rem]">
          <span>
            {testQuestions.length - answeredCount} unanswered. Finish anyway?
          </span>
          <span className="flex gap-2">
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setIsConfirmingFinish(false)}>
              Keep going
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={requestFinish}>
              Finish test
            </button>
          </span>
        </div>
      )}

      <div className="pt-6">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.74rem] tabular-nums text-faint">Q{twoDigits(currentIndex + 1)}</span>
          <span className="tag">{question.topicTitle}</span>
        </div>
        <p
          className="question-text mb-4 text-[1.08rem] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.questionHtml }}
        />
        <div className="grid gap-2">
          {question.options.map((option) => (
            <button
              key={option.letter}
              type="button"
              className="option"
              data-state={pickedLetter === option.letter ? "picked" : undefined}
              onClick={() => setPicks({ ...picks, [question.id]: option.letter })}
            >
              <span className="option-letter">{option.letter}</span>
              <span className="option-text min-w-0 pt-px" dangerouslySetInnerHTML={{ __html: option.html }} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-between gap-3">
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          disabled={currentIndex === 0}
          onClick={() => goToQuestion(currentIndex - 1)}
        >
          <ArrowLeft size={14} /> Previous
        </button>
        {isLastQuestion ? (
          <button type="button" className="btn btn-sm btn-primary" onClick={requestFinish}>
            Finish test
          </button>
        ) : (
          <button type="button" className="btn btn-sm btn-primary" onClick={() => goToQuestion(currentIndex + 1)}>
            Next <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-1.5 border-t border-line pt-5" aria-label="Jump to question">
        {testQuestions.map((testQuestion, questionIndex) => {
          const isCurrent = questionIndex === currentIndex;
          const isAnswered = picks[testQuestion.id] !== undefined;
          return (
            <button
              key={testQuestion.id}
              type="button"
              onClick={() => goToQuestion(questionIndex)}
              aria-label={`Question ${questionIndex + 1}`}
              className={`h-8 w-8 rounded-md border font-mono text-[0.7rem] tabular-nums ${
                isCurrent
                  ? "border-fg text-fg ring-1 ring-fg"
                  : isAnswered
                    ? "border-line-strong bg-hover text-fg"
                    : "border-line text-faint"
              }`}
            >
              {questionIndex + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
