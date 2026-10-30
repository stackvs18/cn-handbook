## Link state routing in plain words

Every router does three things:

1. **Learns its neighbours** and the cost of the link to each (by sending hello packets).
2. **Floods** a small packet called an LSP (link state packet) to **every** router in the network. It says "I am X, these are my neighbours and their costs".
3. Once it has every LSP it knows the **whole map**, so it runs **Dijkstra's algorithm** to find the shortest path to every other router.

> Link state: tell **everyone** about your **neighbours**. Distance vector: tell your **neighbours** about **everyone**. This line answers PB Q276.

**OSPF** (Open Shortest Path First) is the real-world link state protocol. It is used inside one organisation (intradomain). The algorithm it uses is **Dijkstra**.

| | Link state (OSPF) | Distance vector (RIP) |
|---|---|---|
| Each router knows | The whole map | Only distances via neighbours |
| Sends | Its neighbour costs | Its full routing table |
| Sends to | Every router (flooding) | Only neighbours |
| When | When something changes | Periodically |
| Algorithm | Dijkstra | Bellman–Ford |
| Problems | More memory and CPU | Slow convergence, count to infinity |

## Dijkstra's table method

This is what the 3–5 mark question wants: a table with one column per node and one row per step.

1. **Row 1**: the source is 0 (box it). Each direct neighbour gets its link cost. Everything else is ∞. Write the "via" node beside each cost.
2. **Pick** the smallest value that is not boxed yet and **box** it. That node's distance is now final.
3. **Relax**: from the node you just boxed, for each neighbour that is not boxed: new cost = boxed node's cost + link cost. If it is **smaller** than what the column holds, replace it (and its "via").
4. **Repeat** steps 2–3 until every node is boxed.
5. **Answer**: list each node with its cost and full path. Get the path by following the "via" nodes backwards.

> Ties: if two nodes have the same smallest value, pick either one. The final costs come out the same.

## The paper question (PB Q283 = T2 paper Q4.5)

Edges: A–B 2, A–C 5, A–D 1, B–C 3, B–D 2, C–D 3, C–E 1, C–F 5, D–E 1, E–F 2. Source **A**.

| Node | Neighbours (cost) |
|---|---|
| A | B 2, C 5, D 1 |
| B | A 2, C 3, D 2 |
| C | A 5, B 3, D 3, E 1, F 5 |
| D | A 1, B 2, C 3, E 1 |
| E | C 1, D 1, F 2 |
| F | C 5, E 2 |

| Step | Boxed | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 0 | A | 2 (A) | 5 (A) | **1 (A)** | ∞ | ∞ |
| 1 | A, D | **2 (A)** | 4 (D) | | 2 (D) | ∞ |
| 2 | A, D, B | | 4 (D) | | **2 (D)** | ∞ |
| 3 | A, D, B, E | | **3 (E)** | | | 4 (E) |
| 4 | A, D, B, E, C | | | | | **4 (E)** |

| Node | Cost | Path |
|---|---|---|
| B | 2 | A–B |
| C | 3 | A–D–E–C |
| D | 1 | A–D |
| E | 2 | A–D–E |
| F | 4 | A–D–E–F |

## Class notes graph (A to H)

Edges: A–B 8, A–C 2, A–D 5, B–D 2, B–F 13, C–D 2, C–E 5, D–E 1, D–F 6, D–G 3, E–G 1, F–G 2, F–H 3, G–H 6. Source **A**.

| Boxed | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| A | 8 | **2** | 5 | ∞ | ∞ | ∞ | ∞ |
| C | 8 | | **4** | 7 | ∞ | ∞ | ∞ |
| D | 6 | | | **5** | 10 | 7 | ∞ |
| E | **6** | | | | 10 | 6 | ∞ |
| B | | | | | 10 | **6** | ∞ |
| G | | | | | **8** | | 12 |
| F | | | | | | | **11** |

