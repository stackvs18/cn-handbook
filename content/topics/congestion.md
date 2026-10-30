## Two different problems

TCP slows the sender down for two different reasons, and the paper mixes them up on purpose.

- **Flow control** protects the **receiver**. The receiver has a buffer. If the sender sends faster than the application reads, the buffer overflows. The receiver tells the sender how much room is left: the **receive window (rwnd)**.
- **Congestion control** protects the **network**. If too many packets enter the routers, queues overflow and packets are dropped. The sender guesses how much the network can take: the **congestion window (cwnd)**.

| | Flow control | Congestion control |
|---|---|---|
| Protects | The receiver's buffer | The routers in between |
| Window | rwnd (advertised by receiver) | cwnd (computed by sender) |
| Signal | Window field in TCP header | Lost packets, timeouts, duplicate ACKs |
| Scope | End to end, between two hosts | Whole network |

## rwnd and the sender's window

These two formulas are worth 3 marks each time and take ten seconds:

```
rwnd          = buffer size − bytes received but not yet read
sender window = min(rwnd, cwnd)
```

The sender can never have more unacknowledged bytes in flight than the smaller of the two windows.

**Ex 1.** (PB Q365) Buffer 6000 bytes, 1000 bytes received and unprocessed → rwnd = 6000 − 1000 = **5000 bytes**.

**Ex 2.** (PB Q366) Buffer 5000, 1000 unprocessed → **4000 bytes**. (PB Q353) Buffer 7000, 1000 unprocessed → **6000**.

**Ex 3.** (PB Q367) rwnd = 3000, cwnd = 4500 → window = min(3000, 4500) = **3000 bytes**. (Q368) rwnd 4000, cwnd 4500 → **4000**. (Q369) rwnd 3000, cwnd 3500 → **3000**. (Q354) rwnd 3000, cwnd 5500 → **3000**.

**Ex 4.** (PB Q324) cwnd = 4 KB, rwnd = 6 KB → window = **4 KB = 4096 bytes**. LastByteSent − LastByteAcked = 10240 − 8192 = 2048 bytes are already in flight, so 2048 more may be sent.

## Congestion: why it happens and how to control it

Congestion happens when the **load** on the network (packets sent) is greater than its **capacity** (packets it can handle). Queues fill up, delay rises and packets are dropped.

**Open-loop control (prevention)**: stop it before it starts.
- Retransmission policy (good timers)
- Window policy (Selective Repeat instead of Go-Back-N)
- Acknowledgement policy (fewer ACKs)
- Discarding policy (drop less important packets first)
- Admission policy (refuse new flows when busy)

**Closed-loop control (removal)**: react after it starts.
- Back pressure (a congested router tells the router before it to slow down)
- Choke packet (a router sends a warning packet straight to the source)
- Implicit signalling (the source infers congestion from lost ACKs or delay)
- Explicit signalling (routers set a bit in the packets)

## TCP's congestion window: the three phases

TCP measures cwnd in **MSS** (maximum segment size) units.

1. **Slow start**: cwnd starts at **1 MSS** and **doubles every RTT** (+1 MSS for each ACK). It is called "slow" only because it starts small. The growth is exponential.
2. **Congestion avoidance**: once cwnd reaches **ssthresh** (the slow-start threshold), growth becomes **+1 MSS per RTT**, which is linear.
3. **Reaction to loss**:
   - **Timeout** (serious): ssthresh = cwnd / 2, **cwnd = 1 MSS**, start slow start again.
   - **3 duplicate ACKs** (mild; TCP Reno): ssthresh = cwnd / 2, cwnd = ssthresh (+3 during fast recovery), then continue with congestion avoidance. This is **fast retransmit / fast recovery**.

> Slow start statement MCQ (PB Q352): the only true statement is "cwnd approximately **doubles every RTT**". It does **not** double on every ACK, and it grows by 1 MSS per **ACK**, not per RTT.

## Slow start: time to get back

This is the class-notes sum (PB Q323 / Q359). Learn this one example and you can do any version.

**Ex 5.** cwnd = 32 KB when a timeout occurs. RTT = 100 ms, MSS = 2 KB. How long until cwnd is back at 32 KB?

