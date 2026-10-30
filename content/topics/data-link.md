## What the data link layer does

It moves **frames** across **one link** (node to node). Its jobs: **framing**, **physical (MAC) addressing**, **flow control**, **error control** and **access control** (who may use a shared link). Channel coding is not one of them (PB Q117).

## MAC addresses

A MAC address is **48 bits**, burned into the NIC, written as 6 hex pairs: `3A:12:34:B2:11:41`.

- Only hex digits 0–9 and A–F are allowed. `1G` makes an address **invalid** (PB Q119, T2 paper).
- Broadcast MAC = **FF:FF:FF:FF:FF:FF** (all 1s).
- Number of possible MAC addresses = 2⁴⁸.

## Framing

- **Byte stuffing**: put an **ESC** byte before any FLAG or ESC that appears in the data. Data `ESC, Flag, ESC` → `ESC ESC, ESC Flag, ESC ESC` (PB Q194). At the receiver, every added ESC is removed, so with 4 ESCs received, 2 are discarded.
- **Bit stuffing**: the flag is `01111110`. Insert a **0 after every five consecutive 1s** in the data (PB Q125). It is more efficient than byte stuffing.

## Error types

- **Single-bit error**: one bit changed.
- **Burst error**: 2 or more bits changed. Burst length = from the first changed bit to the last.

**Ex 1.** (PB Q139) Sent `0100010001000011`, received `0101110101000011`. XOR = `0001100100000000`. The first 1 is at position 4 and the last at position 8 → burst length **5 bits**.

## CRC (cyclic redundancy check)

The **generator** (divisor) is known by **both** sender and receiver.

**Polynomial to binary**: write a 1 for every power present, 0 for every missing one, from the highest power down to x⁰.
- x⁵ + x + 1 → `100011` (PB Q140)
- x⁵ + x³ + x² + 1 → `101101` (T2 paper Q1)
- x⁴ + x + 1 → `10011`, x³ + 1 → `1001`

**Method**

1. Key length = k bits → append **k − 1 zeros** to the data.
2. Divide by the key using **XOR** (modulo-2 division, no borrowing).
3. The **remainder** (k − 1 bits) is the CRC. Sent codeword = data + remainder.
4. Receiver divides the codeword by the key: remainder **0** → no error.

**Ex 2.** (PB Q153) Data `10011101`, generator x³ + 1 = `1001`. Append 3 zeros, divide → remainder `100`. Sent: **10011101100**.

**Ex 3.** (PB Q156) Data `1101011011`, generator x⁴ + x + 1 = `10011`. Remainder `1110`. Sent: **11010110111110**.

**Ex 4.** (PB Q154) Received `100100001`, key `1101` → remainder `000` → **no error**. (PB Q157) Received `100000001`, key `1101` → remainder `011` → **error**.

**Ex 5.** (PB Q146) M = `1010001101`, divisor x⁵ + x⁴ + x² + 1 = `110101`. CRC = `01110`, codeword `101000110101110`. The received `101000110101100` leaves remainder `00010` → **No**, it is not error-free.

CRC detects errors better than VRC/LRC (it catches burst errors) but cannot correct them.

## Checksum

1. Split the data into k-bit segments.
2. Add them in binary. **Wrap around** any carry (add it back to the sum).
3. **Complement** the result (flip every bit). That is the checksum.

**Ex 6.** (PB Q133) `1001 0001 1111 0000` → 9 + 1 + 15 + 0 = 25 = `11001`. Wrap: `1001` + `1` = `1010`. Complement → **0101**.

**Ex 7.** (PB Q143) `0101 0011 1000` → 5 + 3 + 8 = 16 = `10000`. Wrap: `0000` + 1 = `0001`. Complement → **1110**.

**Ex 8.** (PB Q147) Four 8-bit segments `10011001 11100010 00100100 10000100` → checksum **11011010**.

**LRC** (longitudinal redundancy check): XOR (even parity) of each bit column. (PB Q145) `11100111 11011101 00111001 10101001` → LRC **10101010**.

## Hamming code

It **detects and corrects** single-bit errors (PB Q121). Minimum Hamming distance = **3**.

- Number of parity bits r: smallest r with **2^r ≥ m + r + 1** (m = data bits). 4 data bits → 3; 7 → 4 (PB Q149); 17 → 5 (PB Q134).
- Parity bits sit at positions 1, 2, 4, 8, … P1 checks positions with bit 1 set (1, 3, 5, 7, …), P2 checks 2, 3, 6, 7, …, P4 checks 4–7, 12–15, …
- With r parity bits, n = 2^r − 1 and k = **2^r − r − 1** (PB Q131).

**Ex 9.** (PB Q124) Data 1101, even parity, positions 1–7 left to right: P1 P2 D1 P4 D2 D3 D4. P1 = D1 ⊕ D2 ⊕ D4 = 1, P2 = D1 ⊕ D3 ⊕ D4 = 0, P4 = D2 ⊕ D3 ⊕ D4 = 0 → **1010101**.

To find an error at the receiver, recompute each parity check. Write the failing checks as a binary number (P4 P2 P1). That number is the **position** of the wrong bit. Flip it.

## Flow and error control (ARQ)

| Protocol | Sender window | Receiver window | On loss |
|---|---|---|---|
| **Stop-and-wait** | 1 | 1 | Resend the one frame after a timeout |
| **Go-Back-N** | N | **1** | Resend the lost frame **and all after it** |
| **Selective Repeat** | N | N | Resend **only** the lost frame |

- Stop-and-wait = sliding window with window size **1** (PB Q136).
- RTT = 2 × propagation delay (PB Q148: 2 × 3.7 = **7.4 ms**).
- **ARQ** = the receiver asks for a retransmission. **FEC** = the receiver corrects the error itself.
- If an ACK is lost in stop-and-wait, the sender times out and resends. The receiver detects the duplicate by its sequence number and discards it.

**Ex 10.** (PB Q142) Stop-and-wait, every 4th transmitted packet is lost, 10 packets to send → **13 transmissions** (book key).
