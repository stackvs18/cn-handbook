"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search-dialog";
import { TopicNav } from "./topic-nav";

const HEADER_LINKS = [
  { label: "Topics", href: "/#topics" },
  { label: "All MCQs", href: "/questions" },
  { label: "Mock test", href: "/mock" },
  { label: "Sums sheet", href: "/formulas" },
  { label: "Mistakes", href: "/mistakes" },
];

// The sticky bar at the top: logo, page links, search, theme switch,
// and on phones a menu button that slides out the topic list.
export function SiteHeader({ questionCounts }: { questionCounts: Record<string, number> }) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keyboard shortcuts: Ctrl/Cmd + K or "/" opens search, Escape closes the menu
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((wasOpen) => !wasOpen);
      } else if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setIsSearchOpen(true);
      } else if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // While the phone menu is open, stop the page behind it from scrolling
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="icon-btn -ml-2 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open topics"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>

          <Link href="/" className="flex items-center gap-2.5" aria-label="CN Handbook home">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-mono text-[0.68rem] font-bold text-accent-fg">
              CN
            </span>
            <span className="hidden text-[0.95rem] font-semibold tracking-tight sm:inline">
              CN Handbook
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 text-[0.85rem] lg:flex" aria-label="Primary">
            {HEADER_LINKS.map((headerLink) => (
              <Link
                key={headerLink.href}
                href={headerLink.href}
                className="nav-link"
                aria-current={pathname === headerLink.href ? "page" : undefined}
              >
                {headerLink.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[0.82rem] text-faint transition-colors hover:border-line-strong hover:text-muted sm:w-56"
              aria-label="Search"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="kbd ml-auto hidden sm:inline-block">Ctrl K</kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close topics"
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="drawer absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col border-r border-line bg-bg">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-[0.95rem] font-semibold">
                CN Handbook
              </Link>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close topics"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-5">
              <TopicNav questionCounts={questionCounts} onNavigate={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
