# CN Handbook

A study site for the LJU Semester V **Computer Networks** T2 test (50 marks: 20 MCQ, 5 theory, 25 numericals). It covers Units 5–10 from scratch, plus a fast revision of Units 1–4 (about 6 MCQs come from there).

- **Learn**: a guide for each of the 19 topics, starting from zero, with every practice-book and paper sum worked step by step.
- **Practice**: every practice-book MCQ for Units 1–10, the T2 paper's MCQs, and extra sum drills. Tap an option to see right or wrong plus the working.
- **All MCQs**: the whole bank on one page as an answer key, with switches to hide answers or explanations.
- **Mock test**: 20, 40 or 60 random questions, timed or untimed, with a unit-by-unit breakdown. Pick all units, Units 5–10, or Units 1–4.
- **Mistakes**: every wrong answer in one list, ready to retry.
- **Sums sheet**: the method for every sum type on one page, hex/binary tables, traps and exam strategy.
- **Search**: Ctrl K or `/`.

Built with Next.js 16 (App Router) and Tailwind CSS 4. Every page is statically generated. Progress is saved in the browser (localStorage). Theme: warm black with a clay-orange accent (light mode available from the toggle).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Project layout

```text
app/
  page.tsx                     home: hero, study plan, topics by unit, where to start
  (book)/learn/[slug]/         a topic's guide
  (book)/practice/[slug]/      a topic's MCQs
  (book)/formulas/             sums sheet: methods, hex toolkit, traps, strategy
  (book)/mistakes/             wrong answers to retry
  questions/                   answer key for every MCQ
  mock/                        timed mock test
  globals.css                  theme tokens (warm black + orange), question cards, guide typography
content/topics/<slug>.md       the 19 guides
content/questions/<slug>.json  questions per topic
content/extras/*.md            sums sheet cards, toolkit, traps, strategy
lib/topics.ts                  units and topics
lib/plan.ts                    study plan
```

## Editing content

A guide is `content/topics/<slug>.md`. Use `##` for sections and `###` below that. A paragraph starting with `**Ex 1.**` is drawn as a worked-example box. A `> quote` is a callout.

Questions are `content/questions/<slug>.json`:

```json
{
  "number": 1,
  "question": "UDP packets have a fixed-size header of ______ bytes.",
  "options": [
    { "letter": "a", "text": "16" },
    { "letter": "b", "text": "8" },
    { "letter": "c", "text": "40" },
    { "letter": "d", "text": "32" }
  ],
  "answer": "b",
  "explanation": "Four 2-byte fields = **8 bytes**.",
  "source": "PB Q336",
  "bookKeyCorrected": false
}
```

## Sources

- LJU CN Practice Book, Sem V ODD-2025 (questions tagged "PB Q*n*").
- Class notes (tagged "Class notes").
- T2 non-internship paper, 27 Oct 2026 (tagged "Paper T2").
- LJU Sem V Computer Networks syllabus and T1/T2 marks distribution.
