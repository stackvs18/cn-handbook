## Distance vector routing in plain words

No router sees the whole map. Each router keeps a **distance vector**: a table that says, for every destination, the **cost** to get there and the **next hop** (which neighbour to hand the packet to).

- Each router sends its whole table **only to its neighbours**, **periodically** (RIP: every 30 seconds).
- When a router receives a neighbour's table, it checks whether going through that neighbour is cheaper than what it has now.
- After a few rounds, every table stops changing. The network has **converged**.

The update rule is the **Bellman–Ford equation**:

```
D(X → Y) = min over every neighbour V of [ cost(X, V) + D(V → Y) ]
next hop = the V that gave the minimum
```

In words: "My cost to Y = the cheapest of (cost to my neighbour + what that neighbour says its cost to Y is)."

**RIP** (Routing Information Protocol) is the real-world distance vector protocol.

## The table method

1. **Step 1 (initial tables)**: draw a table for every router with columns **Dest | Dist | Next**. Itself = 0, direct neighbours = link cost, everyone else = ∞ with next "–".
2. **Step 2 (exchange)**: each router receives its neighbours' Step 1 tables. For each destination, add the link cost to each neighbour's number and keep the **minimum**. Write the new table.
3. **Step 3 onward**: repeat with the Step 2 tables until nothing changes.
4. If the question says "from node A", the answer is A's final table.

> Write the neighbours' vectors as small columns beside the router (this is how the class notes do it). Then add the link cost to each column and take the minimum row by row.

## Class example (5 routers)

Edges: **N1–N2 1, N2–N3 6, N2–N5 3, N3–N4 2, N4–N5 4**.

```
 N5 ──3── N2 ──1── N1
 │        │
 4        6
 │        │
 N4 ──2── N3
```

**Step 1: initial tables** (distance to N1, N2, N3, N4, N5)

| Router | N1 | N2 | N3 | N4 | N5 | Neighbours |
|---|---|---|---|---|---|---|
| N1 | 0 | 1 | ∞ | ∞ | ∞ | N2 |
| N2 | 1 | 0 | 6 | ∞ | 3 | N1, N3, N5 |
| N3 | ∞ | 6 | 0 | 2 | ∞ | N2, N4 |
| N4 | ∞ | ∞ | 2 | 0 | 4 | N3, N5 |
| N5 | ∞ | 3 | ∞ | 4 | 0 | N2, N4 |

**Step 2: N1 updates** from N2's vector (1, 0, 6, ∞, 3) + link cost 1 = (2, 1, 7, ∞, 4).

| Dest | Dist | Next |
|---|---|---|
| N1 | 0 | N1 |
| N2 | 1 | N2 |
| N3 | 7 | N2 |
| N4 | ∞ | – |
| N5 | 4 | N2 |

**Step 2: N2 updates** from N1 (0, 1, ∞, ∞, ∞) + 1, N3 (∞, 6, 0, 2, ∞) + 6, N5 (∞, 3, ∞, 4, 0) + 3. To N4: min(∞, 6 + 2, 3 + 4) = **7 via N5**. Everything else stays: N2 = (1, 0, 6, 7, 3).

**Step 2: the others** in the same way: N3 = (7 via N2, 6, 0, 2, 6 via N4). N4 = (∞, 7 via N5, 2, 0, 4). N5 = (4 via N2, 3, 6 via N4, 4, 0).

**Step 3**: one more exchange. Only N1 → N4 and N4 → N1 change: N1 to N4 = 1 + 7 = **8 via N2**, and N4 to N1 = 4 + 4 = **8 via N5**.

**Final (stable) tables**

| Router | N1 | N2 | N3 | N4 | N5 |
|---|---|---|---|---|---|
| N1 | 0 | 1 | 7 | 8 | 4 |
| N2 | 1 | 0 | 6 | 7 | 3 |
| N3 | 7 | 6 | 0 | 2 | 6 |
| N4 | 8 | 7 | 2 | 0 | 4 |
| N5 | 4 | 3 | 6 | 4 | 0 |

These are exactly the vectors given in **PB Q285**.

## PB Q285: a link cost changes

The N2–N3 link cost drops from 6 to 2. Only N2 and N3 change that one entry first: N2's vector becomes (1, 0, **2**, 7, 3). In the next round N3 receives N2's and N4's vectors:

- To N1: min(2 + 1, 2 + 8) = **3**
- To N2: min(2 + 0, 2 + 7) = **2**
- To N3: **0**
- To N4: min(2 + 7, 2 + 0) = **2**
- To N5: min(2 + 3, 2 + 4) = **5**

New vector at N3 = **(3, 2, 0, 2, 5)**.

## PB Q282 (u, v, x, y, z)

Edges: u–v 1, u–y 2, v–x 3, v–z 6, x–y 3, x–z 2.

| Router | u | v | x | y | z |
|---|---|---|---|---|---|
| u (final) | 0 | 1 (v) | 4 (v) | 2 (y) | 6 (v) |
| v | 1 | 0 | 3 | 3 (u) | 5 (x) |
| x | 4 (v) | 3 | 0 | 3 | 2 |
| y | 2 | 3 (u) | 3 | 0 | 5 (x) |
| z | 6 (x) | 5 (x) | 2 | 5 (x) | 0 |

u reaches z through v–x–z: 1 + 3 + 2 = **6**. The direct u–v–z route costs 7.

## T2 paper Q4.2 (from node A)

Edges as read from the paper: A–B 2, B–C 3, A–D 5, B–E 4, D–E 1, E–F 2.

```
 A ──2── B ──3── C
 │       │
 5       4
 │       │
 D ──1── E ──2── F
```

**Step 1** (A's initial table): A 0, B 2 (B), C ∞, D 5 (D), E ∞, F ∞.

**Step 2**: A gets B's vector (A 2, B 0, C 3, D ∞, E 4, F ∞) and D's vector (A 5, B ∞, C ∞, D 0, E 1, F ∞).
- C = 2 + 3 = **5 via B**
- E = min(2 + 4, 5 + 1) = **6** (via B or D)
- F still ∞ (no neighbour knows F yet)

**Step 3**: B now knows F = 4 + 2 = 6 and D knows F = 1 + 2 = 3. A: F = min(2 + 6, 5 + 3) = **8**.

| Dest | Dist | Next |
|---|---|---|
| A | 0 | A |
| B | 2 | B |
| C | 5 | B |
| D | 5 | D |
| E | 6 | B (or D) |
| F | 8 | B (or D) |

> The A–D cost in the photo of the paper looks like 5. If your copy shows a different number, the method is the same. Just redo the additions.

## Count to infinity

When a link breaks, the bad news spreads slowly. Suppose A–B–C is a line and A's link to B breaks. B looks for another route to A and sees C claiming "A is 2 away" (which was through B itself). B sets A = 3. Then C updates to 4, B to 5, and so on, counting up toward infinity. This is the **count-to-infinity problem** (PB Q262). Fixes: **split horizon**, **poison reverse**, and RIP's limit of **16 = infinity**.

## Exam traps

- Use the neighbours' tables from the **previous** step, not ones you just updated.
- A router only talks to **neighbours**.
- Updates are **periodic** (PB Q274's answer).
- Count to infinity belongs to **distance vector**, not link state.
