import { Check, Eye, X } from "lucide-react";
import { htmlToPlainText } from "@/lib/inline-markdown";
import { twoDigits } from "@/lib/topics";
import type { Question } from "@/lib/types";

// How a card behaves:
// - "practice": the student taps an option and the card shows right/wrong
// - "review":   a finished mock test, showing what was picked (no tapping)
// - "key":      the answer key on the All MCQs page, correct option highlighted
type CardMode = "practice" | "review" | "key";

type QuestionCardProps = {
  question: Question;
  mode: CardMode;
  chosenLetter?: string | null; // what the student picked; "?" means "Show answer" was pressed
  displayNumber?: number; // the mock test numbers its questions 1..N instead
  showTopic?: boolean;
  anchorId?: string;
  onChoose?: (letter: string) => void;
  onReveal?: () => void;
  onRetry?: () => void;
};

// Options that are all short (like numbers) look better in two columns.
function fitsTwoColumns(question: Question): boolean {
  for (const option of question.options) {
    if (htmlToPlainText(option.html).length > 26) {
      return false;
    }
  }
  return true;
}

// Works out how one option should look: correct, wrong, faded, or plain.
function getOptionState(optionLetter: string, correctLetter: string, mode: CardMode, chosenLetter: string | null): string | undefined {
  if (mode === "key") {
    return optionLetter === correctLetter ? "correct" : undefined;
  }
  const isFinished = mode === "review" || chosenLetter !== null;
  if (!isFinished) {
    return undefined;
  }
  if (optionLetter === correctLetter) {
    return "correct";
  }
  if (optionLetter === chosenLetter) {
    return "wrong";
  }
  return "faded";
}

// One multiple-choice question with its options and (once answered) the explanation.
export function QuestionCard({
  question,
  mode,
  chosenLetter = null,
  displayNumber,
  showTopic = false,
  anchorId,
  onChoose,
  onReveal,
  onRetry,
}: QuestionCardProps) {
  // Step 1: work out what this card is showing right now
  const isAnswered = chosenLetter !== null;
  const showResult = mode === "key" || mode === "review" || isAnswered;
  const canTapOptions = mode === "practice" && !isAnswered;
  const wasRevealed = chosenLetter === "?";
  const wasCorrect = chosenLetter === question.answer;

  // Step 2: find the text of the correct option, for the "Answer (c) ..." line
  let correctOptionHtml = "";
  for (const option of question.options) {
    if (option.letter === question.answer) {
      correctOptionHtml = option.html;
    }
  }

  // Step 3: pick the verdict shown above the explanation
  let verdict = null;
  if (mode === "practice" || mode === "review") {
    if (wasRevealed) {
      verdict = (
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Eye size={13} /> Answer shown
        </span>
      );
    } else if (wasCorrect) {
      verdict = (
        <span className="inline-flex items-center gap-1.5 text-good">
          <Check size={13} strokeWidth={2.5} /> Correct
        </span>
      );
    } else if (isAnswered) {
      verdict = (
        <span className="inline-flex items-center gap-1.5 text-bad">
          <X size={13} strokeWidth={2.5} /> Not quite
        </span>
      );
    } else {
      verdict = <span className="text-muted">Not answered</span>;
    }
  }

  const numberShown = displayNumber !== undefined ? displayNumber : question.number;
  const optionGridClass = fitsTwoColumns(question) ? "grid gap-2 sm:grid-cols-2" : "grid gap-2";

  return (
    <article id={anchorId} className="question-card border-b border-line py-7">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.74rem] tabular-nums text-faint">Q{twoDigits(numberShown)}</span>
        {showTopic && <span className="tag">{question.topicTitle}</span>}
        {question.source !== "" && <span className="tag">{question.source}</span>}
        {question.bookKeyCorrected && <span className="tag tag-warn">Book key corrected</span>}
      </div>

      <p
        className="question-text mb-3.5 text-[1.03rem] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: question.questionHtml }}
      />

      <div className={optionGridClass}>
        {question.options.map((option) => {
          const optionState = getOptionState(option.letter, question.answer, mode, chosenLetter);
          const optionContent = (
            <>
              <span className="option-letter">{option.letter}</span>
              <span className="option-text min-w-0 pt-px" dangerouslySetInnerHTML={{ __html: option.html }} />
            </>
          );

          // Only practice cards that aren't answered yet can be tapped
          if (mode === "key") {
            return (
              <div key={option.letter} className="option" data-state={optionState}>
                {optionContent}
              </div>
            );
          }
          return (
            <button
              key={option.letter}
              type="button"
              className="option"
              data-state={optionState}
              disabled={!canTapOptions}
              onClick={() => onChoose?.(option.letter)}
            >
              {optionContent}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="explanation-block answer-only mt-3 rounded-[0.65rem] border border-line bg-surface px-3.5 py-3 text-[0.93rem] leading-relaxed">
          <p className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.06em]">
            {verdict}
            <span className="normal-case tracking-normal text-muted">
              Answer ({question.answer}) <span dangerouslySetInnerHTML={{ __html: correctOptionHtml }} />
            </span>
          </p>
          {question.explanationHtml !== "" && (
            <p className="explanation" dangerouslySetInnerHTML={{ __html: question.explanationHtml }} />
          )}
        </div>
      )}

      {mode === "practice" && (
        <div className="mt-2.5 flex gap-4 text-[0.82rem]">
          {isAnswered ? (
            <button type="button" className="text-link" onClick={onRetry}>
              Try again
            </button>
          ) : (
            <button type="button" className="text-link" onClick={onReveal}>
              Show answer
            </button>
          )}
        </div>
      )}
    </article>
  );
}
