// Reads the question files in content/questions. Server only: it uses the file system,
// so only pages and route handlers import it, never "use client" components.

import fs from "node:fs";
import path from "node:path";
import { TOPICS, getTopicTitle } from "./topics";
import { renderInlineMarkdown } from "./inline-markdown";
import type { Question, QuestionOption } from "./types";

// The shape of one entry in a content/questions/<slug>.json file
type QuestionInFile = {
  number: number;
  question: string;
  options: { letter: string; text: string }[];
  answer: string;
  explanation: string;
  source: string;
  bookKeyCorrected: boolean;
};

const QUESTIONS_FOLDER = path.join(process.cwd(), "content", "questions");

// Remembers files we've already read, so a build reads each one only once
const questionsByTopic = new Map<string, Question[]>();

// Loads one topic's questions and turns their Markdown into HTML.
export function getQuestionsForTopic(topicSlug: string): Question[] {
  const alreadyLoaded = questionsByTopic.get(topicSlug);
  if (alreadyLoaded !== undefined) {
    return alreadyLoaded;
  }

  // Step 1: read and parse the JSON file
  const filePath = path.join(QUESTIONS_FOLDER, `${topicSlug}.json`);
  const fileText = fs.readFileSync(filePath, "utf8");
  const questionsInFile = JSON.parse(fileText) as QuestionInFile[];

  // Step 2: convert every question into the shape the components use
  const topicTitle = getTopicTitle(topicSlug);
  const readyQuestions: Question[] = [];
  for (const fileQuestion of questionsInFile) {
    const options: QuestionOption[] = [];
    for (const fileOption of fileQuestion.options) {
      options.push({ letter: fileOption.letter, html: renderInlineMarkdown(fileOption.text) });
    }

    readyQuestions.push({
      id: `${topicSlug}:${fileQuestion.number}`,
      topicSlug: topicSlug,
      topicTitle: topicTitle,
      number: fileQuestion.number,
      questionHtml: renderInlineMarkdown(fileQuestion.question),
      options: options,
      answer: fileQuestion.answer,
      explanationHtml: renderInlineMarkdown(fileQuestion.explanation),
      source: fileQuestion.source,
      bookKeyCorrected: fileQuestion.bookKeyCorrected,
    });
  }

  // Step 3: remember the result for next time
  questionsByTopic.set(topicSlug, readyQuestions);
  return readyQuestions;
}

// Loads every question from every topic, in topic order.
export function getAllQuestions(): Question[] {
  const allQuestions: Question[] = [];
  for (const topic of TOPICS) {
    const topicQuestions = getQuestionsForTopic(topic.slug);
    for (const question of topicQuestions) {
      allQuestions.push(question);
    }
  }
  return allQuestions;
}

// How many questions each topic has, e.g. { "percentage": 24, ... }.
export function getQuestionCounts(): Record<string, number> {
  const countsBySlug: Record<string, number> = {};
  for (const topic of TOPICS) {
    countsBySlug[topic.slug] = getQuestionsForTopic(topic.slug).length;
  }
  return countsBySlug;
}

// The correct letter for every question, e.g. { "percentage:7": "a", ... }.
// The home page uses it to work out accuracy without loading every question.
export function getAnswerKey(): Record<string, string> {
  const answerKey: Record<string, string> = {};
  for (const question of getAllQuestions()) {
    answerKey[question.id] = question.answer;
  }
  return answerKey;
}
