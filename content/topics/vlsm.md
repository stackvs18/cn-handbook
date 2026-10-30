## What this sum is

An organisation (or ISP) owns one big block and has to hand smaller blocks to departments or customers that need different sizes. Giving each one a block of a different size is called **VLSM** (Variable Length Subnet Masking). This is a 3–4 mark sum: the T2 paper asked it as Q4.1 (the Jio question).

## The method

1. **Size each request**: round (hosts + 2) up to a power of two. If the question says "addresses", round the address count up. That is the **block size**.
2. **Prefix** = 32 − log₂(block size). Write the mask too.
3. **Sort largest first** (unless the question says "in that order").
4. **Allocate**: each block starts at the next free address that is a **multiple of its own size**. Last address = start + block − 1.
5. **Answer what was asked**: start, end, mask, broadcast, wasted addresses, addresses left.

| Block size | Host bits | Prefix | Mask |
|---|---|---|---|
| 16 | 4 | /28 | 255.255.255.240 |
| 32 | 5 | /27 | 255.255.255.224 |
| 64 | 6 | /26 | 255.255.255.192 |
| 128 | 7 | /25 | 255.255.255.128 |
| 256 | 8 | /24 | 255.255.255.0 |
| 512 | 9 | /23 | 255.255.254.0 |
| 1024 | 10 | /22 | 255.255.252.0 |
| 2048 | 11 | /21 | 255.255.248.0 |
| 4096 | 12 | /20 | 255.255.240.0 |
| 8192 | 13 | /19 | 255.255.224.0 |

> In the 3rd octet, a block of 256 addresses = 1 step, 512 = 2 steps, 1024 = 4 steps, 4096 = 16 steps, 8192 = 32 steps. Divide the block size by 256 to get the step.

## Groups of customers (T2 paper Q4.1)

**Ex 1.** Jio has **172.20.0.0/16** (65,536 addresses). Group 1: 32 customers × 512 addresses. Group 2: 64 customers × 256 addresses. Group 3: 128 customers × 128 addresses. Find each group's start, end and mask, and the addresses left.

Group 1: 512 = 2⁹ → **/23**, mask **255.255.254.0**. Each customer takes 2 steps of the 3rd octet. 32 customers × 512 = 16,384 addresses.
- Customer 1: 172.20.0.0/23 – 172.20.1.255
- Customer 2: 172.20.2.0/23 – 172.20.3.255
- …
- Customer 32: 172.20.62.0/23 – 172.20.63.255
- Group range: **172.20.0.0 – 172.20.63.255**

Group 2: 256 = 2⁸ → **/24**, mask **255.255.255.0**. 64 × 256 = 16,384.
- Customer 1: 172.20.64.0/24 – 172.20.64.255
- Customer 2: 172.20.65.0/24 – 172.20.65.255
- …
- Customer 64: 172.20.127.0/24 – 172.20.127.255
- Group range: **172.20.64.0 – 172.20.127.255**

Group 3: 128 = 2⁷ → **/25**, mask **255.255.255.128**. 128 × 128 = 16,384.
- Customer 1: 172.20.128.0/25 – 172.20.128.127
- Customer 2: 172.20.128.128/25 – 172.20.128.255
- …
- Customer 128: 172.20.191.128/25 – 172.20.191.255
- Group range: **172.20.128.0 – 172.20.191.255**

Addresses used = 16,384 × 3 = 49,152. **Left = 65,536 − 49,152 = 16,384** (172.20.192.0 – 172.20.255.255).

**Ex 2.** (PB Q253) ISP block **190.100.0.0/16**. Group 1: 64 customers × 256. Group 2: 128 × 128. Group 3: 128 × 64.

| Group | Each gets | Prefix | Total | Range |
|---|---|---|---|---|
| 1 | 256 | /24 | 64 × 256 = 16,384 | 190.100.0.0 – 190.100.63.255 |
| 2 | 128 | /25 | 128 × 128 = 16,384 | 190.100.64.0 – 190.100.127.255 |
| 3 | 64 | /26 | 128 × 64 = 8,192 | 190.100.128.0 – 190.100.159.255 |

Used = 40,960. **Left = 65,536 − 40,960 = 24,576**.

## Subnets with host counts

**Ex 3.** (PB Q248) 223.1.17.0/24 must hold Subnet 1 (60 hosts), Subnet 2 (90 hosts) and Subnet 3 (12 hosts).

Step 1: sizes. Subnet 2: 2⁷ − 2 = 126 ≥ 90 → /25. Subnet 1: 2⁶ − 2 = 62 ≥ 60 → /26. Subnet 3: 2⁴ − 2 = 14 ≥ 12 → /28.

Step 2: allocate largest first.

| Subnet | Network address | Prefix | Mask | Broadcast | Usable hosts |
|---|---|---|---|---|---|
| 2 | 223.1.17.0 | /25 | 255.255.255.128 | 223.1.17.127 | 126 |
| 1 | 223.1.17.128 | /26 | 255.255.255.192 | 223.1.17.191 | 62 |
| 3 | 223.1.17.192 | /28 | 255.255.255.240 | 223.1.17.207 | 14 |

**Ex 4.** (PB Q255) 11.12.13.14/8 is one address of the network → network ID **11.0.0.0/8**. Subnets need 3998, 1589 and 189 hosts. Allocate the largest first.

| Hosts | Calculation | Prefix | Mask | Network | Broadcast | Wasted |
|---|---|---|---|---|---|---|
| 3998 | 2¹² − 2 = 4094 | /20 | 255.255.240.0 | 11.0.0.0 | 11.0.15.255 | 4094 − 3998 = 96 |
| 1589 | 2¹¹ − 2 = 2046 | /21 | 255.255.248.0 | 11.0.16.0 | 11.0.23.255 | 2046 − 1589 = 457 |
| 189 | 2⁸ − 2 = 254 | /24 | 255.255.255.0 | 11.0.24.0 | 11.0.24.255 | 254 − 189 = 65 |

Total wasted = 96 + 457 + 65 = **618**.

## Organisations with address counts

**Ex 5.** (PB Q249) Consecutive addresses from **198.16.0.0**. A needs 4000, B 2000, C 4000, D 8000. Give first address, last address and mask.

Sizes: A 4000 → 4096 (/20). B 2000 → 2048 (/21). C 4000 → 4096 (/20). D 8000 → 8192 (/19).

The class method sorts largest first: **D → A → C → B**.

| Org | Size | Mask | First | Last |
|---|---|---|---|---|
| D | 8192 | /19 (255.255.224.0) | 198.16.0.0 | 198.16.31.255 |
| A | 4096 | /20 (255.255.240.0) | 198.16.32.0 | 198.16.47.255 |
| C | 4096 | /20 | 198.16.48.0 | 198.16.63.255 |
| B | 2048 | /21 (255.255.248.0) | 198.16.64.0 | 198.16.71.255 |

> If the examiner insists on the given order (A, B, C, D), each block still has to start on a multiple of its own size: A 198.16.0.0–15.255, B 198.16.16.0–23.255, C 198.16.32.0–47.255 (24 is not a multiple of 16), D 198.16.64.0–95.255 (48 is not a multiple of 32). The class notes use largest first, so write that unless told otherwise.

## Exam traps

- A block must start on a **multiple of its own size**. That is why allocating largest first never leaves gaps.
- "Customers × addresses each" gives the group total. Do not forget to multiply.
- "Addresses remaining" = total block − everything allocated.
