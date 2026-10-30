## What UDP is

UDP (**User Datagram Protocol**) is the simpler of the two transport protocols. It takes a message from an application, adds a tiny 8-byte header, and hands it to IP. That is all it does.

- **Connectionless**: no handshake before sending. Every datagram travels on its own.
- **Unreliable**: no acknowledgements, no retransmission, no ordering. If a datagram is lost, UDP does not notice.
- **Fast and light**: the header is only 8 bytes (TCP's is 20–60).
- It adds just two things on top of IP: **port numbers** (so the right process gets the data: demultiplexing) and a **checksum** (error checking).

> Use UDP when speed matters more than every byte arriving: DNS lookups, video and voice calls, online games, RIP routing updates, DHCP, SNMP.

### TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Connection | Connection-oriented (3-way handshake) | Connectionless |
| Reliability | ACKs, retransmission, ordering | None |
| Header | 20–60 bytes | 8 bytes (fixed) |
| Data unit | Byte stream (segments) | Messages (datagrams) |
| Speed | Slower | Faster |
| Used by | HTTP, FTP, SMTP, Telnet | DNS, video/voice, RIP, DHCP |

## The UDP header

Four fields, each **16 bits = 2 bytes = 4 hex digits**:

```
 0               15 16              31
+------------------+------------------+
|   Source port    | Destination port |
+------------------+------------------+
|   Total length   |     Checksum     |
+------------------+------------------+
|                Data                 |
```

- **Source port**: the port of the process sending the data (often a random *ephemeral* port if it is a client).
- **Destination port**: the port of the receiving process (e.g. 53 for DNS).
- **Total length**: header + data, in bytes. The smallest possible value is 8 (header only).
- **Checksum**: error detection over the header, data and a pseudo-header of IP addresses.

## The header-dump sum (comes every year)

You get 16 hex digits and must find the ports, the lengths and sometimes the direction. The method never changes.

1. **Split** the 16 digits into 4 groups of 4: `[source port][dest port][total length][checksum]`.
2. **Convert** each group from hex to decimal: for `WXYZ`, value = **W × 4096 + X × 256 + Y × 16 + Z**. Letters: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.
3. **Data length = total length − 8.**
4. **Direction**: if the destination port is below 1024 (a well-known server port), the packet goes **client → server**. If the source port is well-known, it is server → client.

| Hex place | 16³ | 16² | 16¹ | 16⁰ |
|---|---|---|---|---|
| Multiply by | 4096 | 256 | 16 | 1 |

**Ex 1.** (T2 paper Q4.6) `1F90005000200020`. Split: `1F90 | 0050 | 0020 | 0020`. Source port = 1×4096 + 15×256 + 9×16 + 0 = 4096 + 3840 + 144 = **8080**. Destination port = 5×16 = **80**. Total length = 2×16 = **32 bytes**. Data = 32 − 8 = **24 bytes**. Port 80 is HTTP, so this goes client → server.

**Ex 2.** (PB Q374) `CB84000D001C001C`. Source = 12×4096 + 11×256 + 8×16 + 4 = 49152 + 2816 + 128 + 4 = **52100**. Destination = `000D` = **13**. Total length = `001C` = 16 + 12 = **28**. Data = 28 − 8 = **20**.

**Ex 3.** (PB Q371) `AA84000D001A001A`. Source = 10×4096 + 10×256 + 8×16 + 4 = 40960 + 2560 + 128 + 4 = **43652**. Destination = **13**. Total length = `001A` = **26**. Data = **18**.

**Ex 4.** (PB Q372) `ABAB000D001C001C`. Source = 40960 + 2816 + 160 + 11 = **43947**. Destination **13**, total **28**, data **20**.

**Ex 5.** (PB Q373) `CCDD000D001C001C`. Source = 49152 + 3072 + 208 + 13 = **52445**. Destination **13**, total **28**, data **20**.

**Ex 6.** (class notes) `0421 000B 002A E217`. Source = 4×256 + 2×16 + 1 = **1057**. Destination = **11**. Total = 2×16 + 10 = **42**. Data = **34**. Checksum = 14×4096 + 2×256 + 1×16 + 7 = **57879**.

> Write the four groups in a table in the exam, with the working for each conversion. Even if one addition slips, the method earns most of the marks.

### MCQ versions

- `CB84002C 001C0AEC`, destination port? → `002C` = 2×16 + 12 = **44**.
- `DB84002C001E0A1C`, length of data? → `001E` = 30, so data = **22**.

## Why UDP still matters

- **DNS** uses UDP port 53: one small question, one small answer, no need for a connection.
- **Real-time media** prefers a late frame to be skipped, not re-sent.
- **Multicast and broadcast** only work with UDP (TCP is one-to-one).
- Simple request/response protocols (DHCP, SNMP, TFTP, RIP) use UDP.

## Exam traps

- The header is **8 bytes**, not 20. Subtract 8 for the data length.
- "Total length" includes the header.
- UDP datagrams are **not numbered** (no sequence numbers).
- Beyond IP, UDP adds only **demultiplexing and error checking** (the PB answer).
