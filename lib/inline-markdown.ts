// Questions and explanations only use a little Markdown: **bold**, *italic* and `code`.
// This turns those into HTML and escapes everything else so it shows as plain text.

// Matches *italic* only when the stars wrap a word, so maths like "78*3945"
// or "5+9+*+7" stays exactly as written.
const ITALIC_PATTERN = /(?<![\w*])\*(?=[A-Za-z(])([^*\n]+?)(?<!\s)\*(?![\w*])/g;

// Converts one line of question Markdown into safe HTML.
export function renderInlineMarkdown(markdownText: string): string {
  // Step 1: escape characters that mean something in HTML
  let html = markdownText;
  html = html.replace(/&/g, "&amp;");
  html = html.replace(/</g, "&lt;");
  html = html.replace(/>/g, "&gt;");

  // Step 2: `code`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Step 3: **bold** (before italic, so the double stars aren't read as two italics)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Step 4: *italic*
  html = html.replace(ITALIC_PATTERN, "<em>$1</em>");

  return html;
}

// Removes HTML tags, for search and for measuring how long an option is.
export function htmlToPlainText(html: string): string {
  let plainText = html.replace(/<[^>]+>/g, "");
  plainText = plainText.replace(/&lt;/g, "<");
  plainText = plainText.replace(/&gt;/g, ">");
  plainText = plainText.replace(/&amp;/g, "&");
  return plainText;
}
