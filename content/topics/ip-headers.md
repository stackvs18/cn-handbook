## The IPv4 datagram

An IPv4 datagram = **header + data**. The header is **20 to 60 bytes** (20 fixed + up to 40 of options). The whole datagram is at most **65,535 bytes**, because Total Length is 16 bits (2¹⁶ − 1). IPv4 is **connectionless** and gives a **datagram** service.

```
 0      4      8              16    19               31
+------+------+---------------+------------------------+
| VER  | HLEN | Service (TOS) |     Total length       |
|  4   |  4   |       8       |          16            |
+------+------+---------------+-----+------------------+
|     Identification (16)     |Flags| Fragment offset  |
|                             | (3) |      (13)        |
+-------------+---------------+-----+------------------+
|  TTL (8)    | Protocol (8)  |  Header checksum (16)  |
+-------------+---------------+------------------------+
|                Source IP address (32)                |
+------------------------------------------------------+
|             Destination IP address (32)              |
+------------------------------------------------------+
|                Options (0–40 bytes)                  |
+------------------------------------------------------+
```

| Field | Bits | What it means |
|---|---|---|
| Version | 4 | 4 for IPv4 (`0100`) |
| HLEN | 4 | Header length in 4-byte words: **header bytes = HLEN × 4**. Range 5–15 (20–60 bytes) |
| Service type (TOS / DSCP) | 8 | Priority and type of service |
| Total length | 16 | Header + data, in bytes (max 65,535) |
| Identification | 16 | Same in every fragment of one datagram |
| Flags | 3 | Reserved, **DF** (don't fragment), **MF** (more fragments) |
| Fragment offset | 13 | Position of this fragment's data, in 8-byte units |
| TTL | 8 | Hop limit. Each router subtracts 1; at 0 the packet is dropped. Stops **looping** |
| Protocol | 8 | Which upper protocol is inside: 1 = ICMP, 6 = TCP, 17 = UDP |
| Header checksum | 16 | Covers the header only; recomputed at every hop (because TTL changes) |
| Source address | 32 | Sender's IP. **Routers do not change it** (PB Q222) |
| Destination address | 32 | Receiver's IP |
| Options | 0–320 | Record route, source routing, timestamp |

### Type of service bits (class notes)

The 8-bit service field was originally `P P P D T R C 0`: 3 precedence (priority) bits, then **D**elay, **T**hroughput, **R**eliability, **C**ost.

| Protocol | TOS bits | Meaning |
|---|---|---|
| ICMP | 0000 | Normal |
| BOOTP | 0000 | Normal |
| NNTP | 0001 | Minimise cost |
| IGP | 0010 | Maximise reliability |
| SNMP | 0010 | Maximise reliability |

## Header tricks (MCQs)

**Ex 1.** (PB Q223) The first 8 bits are `01000010`. Version = `0100` = 4. HLEN = `0010` = 2 → 2 × 4 = **8 bytes**. The minimum header is 20 bytes (HLEN 5), so the receiver **rejects** the packet.

**Ex 2.** (PB Q224) HLEN = `1000` = 8 → header = 32 bytes → options = 32 − 20 = **12 bytes**.

**Ex 3.** (PB Q225) M = 0, HLEN = 10, total length = 400, offset = 300. Header = 40, data = 360. First byte = 300 × 8 = **2400**, last byte = 2400 + 360 − 1 = **2759**. M = 0 → **last fragment**.

- Fields used for fragmentation: **Identification, Flags, Fragment offset**. Not Type of service (PB Q226).
- **TTL** exists to stop packets looping forever (PB Q221).

## The IPv6 header

IPv6 addresses are **128 bits (16 bytes)**, written in hex as 8 groups: `2001:0db8:0000:0000:0000:ff00:0042:8329` (shortened `2001:db8::ff00:42:8329`). The base header is a fixed **40 bytes**, much simpler than IPv4.

```
+-------+---------------+---------------------------+
|Version| Traffic class |        Flow label         |
|  (4)  |      (8)      |          (20)             |
+-------+---------------+-------------+-------------+
|     Payload length (16)  | Next header | Hop limit |
|                          |    (8)      |    (8)    |
+--------------------------+-------------+-----------+
|              Source address (128)                  |
+----------------------------------------------------+
|            Destination address (128)               |
+----------------------------------------------------+
```

| Field | Bits | Meaning |
|---|---|---|
| Version | 4 | 6 (`0110`) |
| Traffic class | 8 | Priority (like IPv4's TOS) |
| Flow label | 20 | Marks packets of one flow for special handling |
| Payload length | 16 | Length after the 40-byte base header (max 65,535) |
| Next header | 8 | Type of the next extension header, or TCP/UDP |
| Hop limit | 8 | Same job as IPv4's TTL |
| Source / destination | 128 each | Addresses |

**Extension headers** (class notes): Hop-by-hop options (0), Routing (43), Fragment (44), Authentication (51), Encapsulating Security Payload (50), Destination options (60). They form a chain: base header → extension header → … → data.

**What IPv6 removed**: header checksum, HLEN (fixed size), and fragmentation at routers (only the source fragments, using the Fragment extension header).

**Ex 4.** (PB Q250) If 1 million addresses are allocated every picosecond, how long do IPv6 addresses last? 2¹²⁸ ≈ 3.4 × 10³⁸ addresses. Rate = 10⁶ / 10⁻¹² = 10¹⁸ per second. Time = 3.4 × 10²⁰ s ≈ **1.08 × 10¹³ years**.

## Moving from IPv4 to IPv6

Three strategies:

1. **Dual stack**: a host runs IPv4 and IPv6 side by side and uses whichever the other side supports.
2. **Tunnelling**: an IPv6 packet is wrapped inside an IPv4 packet to cross an IPv4-only region.
3. **Header translation**: when one side only speaks IPv4, a translator converts the headers.

## NAT (Network Address Translation)

Private networks use **private addresses** that are not routed on the Internet:

| Range | Prefix |
|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 |

A **NAT router** sits between the private network and the Internet. When a packet goes out, it replaces the private source address (and usually the port) with its own **public** address and records the mapping in a **translation table**. When the reply comes back, it looks up the table and swaps the address back. Many devices can share **one public IP**, which saves IPv4 addresses.

| Private side | Public side |
|---|---|
| 192.168.1.5 : 3345 | 203.0.113.7 : 5001 |
| 192.168.1.9 : 3345 | 203.0.113.7 : 5002 |

## Datagram counting

**Ex 5.** (PB Q237) 1500-byte datagrams, 20-byte IP header, 20-byte TCP header, 4 million byte file → 4,000,000 / 1460 = 2739.7 → **2740 datagrams**.

## Exam traps

- **Header bytes = HLEN × 4.** HLEN below 5 means the packet is invalid.
- IPv4 header 20–60 bytes. IPv6 base header 40 bytes.
- Routers change TTL (and so the checksum), and the length when fragmenting. They do **not** change the source address.
- Protocol field: 6 = TCP, 17 = UDP, 1 = ICMP.
