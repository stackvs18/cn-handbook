## What TCP is

TCP (**Transmission Control Protocol**) is the reliable transport protocol. Before sending data it sets up a **connection**. Then it makes sure every byte arrives, in order, exactly once.

- **Connection-oriented**: a 3-way handshake first, a close at the end.
- **Reliable**: sequence numbers, acknowledgements, retransmission on loss.
- **Byte stream**: TCP numbers **bytes**, not messages. (So the PB statement "TCP connections are message streams" is false.)
- **Full duplex**: both sides can send at the same time.
- **Flow control** (receive window) and **congestion control** (congestion window).
- Header is **20 to 60 bytes**.

Used by HTTP (80), HTTPS (443), FTP (20/21), SMTP (25), Telnet (23), SSH (22).

## The TCP header (Q3 theory, 3 marks)

```
 0                   15 16                  31
+----------------------+----------------------+
|  Source port (16)    | Destination port (16)|
+----------------------+----------------------+
|            Sequence number (32)             |
+---------------------------------------------+
|         Acknowledgement number (32)         |
+------+----------+-+-+-+-+-+-+---------------+
| HLEN | Reserved |U|A|P|R|S|F| Window size   |
| (4)  |   (6)    |R|C|S|S|Y|I|    (16)       |
|      |          |G|K|H|T|N|N|               |
+------+----------+-+-+-+-+-+-+---------------+
|    Checksum (16)       | Urgent pointer (16)|
+------------------------+--------------------+
|        Options and padding (0–40 bytes)     |
+---------------------------------------------+
```

| Field | Bits | Meaning |
|---|---|---|
| Source port | 16 | Sending process |
| Destination port | 16 | Receiving process |
| Sequence number | 32 | Number of the **first data byte** in this segment |
| Acknowledgement number | 32 | The **next byte expected** from the other side (valid when ACK = 1) |
| HLEN | 4 | Header length in 4-byte words (5 → 20 bytes, 15 → 60 bytes) |
| Reserved | 6 | Not used |
| Flags | 6 | URG, ACK, PSH, RST, SYN, FIN |
| Window size | 16 | Receive window (rwnd): how many bytes the sender of this segment can accept |
| Checksum | 16 | Error detection (mandatory in TCP) |
| Urgent pointer | 16 | Where urgent data ends (valid when URG = 1) |
| Options | 0–40 bytes | MSS, window scale, SACK, timestamps |

**The six flags**

- **URG**: urgent pointer field is valid
- **ACK**: acknowledgement field is valid
- **PSH**: push the data to the application now
- **RST**: reset (abort) the connection
- **SYN**: synchronise sequence numbers (open a connection)
- **FIN**: finish (close the connection)

> Memory trick for the flag order: "**U**nskilled **A**ttackers **P**ester **R**eal **S**ecurity **F**olks".

## Sequence and acknowledgement numbers

- A segment's sequence number = the number of its **first data byte**.
- **SYN** and **FIN** each use **one** sequence number. A pure **ACK** (no data) uses **none**.
- Acknowledgement number = **next byte expected**. ACK 3001 means "I have everything up to 3000".

**Ex 1.** (PB Q342) A file of 1000 bytes, first byte numbered 10001, sent in one segment → sequence number **10001**. The segment carries bytes 10001–11000, so the reply's ACK = **11001**.

## 3-way handshake (connection setup)

```
Client (active open)                 Server (passive open)
   SYN, seq = x            ─────▶
                           ◀─────   SYN + ACK, seq = y, ack = x + 1
   ACK, seq = x + 1, ack = y + 1 ─▶
```

1. **SYN**: the client picks a starting sequence number x and sends SYN. This is an **active open**. The server was already waiting: a **passive open**.
2. **SYN + ACK**: the server picks its own number y, and acknowledges x + 1 (the SYN used one number).
3. **ACK**: the client acknowledges y + 1. Data can now flow.

**Ex 2.** (class notes) Client port A → server port 80. Client sends SYN, seq = 9000, rwnd = 12000, MSS option = 1200 B. Server replies SYN + ACK, seq = 3000, ack = 9001. Client's ACK has **seq = 9001, ack = 3001**.

Connection close uses **FIN** from each side and an ACK for each: FIN → ACK → FIN → ACK (or 3 segments when FIN + ACK are combined).

## TCP header dump sum

Same idea as the UDP dump, but the header is longer: ports (4 + 4 hex digits), sequence number (8), ack number (8), then HLEN + flags (4), then window (4).

**Ex 3.** (class notes) Dump: `E293 0017 00000001 00000000 5002 07FF …`. Find source port, destination port, sequence number, ack number, header length, segment type and window size.

| Field | Hex | Value |
|---|---|---|
| Source port | E293 | 14×4096 + 2×256 + 9×16 + 3 = **58003** |
| Destination port | 0017 | 16 + 7 = **23** (Telnet) |
| Sequence number | 00000001 | **1** |
| Acknowledgement number | 00000000 | **0** |
| HLEN | 5 | 5 × 4 = **20 bytes** |
| Flags | 002 → last 6 bits `000010` | Only **SYN** set → a **SYN segment** |
| Window size | 07FF | 7×256 + 15×16 + 15 = **2047** |

How to read `5002`: in binary it is `0101 000000 000010`. The first 4 bits = HLEN (5), the next 6 = reserved, the last 6 = U A P R S F = 0 0 0 0 1 0.

## Reliability: how TCP guarantees delivery

- **Sequence numbers** spot gaps and duplicates, and let the receiver put bytes in order.
- **Acknowledgements** tell the sender what arrived (cumulative ACK).
- **Retransmission timer**: if no ACK comes back in time, resend.
- **Fast retransmit**: 3 duplicate ACKs → resend at once, without waiting for the timer.
- **Checksum** detects corrupted segments (they are dropped and then resent).
- **Flow control** (rwnd) stops the receiver's buffer from overflowing.

Both sequence **and** acknowledgement numbers are needed to detect and recover lost segments (PB Q344).

## Ports and sockets

- **Socket** = IP address + port number. A TCP connection is identified by the pair of sockets.
- The client uses a short-lived **ephemeral** port (49152–65535). The server uses a **well-known** port (0–1023).

## Exam traps

- TCP header: 20 bytes minimum, 60 maximum. **Fragment offset is not a TCP field** (it is IP).
- SYN uses 1 sequence number. A pure ACK uses 0.
- The client does the **active open**.
- The sequence number wraps after 2³² bytes (34.36 s at 1 Gbps, see the congestion guide).
