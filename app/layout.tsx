import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { getQuestionCounts } from "@/lib/questions";
import "./globals.css";

const sans = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "CN Handbook: Computer Networks T2 from scratch",
    template: "%s · CN Handbook",
  },
  description:
    "Computer Networks (LJU Sem V, T2) taught from scratch: network layer, routing, TCP/UDP, application layer and tools. Every practice-book MCQ with answers, every sum type solved step by step, mock tests and a sums sheet.",
  keywords: [
    "Computer Networks",
    "subnetting",
    "fragmentation",
    "TCP",
    "UDP",
    "LJU",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1915" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
  ],
};

// Applies the saved theme before first paint, so there is no flash. Dark is the default.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The header's phone menu shows "answered/total" per topic, so it needs the totals
  const questionCounts = getQuestionCounts();

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader questionCounts={questionCounts} />
        {children}
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-8 text-[0.8rem] text-faint sm:flex-row sm:justify-between sm:px-8">
            <p className="max-w-[72ch]">
              Built from the LJU Sem V Computer Networks practice book (ODD-2025), class notes, the T2
              non-internship paper (27 Oct 2026) and the LJU syllabus.
            </p>
            <p>Your progress is saved in this browser only.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
