"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CircleHelp, CornerDownLeft, FileText, Hash, Search } from "lucide-react";
import type { SearchEntry } from "@/lib/types";

type SearchResult = SearchEntry & { score: number };

// Pages and topics rank above guide sections, which rank above single questions
const KIND_BONUS: Record<SearchEntry["kind"], number> = {
  page: 8,
  topic: 6,
  section: 3,
  question: 0,
};

let indexPromise: Promise<SearchEntry[]> | null = null;

// Downloads the search index once and keeps it for the rest of the visit.
function loadSearchIndex(): Promise<SearchEntry[]> {
  if (indexPromise === null) {
    indexPromise = fetch("/search-index.json")
      .then((response) => response.json() as Promise<SearchEntry[]>)
      .catch(() => {
        indexPromise = null;
        return [];
      });
  }
  return indexPromise;
}

// Scores how well some text matches every search word. 0 means "not a match".
// A word at the very start scores 3, at the start of a word 2, inside a word 1.
function scoreText(text: string, searchWords: string[]): number {
  const lowerText = text.toLowerCase();
  let totalScore = 0;
  for (const word of searchWords) {
    const position = lowerText.indexOf(word);
    if (position === -1) {
      return 0;
    }
    if (position === 0) {
      totalScore = totalScore + 3;
    } else if (/\W/.test(lowerText[position - 1])) {
      totalScore = totalScore + 2;
    } else {
      totalScore = totalScore + 1;
    }
  }
  return totalScore;
}

// Finds the best matches for what the student typed.
function findResults(searchIndex: SearchEntry[], query: string): SearchResult[] {
  const searchWords = query.toLowerCase().split(/\s+/).filter((word) => word.length > 0);

  // Nothing typed yet: show the pages and topics as a starting list
  if (searchWords.length === 0) {
    const startingList: SearchResult[] = [];
    for (const entry of searchIndex) {
      if (entry.kind === "page" || entry.kind === "topic") {
        startingList.push({ ...entry, score: 0 });
      }
    }
    return startingList.slice(0, 10);
  }

  const results: SearchResult[] = [];
  for (const entry of searchIndex) {
    const titleScore = scoreText(entry.title, searchWords);
    const fullScore = scoreText(entry.searchText, searchWords);
    if (fullScore > 0) {
      results.push({ ...entry, score: titleScore * 3 + fullScore + KIND_BONUS[entry.kind] });
    }
  }
  results.sort((first, second) => second.score - first.score);
  return results.slice(0, 40);
}

// Picks the small icon shown next to each result.
function ResultIcon({ kind }: { kind: SearchEntry["kind"] }) {
  if (kind === "page") return <ArrowUpRight size={15} className="shrink-0 text-faint" />;
  if (kind === "topic") return <FileText size={15} className="shrink-0 text-faint" />;
  if (kind === "section") return <Hash size={15} className="shrink-0 text-faint" />;
  return <CircleHelp size={15} className="shrink-0 text-faint" />;
}

// The Ctrl K search box. Searches pages, topics, guide sections and every question.
export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // When the dialog opens: load the index, focus the box, lock page scrolling
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let wasCancelled = false;
    loadSearchIndex().then((loadedIndex) => {
      if (!wasCancelled) {
        setSearchIndex(loadedIndex);
      }
    });
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      wasCancelled = true;
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const results = useMemo(() => findResults(searchIndex, query), [searchIndex, query]);

  // Opens a result and resets the box for next time
  const openResult = useCallback(
    (result: SearchResult | undefined) => {
      if (result === undefined) {
        return;
      }
      onClose();
      setQuery("");
      setActiveIndex(0);
      router.push(result.href);
    },
    [onClose, router],
  );

  // Keep the highlighted result visible while moving with the arrow keys
  useEffect(() => {
    const activeRow = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    activeRow?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the handbook"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => Math.min(current + 1, results.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            openResult(results[activeIndex]);
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search topics, sums and questions…"
            className="h-13 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-faint"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="kbd">esc</kbd>
        </div>
        <ul ref={listRef} className="max-h-[min(60vh,440px)] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-faint">
              {searchIndex.length > 0 ? `No results for “${query}”. Try one word, like “train”.` : "Loading…"}
            </li>
          )}
          {results.map((result, resultIndex) => (
            <li key={result.href + result.title} role="option" aria-selected={resultIndex === activeIndex} data-index={resultIndex}>
              <button
                type="button"
                onMouseMove={() => setActiveIndex(resultIndex)}
                onClick={() => openResult(result)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                  resultIndex === activeIndex ? "bg-hover" : ""
                }`}
              >
                <ResultIcon kind={result.kind} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9rem] text-fg">{result.title}</span>
                  <span className="block truncate text-[0.75rem] text-faint">{result.context}</span>
                </span>
                {resultIndex === activeIndex && <CornerDownLeft size={14} className="shrink-0 text-faint" />}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[0.7rem] text-faint">
          <span>
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move
          </span>
          <span>
            <kbd className="kbd">↵</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
