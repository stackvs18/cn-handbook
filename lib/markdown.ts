// Turns the guide files in content/ into HTML. Server only (it reads files).
//
// Pipeline: Markdown text -> remark (Markdown tree) -> rehype (HTML tree) -> HTML string.

import fs from "node:fs/promises";
import path from "node:path";
import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit, SKIP } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, Root } from "hast";
import { TOPICS } from "./topics";

export type Heading = { id: string; text: string };

export type RenderedMarkdown = {
  html: string;
  headings: Heading[];
};

export type FormulaGroup = {
  title: string;
  topicSlug: string | null;
  html: string;
};

const CONTENT_FOLDER = path.join(process.cwd(), "content");

// Small finishing touches on the HTML tree:
// - wraps every table in a scrollable box so wide tables don't break phones
// - gives worked examples ("Ex 1.", "Type 2.") the "example" class
// - collects the ## headings for search
const rehypeStudyBlocks: Plugin<[{ headings: Heading[] }], Root> = (options) => {
  return function transform(tree) {
    visit(tree, "element", function (node, index, parent) {
      // Tables: put them inside <div class="table-wrap">
      if (node.tagName === "table" && parent !== undefined && index !== undefined) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrap"] },
          children: [node],
        };
        parent.children[index] = wrapper;
        return [SKIP, index + 1];
      }

      // Worked examples: a paragraph that starts with bold "Ex " or "Type "
      if (node.tagName === "p") {
        const firstChild = node.children[0];
        if (firstChild !== undefined && firstChild.type === "element" && firstChild.tagName === "strong") {
          const boldText = toString(firstChild);
          if (boldText.startsWith("Ex ") || boldText.startsWith("Type ")) {
            node.properties.className = ["example"];
          }
        }
      }

      // Headings: remember every h2 (rehype-slug already gave it an id)
      if (node.tagName === "h2") {
        options.headings.push({ id: String(node.properties.id), text: toString(node) });
      }
    });
  };
};

// Converts a Markdown string into HTML and returns its section headings too.
export async function renderMarkdown(markdownText: string): Promise<RenderedMarkdown> {
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks) // a single line break in the file stays a line break on the page
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStudyBlocks, { headings: headings })
    .use(rehypeStringify)
    .process(markdownText);
  return { html: String(file), headings: headings };
}

// Renders the learning guide for one topic (content/topics/<slug>.md).
export async function renderTopicGuide(topicSlug: string): Promise<RenderedMarkdown> {
  const filePath = path.join(CONTENT_FOLDER, "topics", `${topicSlug}.md`);
  const markdownText = await fs.readFile(filePath, "utf8");
  return renderMarkdown(markdownText);
}

// Renders one of the extra pages: toolkit, traps or strategy (content/extras/<name>.md).
export async function renderExtra(name: "toolkit" | "traps" | "strategy"): Promise<RenderedMarkdown> {
  const filePath = path.join(CONTENT_FOLDER, "extras", `${name}.md`);
  const markdownText = await fs.readFile(filePath, "utf8");
  return renderMarkdown(markdownText);
}

// The formula sheet file has one "## Title" per topic group. This splits it into
// separate cards, and links each card to its topic when the titles match.
const FORMULA_GROUP_TOPIC: Record<string, string> = {
  "UDP header dump": "udp",
  "TCP header dump": "tcp",
  "rwnd and sender window": "congestion",
  "Slow start time": "congestion",
  "TCP Reno events": "congestion",
  "Sliding window rate": "congestion",
  "Classful basics": "classful",
  "Subnet: network, broadcast, hosts": "subnetting",
  "Subnets and hosts needed": "subnetting",
  "VLSM / block allocation": "vlsm",
  "Fragmentation table": "fragmentation",
  "Fragmentation across links": "fragmentation",
  "Datagram count": "fragmentation",
  "IPv4 header tricks": "ip-headers",
  "Dijkstra / Link state": "link-state",
  "Distance vector": "distance-vector",
  "Units 1–4 quick formulas": "units-1-4",
};

// Reads content/extras/formulas.md and returns one rendered card per "## " section.
export async function getFormulaGroups(): Promise<FormulaGroup[]> {
  const filePath = path.join(CONTENT_FOLDER, "extras", "formulas.md");
  const markdownText = await fs.readFile(filePath, "utf8");

  // Step 1: split the file into sections at every "## " heading
  const sections: { title: string; lines: string[] }[] = [];
  for (const line of markdownText.split("\n")) {
    if (line.startsWith("## ")) {
      sections.push({ title: line.slice(3).trim(), lines: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].lines.push(line);
    }
  }

  // Step 2: render each section's body
  const groups: FormulaGroup[] = [];
  for (const section of sections) {
    const rendered = await renderMarkdown(section.lines.join("\n"));
    const linkedSlug = FORMULA_GROUP_TOPIC[section.title];
    groups.push({
      title: section.title,
      topicSlug: linkedSlug !== undefined ? linkedSlug : null,
      html: rendered.html,
    });
  }
  return groups;
}

// Every topic's guide headings, used by the search index.
export async function getAllGuideHeadings(): Promise<Record<string, Heading[]>> {
  const headingsBySlug: Record<string, Heading[]> = {};
  for (const topic of TOPICS) {
    const rendered = await renderTopicGuide(topic.slug);
    headingsBySlug[topic.slug] = rendered.headings;
  }
  return headingsBySlug;
}
