## Why packets get split

Every link has a **maximum transmission unit (MTU)**: the biggest IP datagram (header + data) that fits in one frame on that link. Ethernet's MTU is 1500 bytes. If a router receives a datagram bigger than the next link's MTU, it **fragments** it into smaller datagrams. Fragments are only put back together (**reassembled**) at the **final destination**, never at routers.

If a link's limit is given as a **frame size**, subtract the frame header first: **MTU = max frame size − frame header**.

## The header fields that matter

| Field | Size | What it says |
|---|---|---|
| Identification | 16 bits | Same number in every fragment of one datagram, so the receiver knows they belong together |
| DF (Don't Fragment) | 1 bit | 1 = do not fragment (drop it instead). Fragmentation allowed → **0** |
| MF (More Fragments) | 1 bit | 1 = more fragments follow. **0 on the last fragment** (and on an unfragmented datagram) |
| Fragment offset | 13 bits | Where this fragment's data starts in the original data, **in units of 8 bytes** |
| Total length | 16 bits | This fragment's header + data |

Because the offset counts 8-byte units, **every fragment's data except the last must be a multiple of 8**.

## The method

1. **Data** of the original = total length − 20 (IP header).
2. **Max data per fragment** = MTU − 20, then **round down to a multiple of 8**.
3. **Number of fragments** = data ÷ max, rounded **up**. The last one carries the remainder.
4. For each fragment fill a row:
   - **Total length** = its data + 20
   - **Offset** = (data bytes before it) ÷ 8
   - **MF** = 1, except the last = 0
   - **ID** = the original's ID
   - **DF** = 0

**Ex 1.** (PB Q240, class notes) A 2400-byte datagram with ID 422 goes onto a link with MTU 700. Data = 2400 − 20 = 2380. Max = 700 − 20 = 680 (680 / 8 = 85, already a multiple of 8). Fragments = 2380 / 680 = 3.5 → **4**.

| Fragment | Data bytes | ID | DF | MF | Total length | Offset |
|---|---|---|---|---|---|---|
| 1 | 680 | 422 | 0 | 1 | 700 | 0 |
| 2 | 680 | 422 | 0 | 1 | 700 | 85 |
| 3 | 680 | 422 | 0 | 1 | 700 | 170 |
| 4 | 2380 − 3 × 680 = 340 | 422 | 0 | 0 | 360 | 255 |

> The class notes table writes DF = 1 on the last fragment. That is a slip: DF is "don't fragment", and this datagram **was** fragmented, so DF = 0 in every fragment. It is **MF** that becomes 0 on the last one.

**Ex 2.** (PB Q243) 3200 bytes, MTU 900, ID 512. Data 3180, max 880 (= 110 × 8). 3180 / 880 = 3.6 → **4** fragments.

| Fragment | Data | ID | MF | Total length | Offset |
|---|---|---|---|---|---|
| 1 | 880 | 512 | 1 | 900 | 0 |
| 2 | 880 | 512 | 1 | 900 | 110 |
| 3 | 880 | 512 | 1 | 900 | 220 |
| 4 | 540 | 512 | 0 | 560 | 330 |

**Ex 3.** (class notes) A 3000-byte datagram (20 header + 2980 payload), MTU 500. Max = 480. 2980 / 480 = 6.2 → **7** fragments: six of 480 and one of 100. The last fragment has **MF = 0, offset = 6 × 480 / 8 = 360, total length = 120**.

**Ex 4.** (PB Q241) A 520-byte packet (20 header), MTU 200. Data 500. MTU − 20 = 180, but 180 / 8 = 22.5, so round **down** to 22 × 8 = **176**. 500 / 176 → **3** fragments.

| Fragment | Total length | MF | Offset |
|---|---|---|---|
| 1 | 176 + 20 = 196 | 1 | 0 |
| 2 | 176 + 20 = 196 | 1 | 22 |
| 3 | 148 + 20 = 168 | 0 | 44 |

**Ex 5.** (PB Q242) A 4500-byte packet (20 header), MTU 600. Data 4480. 580 → round down to **576**. Fragment 1 carries bytes 0–575 (offset 0), fragment 2 the next 576 (offset 576/8 = 72), fragment 3 the next 576 (offset 1152/8 = **144**).

**Ex 6.** (PB Q239) A 1000-byte datagram, MTU 100. Data 980, max 80 → 980 / 80 = 12.25 → **13** fragments.

**Ex 7.** (PB Q245) 8880 bytes of UDP data, UDP header 8, IP header 20, MTU 1500. IP payload = 8880 + 8 = **8888**. Max = 1480. 8888 / 1480 = 6.005 → **7 fragments**. Fragments 1–6 carry 6 × 1480 = 8880 bytes, so the 7th starts at byte 8880 → offset = 8880 / 8 = **1110**.

## Across several links (paper favourite)

The datagram is fragmented **link by link**. Work out the MTU of every link, then follow the datagram along. A fragment that is small enough passes through later links unchanged.

**Ex 8.** (PB Q244, class notes) A TCP message with 1000 bytes of data (including the 20-byte TCP header) goes from host A to B through routers R1 and R2. Max frame A–R1 = 1500 with a 15-byte frame header. R1–R2 = 700 with 10. R2–B = 600 with 12. IP header = 20. Find total length, DF, MF and offset of the last packet on link R1–R2.

Step 1: MTUs. A–R1 = 1500 − 15 = **1485**. R1–R2 = 700 − 10 = **690**. R2–B = 600 − 12 = **588**.

Step 2: the IP datagram = 1000 + 20 = **1020** bytes. It fits A–R1 (1485), so no fragmentation there.

Step 3: R1–R2. Max data = 690 − 20 = 670 → round down to a multiple of 8 = 83 × 8 = **664**. Packet 1 = 664 data + 20 = 684 bytes. Packet 2 = 1000 − 664 = 336 data + 20 = 356 bytes.

Step 4: last packet on R1–R2: **total length = 356**, **DF = 0**, **MF = 0**, **offset = 664 / 8 = 83**.

(R2–B: max data 588 − 20 = 568, so packet 1 splits again into 568 + 96. Packet 2, with 336 data, passes through unchanged.)

> The class notes write DF = 1 here. DF must be 0, because fragmentation clearly happened on this link.

**Ex 9.** (T2 paper Q4.3) A TCP segment of 1200 bytes (including the 20-byte TCP header). A–R1 frame 1500 with a 14-byte header, R1–R2 800 with 10, R2–B 500 with 12. IP header 20. Find total length, DF, MF and offset of the last fragment on R1–R2.

Step 1: MTUs: A–R1 = **1486**, R1–R2 = **790**, R2–B = **488**.

Step 2: datagram = 1200 + 20 = **1220** ≤ 1486, so it is not fragmented on A–R1.

Step 3: R1–R2 max data = 790 − 20 = 770 → 96 × 8 = **768**. Fragment 1 = 768 data (TL 788). Fragment 2 = 1200 − 768 = 432 data (TL 452).

Step 4: last fragment on R1–R2: **total length 452, DF 0, MF 0, offset 768 / 8 = 96**.

**Ex 10.** (PB Q261) An 1800-byte datagram (20 header) crosses Ethernet (MTU 1500), then a WAN (MTU 576).

Ethernet: max data 1480. Packet 1 = 1480 data. Packet 2 = 1780 − 1480 = 300 data (offset 185).

WAN: max data 576 − 20 = 556 → **552**. Packet 1 (1480) splits into 552 + 552 + 376. Packet 2 (300) passes through.

| Fragment | Data | MF | Offset | Total length |
|---|---|---|---|---|
| 1 | 552 | 1 | 0 | 572 |
| 2 | 552 | 1 | 69 | 572 |
| 3 | 376 | 1 | 138 | 396 |
| 4 | 300 | 0 | 185 | 320 |

Fragment 3 keeps MF = 1 because more data (fragment 4) follows in the original.

## Datagram counting sums

**Ex 11.** (PB Q237, T2 paper Q4.8) Datagrams of 1500 bytes. IP header 20, TCP header 20. A 4,000,000-byte file. Application data per datagram = 1500 − 20 − 20 = 1460. Datagrams = 4,000,000 / 1460 = 2739.7 → **2740**.

**Ex 12.** (PB Q238) IP packets can carry at most 500 bytes of data. TCP produces a segment with 1000 data bytes + 20 TCP header = **1020 bytes**. Data per fragment must be a multiple of 8: 500 / 8 = 62.5 → 62 × 8 = **496**.

| Packet | Payload | IP header | Total length |
|---|---|---|---|
| 1 | 496 | 20 | 516 |
| 2 | 496 | 20 | 516 |
| 3 | 28 | 20 | 48 |

## Reading fragment fields backwards

**Ex 13.** (PB Q225) M = 0, HLEN = 10, total length = 400, offset = 300. Header = 10 × 4 = 40 → data = 360. First data byte = 300 × 8 = **2400**. Last = 2400 + 360 − 1 = **2759**. M = 0 and offset ≠ 0 → it is the **last fragment**.

## Exam traps

- Round the max data **down** to a multiple of 8 **before** dividing.
- Subtract the **frame header** to get MTU, then the **IP header** to get the data.
- Offset is in **8-byte units**: divide bytes by 8.
- MF = 0 only on the very last piece of the original datagram.
- Don't forget the UDP or TCP header is part of the IP data.
