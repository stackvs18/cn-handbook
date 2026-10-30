## Why this topic is here

T2 is mostly Units 5–10, but **about 6 of the 20 MCQs** come from Units 1–4. The T2 paper asked about latency, transmission time, mesh links, MAC addresses, CRC and ALOHA. This page and the next three cover those quickly.

## Networks in one minute

A **computer network** is a set of devices (nodes) connected by links so that processes on different devices can exchange information (PB Q3). The components are: devices (hosts), links (media), network devices (switch, router), protocols and the data itself.

| Type | Covers | Example |
|---|---|---|
| PAN | A few metres | Bluetooth headset |
| LAN | A building or campus | College lab |
| MAN | A city | Cable TV network |
| WAN | A country or the world | The Internet |

The first network was **ARPANET** (Advanced Research Projects Agency Network).

## Layered architecture

Networking is split into layers so that each layer does one job and only talks to the layers directly above and below it. You can change one layer (say, Wi-Fi instead of Ethernet) without changing the others.

| OSI (7) | Job | TCP/IP (4) |
|---|---|---|
| 7 Application | Services for users (HTTP, SMTP) | Application |
| 6 Presentation | Format, encryption, compression | Application |
| 5 Session | Start, manage and end sessions | Application |
| 4 Transport | Process-to-process, reliability | Transport |
| 3 Network | Host-to-host, routing, IP addresses | Internet |
| 2 Data link | Node-to-node, frames, MAC addresses | Network access |
| 1 Physical | Bits as signals on the medium | Network access |

TCP/IP has **4 layers** per the PB key. It has no separate **presentation** or **session** layer.

## Devices

| Device | Layer | Job |
|---|---|---|
| Repeater | Physical | Regenerates a weak signal |
| Hub | Physical | Repeats every frame to every port |
| Bridge / Switch | Data link | Forwards frames by MAC address |
| Router | Network | Connects networks (LANs), forwards by IP |
| Gateway | Any (all 7) | Translates between different protocols |
| Modem | Physical | Converts digital ↔ analog |

## The four delays

| Delay | Formula | What it is |
|---|---|---|
| **Transmission** | packet size (bits) / bandwidth (bps) | Time to push all bits onto the link |
| **Propagation** | distance / signal speed | Time for one bit to travel the link |
| **Queuing** | (given) | Time waiting in a router's queue |
| **Processing** | (given) | Time to check the header and decide where to send |

**Latency (total delay) = propagation + transmission + queuing + processing** (PB Q16, T2 paper).

> Units: 1 KB = 1000 bytes in these sums (the book's answers use 1000), 1 byte = 8 bits, 1 ms = 10⁻³ s, 1 μs = 10⁻⁶ s, 1 Mbps = 10⁶ bps.

**Ex 1.** (PB Q28, T2 paper) Transmission time of a 2.5 KB message at 1 Gbps = 2.5 × 1000 × 8 / 10⁹ = 20 × 10⁻⁶ s = **0.02 ms**.

**Ex 2.** (PB Q27) Propagation time over 12,000 km at 2.4 × 10⁸ m/s = 12 × 10⁶ / 2.4 × 10⁸ = **50 ms**.

**Ex 3.** (PB Q29) 1000-byte packet, 2500 km, 2.5 × 10⁸ m/s, 2 Mbps. Propagation = 2.5 × 10⁶ / 2.5 × 10⁸ = 10 ms. Transmission = 8000 / 2 × 10⁶ = 4 ms. Total = **14 ms**.

## Throughput across several links

The slowest link limits everything: **throughput = min(R1, R2, R3)**.

**Ex 4.** (PB Q30) Links of 500 kbps, 2 Mbps and 1 Mbps. Throughput = **500 kbps**. A 4 million byte file takes 4 × 10⁶ × 8 / 500 × 10³ = **64 s**. If R2 drops to 100 kbps: throughput = 100 kbps, time = **320 s**.

## Store-and-forward over several hops

Each router waits for the **whole** packet before sending it on. With N packets over h hops (h links):

```
total delay = N × Tt + (h − 1) × Tt + h × Tp      (+ processing at each router if given)
```

**Ex 5.** (PB Q35) Mesh: A → C → D (2 links). 4000 bytes, 1000 km per link, 2.5 × 10⁸ m/s, 4 Mbps. Tt = 32,000 / 4 × 10⁶ = 8 ms. Tp = 10⁶ / 2.5 × 10⁸ = 4 ms. Total = 2 × (8 + 4) = **24 ms**.

**Ex 6.** (PB Q36) D1 → D2 → D4 → D5 (3 links), 4000 bytes, 10,000 km per link, 2 Mbps. Tt = 16 ms, Tp = 40 ms. Total = 3 × 56 = **168 ms**.

**Ex 7.** (PB Q34) One switch, 10⁷ bps links, Tp = 50 μs per link, the switch forwards 45 μs after receiving, 3000 bits. Tt = 300 μs. Total = 300 + 50 + 45 + 300 + 50 = **745 μs**.

**Ex 8.** (PB Q33) Same set-up, Tp = 20 μs, switch delay 35 μs, 10,000 bits in packets of 5000 bits. Tt = 500 μs. Packet 1 reaches the switch at 520, leaves at 555, finishes at 1055, arrives at **1075**. Packet 2 finishes reaching the switch at 1020, can go at 1055, finishes at 1555, arrives at **1575 μs**.

**Ex 9.** (PB Q32) 150,000 bytes in 1500-byte packets = 100 packets, 4 hops of 20 km at 100 Mbps, 2 × 10⁸ m/s. Tt = 12,000 / 10⁸ = 120 μs. Tp = 100 μs. Total = (100 + 3) × 120 + 4 × 100 = **12,760 μs ≈ 12.76 ms**.

## Quick facts

- IPv4 address = **32 bits**. IPv6 = **128 bits = 16 bytes**. MAC = **48 bits**, stored in the **NIC**.
- 2 versions of IP are in use (IPv4, IPv6).
- A set of rules = a **protocol**.
- Repeater boosts a weak signal; a wireless repeater extends Wi-Fi range.
