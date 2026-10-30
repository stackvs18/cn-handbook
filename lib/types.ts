// Shapes of the data that pages hand to the interactive components.

// One answer choice. The text is already turned into HTML on the server.
export type QuestionOption = {
  letter: string; // "a", "b", "c", "d" or "e"
  html: string;
};

// One multiple-choice question, ready to show on screen.
export type Question = {
  id: string; // topic slug + number, e.g. "percentage:7"
  topicSlug: string;
  topicTitle: string;
  number: number;
  questionHtml: string;
  options: QuestionOption[];
  answer: string; // the correct letter
  explanationHtml: string;
  source: string; // "Book Q217", "Book ch. 28" or "Book-style"
  bookKeyCorrected: boolean; // true when the book's own answer key is wrong
};

// What the student picked for a question. "?" means they pressed "Show answer".
export type SavedAnswers = Record<string, string>;

// One row in the search index (app/search-index.json/route.ts builds the list).
export type SearchEntry = {
  kind: "page" | "topic" | "section" | "question";
  title: string;
  context: string; // the grey line under the title
  href: string;
  searchText: string; // everything this entry can be found by
};