Step 1: after the timeout, **ssthresh = 32 / 2 = 16 KB**, and **cwnd = 1 MSS = 2 KB**.

Step 2: slow start doubles cwnd each RTT until it reaches 16 KB.

| Transmission | Phase | Segments | cwnd (KB) |
|---|---|---|---|
| 1 | Slow start | 2⁰ = 1 | 2 |
| 2 | Slow start | 2¹ = 2 | 4 |
| 3 | Slow start | 2² = 4 | 8 |
| 4 | Slow start | 2³ = 8 | 16 (threshold) |
| 5 | Congestion avoidance | 9 | 18 |
| 6 | | 10 | 20 |
| 7 | | 11 | 22 |
| 8 | | 12 | 24 |
| 9 | | 13 | 26 |
| 10 | | 14 | 28 |
| 11 | | 15 | 30 |
| 12 | | 16 | 32 |

Step 3: count the round trips between the first and the last row: **12 − 1 = 11 RTT**. (Slow start 2 → 16 takes 3 RTT. Congestion avoidance 16 → 32 in steps of 2 takes 8 RTT. 3 + 8 = 11.)

Step 4: total time = 11 × 100 = **1100 ms** → MCQ option "**1100 to 1300**".

```
Slow start RTTs   = number of doublings from 1 MSS to ssthresh
Avoidance RTTs    = (target − ssthresh) / MSS
Time              = (slow start RTTs + avoidance RTTs) × RTT
```

## TCP Reno: triple duplicate ACK

**Ex 6.** (T2 paper Q4.7) TCP Reno, initial cwnd = 1 MSS, ssthresh = 16 MSS. At the end of the 6th RTT a triple duplicate ACK arrives when cwnd = 32 MSS. What are cwnd and ssthresh immediately after Reno processes the event and exits fast recovery?

Step 1: a triple duplicate ACK is a mild loss signal (packets are still getting through), so Reno does **not** go back to 1 MSS.

Step 2: **ssthresh = cwnd / 2 = 32 / 2 = 16 MSS**.

Step 3: during fast recovery cwnd = ssthresh + 3 = 19 MSS (the 3 duplicate ACKs mean 3 packets have left the network).

Step 4: when the new ACK arrives and fast recovery ends, **cwnd = ssthresh = 16 MSS**, and TCP continues in congestion avoidance (+1 MSS per RTT).

Answer: **cwnd = 16 MSS, ssthresh = 16 MSS**.

| Event | ssthresh | cwnd after |
|---|---|---|
| Timeout (any TCP) | cwnd / 2 | 1 MSS, then slow start |
| 3 dup ACKs, TCP Reno | cwnd / 2 | ssthresh (+3 during recovery), then avoidance |
| 3 dup ACKs, TCP Tahoe | cwnd / 2 | 1 MSS, then slow start |

## Window scale option

The TCP window field is 16 bits, so the largest window is **65,535 bytes**. On a fast, long link that is too small to keep the pipe full.

**Ex 7.** (PB Q325, also T2 paper) Bandwidth = 1,048,560 bits/s. Find a = the RTT (ms) beyond which window scaling is needed, and b = the maximum window with scaling. A full window of 65535 bytes = 65535 × 8 = 524,280 bits. Time to send it = 524,280 / 1,048,560 = 0.5 s. If the RTT is longer than that, the sender sits idle, so **a = 500 ms**. The scale factor is a shift of at most 14, so **b = 65535 × 2¹⁴ bytes**.

## Sequence number wrap-around

**Ex 8.** (PB Q349) 1 Gbps link. How long before a sequence number repeats? Sequence numbers count bytes and are 32 bits → 2³² bytes. Time = 2³² × 8 / 10⁹ = **34.36 s** → option "34–35".

## Exam traps

- rwnd is about the **receiver's buffer**; cwnd is about the **network**. The sender uses the **minimum**.
- Slow start doubles **per RTT**, not per ACK.
- A timeout sets cwnd to **1 MSS**; a triple duplicate ACK in Reno sets it to **cwnd / 2**.
- Count RTTs as **rows − 1** (the first row is where you start, not a round trip).
