"use client";

import { useSyncExternalStore } from "react";
import type { SavedAnswers } from "./types";

// Progress lives in the visitor's own browser (localStorage). Nothing is sent anywhere.
// Each value is stored as a JSON string, and components re-render when it changes.

const ANSWERS_KEY = "cn:answers"; // { "percentage:7": "c", ... }
const PLAN_KEY = "cn:plan"; // [0, 2, 3] = ticked study-plan blocks
const LAST_TOPIC_KEY = "cn:last"; // slug of the last topic opened
const CHANGE_EVENT = "cn:progress";

// Reads a raw value from localStorage. Returns null if storage is blocked.
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Writes a value and tells every component on the page that progress changed.
function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // storage unavailable (private mode, blocked) - progress just won't persist
  }
}

// Lets React listen for changes from this tab (our event) and other tabs ("storage").
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Turns the stored answers text back into an object, ignoring anything broken.
function parseAnswers(rawText: string | null): SavedAnswers {
  if (rawText === null) {
    return {};
  }
  try {
    const parsedValue = JSON.parse(rawText);
    if (parsedValue !== null && typeof parsedValue === "object" && !Array.isArray(parsedValue)) {
      return parsedValue as SavedAnswers;
    }
    return {};
  } catch {
    return {};
  }
}

// Turns the stored plan text back into a list of ticked block numbers.
function parsePlan(rawText: string | null): number[] {
  if (rawText === null) {
    return [];
  }
  try {
    const parsedValue = JSON.parse(rawText);
    if (!Array.isArray(parsedValue)) {
      return [];
    }
    const tickedBlocks: number[] = [];
    for (const item of parsedValue) {
      if (typeof item === "number") {
        tickedBlocks.push(item);
      }
    }
    return tickedBlocks;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- answers

// Every answer the student has given, keyed by question id.
// On the server (and the very first render) this is empty.
export function useSavedAnswers(): SavedAnswers {
  const rawText = useSyncExternalStore(
    subscribe,
    () => readStorage(ANSWERS_KEY),
    () => null,
  );
  return parseAnswers(rawText);
}

// Saves the letter the student picked ("?" means they asked to see the answer).
export function saveAnswer(questionId: string, letter: string) {
  const answers = parseAnswers(readStorage(ANSWERS_KEY));
  answers[questionId] = letter;
  writeStorage(ANSWERS_KEY, JSON.stringify(answers));
}

// Forgets the answers to the given questions, so they can be tried again.
export function clearAnswers(questionIds: string[]) {
  const answers = parseAnswers(readStorage(ANSWERS_KEY));
  for (const questionId of questionIds) {
    delete answers[questionId];
  }
  writeStorage(ANSWERS_KEY, JSON.stringify(answers));
}

// Counts how many questions of one topic have an answer saved.
export function countAnsweredInTopic(answers: SavedAnswers, topicSlug: string): number {
  let answeredCount = 0;
  for (const questionId of Object.keys(answers)) {
    if (questionId.startsWith(`${topicSlug}:`)) {
      answeredCount = answeredCount + 1;
    }
  }
  return answeredCount;
}

// ---------------------------------------------------------------- study plan

// Which blocks of tonight's plan are ticked.
export function useTickedPlanBlocks(): number[] {
  const rawText = useSyncExternalStore(
    subscribe,
    () => readStorage(PLAN_KEY),
    () => null,
  );
  return parsePlan(rawText);
}

// Ticks a plan block, or unticks it if it was already ticked.
export function togglePlanBlock(blockIndex: number) {
  const tickedBlocks = parsePlan(readStorage(PLAN_KEY));
  const position = tickedBlocks.indexOf(blockIndex);
  if (position === -1) {
    tickedBlocks.push(blockIndex);
  } else {
    tickedBlocks.splice(position, 1);
  }
  writeStorage(PLAN_KEY, JSON.stringify(tickedBlocks));
}

// ---------------------------------------------------------------- last topic

// The slug of the topic the student opened most recently, or null.
export function useLastTopic(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => readStorage(LAST_TOPIC_KEY),
    () => null,
  );
}

// Remembers the topic the student is on, for the "Continue" button.
export function setLastTopic(topicSlug: string) {
  if (readStorage(LAST_TOPIC_KEY) !== topicSlug) {
    writeStorage(LAST_TOPIC_KEY, topicSlug);
  }
}