Result: A→A 0, C 2 (A), D 4 (C), E 5 (D), B 6 (D), G 6 (E), F 8 (G), H 11 (F). Path to H: **A–C–D–E–G–F–H = 11**.

## Every practice-book graph, answered

**Ex 1.** (PB Q277) Edges 0–1 2, 0–2 6, 1–3 5, 2–3 8, 3–4 10, 3–5 15, 4–5 6, 4–6 2, 5–6 6. Source 0. Order boxed: 0, 1 (2), 2 (6), 3 (7), 4 (17), 6 (19), 5 (22). Paths: 1 = 0–1 (2). 2 = 0–2 (6). 3 = 0–1–3 (7). 4 = 0–1–3–4 (17). 6 = 0–1–3–4–6 (19). 5 = 0–1–3–5 (**22**, because 3–4–5 gives 23).

**Ex 2.** (PB Q278) Edges A–B 3, A–D 3, A–E 4, B–C 5, B–D 2, D–E 2, D–F 2, E–F 1. Source A. Results: B 3 (A–B), D 3 (A–D), E 4 (A–E), F 5 (A–D–F or A–E–F), C **8** (A–B–C).

**Ex 3.** (PB Q281) Edges x–z 8, x–y 6, x–v 3, x–w 6, y–z 12, y–v 8, y–t 7, v–t 4, v–u 3, v–w 4, w–u 3, t–u 2. Source x.

| Boxed | y | z | v | w | t | u |
|---|---|---|---|---|---|---|
| x | 6 | 8 | **3** | 6 | ∞ | ∞ |
| v | **6** | 8 | | 6 | 7 | 6 |
| y | | 8 | | **6** | 7 | 6 |
| w | | 8 | | | 7 | **6** |
| u | | 8 | | | **7** | |
| t | | **8** | | | | |

Results: v 3 (x–v), y 6 (x–y), w 6 (x–w), u 6 (x–v–u), t 7 (x–v–t), z 8 (x–z).

**Ex 4.** (PB Q284) Edges A–C 3, A–D 8, B–E 2, C–E 1, C–F 6, D–E 2. Source A.

| Boxed | B | C | D | E | F | Path |
|---|---|---|---|---|---|---|
| A | ∞ | **3** | 8 | ∞ | ∞ | A |
| C | ∞ | | 8 | **4** | 9 | A–C |
| E | **6** | | 6 | | 9 | A–C–E |
| B | | | **6** | | 9 | A–C–E–B |
| D | | | | | **9** | A–C–E–D |
| F | | | | | | A–C–F |

**Ex 5.** (PB Q295) Edges A–B 4, A–D 6, B–C 4, B–F 12, B–G 22, C–D 3, C–E 14, C–G 16, E–F 8, E–G 6, F–G 12. Source A.

| Boxed | B | C | D | E | F | G | Path |
|---|---|---|---|---|---|---|---|
| A | **4** | ∞ | 6 | ∞ | ∞ | ∞ | A |
| B | | 8 | **6** | ∞ | 16 | 26 | A–B |
| D | | **8** | | ∞ | 16 | 26 | A–D |
| C | | | | 22 | **16** | 24 | A–B–C |
| F | | | | **22** | | 24 | A–B–F |
| E | | | | | | **24** | A–B–C–E |
| G | | | | | | | A–B–C–G |

## How to present it in the exam

1. Copy the graph and write the source.
2. Draw the table: one column per node, plus a "path" column if there is room.
3. Box the chosen value in each row. Write "(via X)" beside every number you change.
4. Finish with a small result table: node, cost, path.

> Marks come from the table. Even if one value goes wrong, a clean table with the method earns most of the marks.

## Exam traps

- Box a node **only once**. After it is boxed, never update it.
- Update a value only if the new cost is **strictly smaller**.
- Link state uses **Dijkstra**. OSPF is the protocol, not the algorithm.
