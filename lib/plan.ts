// Tonight's and tomorrow morning's study plan, in the order that earns marks fastest.

export type PlanLink = { label: string; href: string };

export type PlanBlock = {
  time: string;
  title: string;
  why: string;
  links: PlanLink[];
};

export const STUDY_PLAN: PlanBlock[] = [
  {
    time: "20m",
    title: "UDP header dump, rwnd and window size",
    why: "The easiest marks in the paper. Pure hex-to-decimal and one subtraction.",
    links: [
      { label: "UDP & Header Dumps", href: "/learn/udp" },
      { label: "Flow & Congestion Control", href: "/learn/congestion" },
    ],
  },
  {
    time: "15m",
    title: "Slow start and TCP Reno",
    why: "One worked example (32 KB → 1100 ms) covers the whole question type.",
    links: [{ label: "Flow & Congestion Control", href: "/learn/congestion" }],
  },
  {
    time: "25m",
    title: "Subnetting, then block allocation",
    why: "The block-size trick answers 8+ MCQs and the 4-mark Jio question.",
    links: [
      { label: "Classful Addressing", href: "/learn/classful" },
      { label: "Subnetting & CIDR", href: "/learn/subnetting" },
      { label: "Block Allocation (VLSM)", href: "/learn/vlsm" },
    ],
  },
  {
    time: "15m",
    title: "Fragmentation",
    why: "One table method. The multi-link version came in the T2 paper.",
    links: [{ label: "IP Fragmentation", href: "/learn/fragmentation" }],
  },
  {
    time: "Morning · 1h",
    title: "Every MCQ for Units 5–10",
    why: "14 of the 20 MCQs come word for word from the practice book. Go through All MCQs with answers hidden.",
    links: [
      { label: "All MCQs", href: "/questions" },
      { label: "Mistakes", href: "/mistakes" },
    ],
  },
  {
    time: "Morning · 30m",
    title: "Dijkstra and distance vector",
    why: "4–5 marks each. Once the table method clicks, every graph works the same way.",
    links: [
      { label: "Link State (Dijkstra)", href: "/learn/link-state" },
      { label: "Distance Vector", href: "/learn/distance-vector" },
    ],
  },
  {
    time: "Morning · 20m",
    title: "Units 1–4 quick MCQs",
    why: "About 6 MCQs come from T1. Delays, ALOHA, mesh links, MAC and CRC repeat every year.",
    links: [
      { label: "Networks & Delays", href: "/learn/intro-delays" },
      { label: "ALOHA, CSMA, Ethernet", href: "/learn/mac-sublayer" },
      { label: "Data Link & Errors", href: "/learn/data-link" },
    ],
  },
  {
    time: "Last 10m",
    title: "Sums sheet, then a 20-question mock",
    why: "Read every method once more and walk in warm.",
    links: [
      { label: "Sums sheet", href: "/formulas" },
      { label: "Mock test", href: "/mock" },
    ],
  },
];
