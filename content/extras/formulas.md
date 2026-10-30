## UDP header dump

- Split 16 hex digits into 4 × 4: **source port | dest port | total length | checksum**
- Hex → decimal: `WXYZ` = W×4096 + X×256 + Y×16 + Z (A=10 … F=15)
- **Data length = total length − 8**
- Dest port < 1024 → client → server
- `1F90 0050 0020 0020` → 8080, 80, 32, data 24

## TCP header dump

- Source port (4 hex) | dest port (4) | seq no (8) | ack no (8) | HLEN + flags (4) | window (4)
- Header length = **HLEN × 4** (5 → 20 bytes)
- Last 6 bits of the HLEN/flags group = **U A P R S F**
- `5002` → HLEN 5, flags `000010` = **SYN**

## rwnd and sender window

- **rwnd = buffer − unprocessed data**
- **window = min(rwnd, cwnd)**
- 6000 − 1000 = 5000; min(3000, 4500) = 3000

## Slow start time

- Timeout: **ssthresh = cwnd / 2**, cwnd = **1 MSS**
- Slow start: **double every RTT** up to ssthresh
- Then **+1 MSS per RTT** (congestion avoidance)
- Time = (number of RTTs) × RTT. 32 KB, MSS 2 KB, RTT 100 ms → 3 + 8 = 11 RTT = **1100 ms**

## TCP Reno events

- **3 duplicate ACKs**: ssthresh = cwnd / 2, cwnd = ssthresh (+3 in fast recovery) → after recovery cwnd = ssthresh
- cwnd 32 MSS → **cwnd 16, ssthresh 16**
- **Timeout**: ssthresh = cwnd / 2, cwnd = 1 MSS

## Sliding window rate

- **Throughput = window / RTT**, capped at link capacity
- 4 packets / 0.1 s = 40 pkt/s; 8 / 0.12 = **66.67 pkt/s**
- Window scale needed after RTT = 65535 × 8 / bandwidth (500 ms at 1,048,560 bps); max window = 65535 × 2¹⁴

## Classful basics

- A 0–127 /8, B 128–191 /16, C 192–223 /24, D 224–239 multicast, E 240–255
- Network ID: host octets → 0. Broadcast: host octets → 255
- First host = NID + 1, last host = broadcast − 1

## Subnet: network, broadcast, hosts

- **Block size = 256 − mask value** in the interesting octet
- Network = largest multiple of block ≤ IP value; later octets → 0
- Broadcast = network + block − 1; later octets → 255
- **Usable hosts = 2^(32 − n) − 2**
- 128 192 224 240 248 252 254 255 ↔ blocks 128 64 32 16 8 4 2 1

## Subnets and hosts needed

- S subnets → borrow s bits with **2^s ≥ S**
- H hosts → h host bits with **2^h − 2 ≥ H**, prefix = 32 − h
- 12 subnets in class C → 4 bits → 255.255.255.240

## VLSM / block allocation

- Round each request up to a power of 2 → **prefix = 32 − log₂(block)**
- **Largest first**, each block starts on a multiple of its size
- Remaining = total − sum of allocations
- 512 → /23, 256 → /24, 128 → /25, 64 → /26

## Fragmentation table

- **Data = total − 20**
- **Max data = MTU − 20, round DOWN to a multiple of 8**
- Fragments = data ÷ max, round up
- TL = data + 20, **offset = bytes before ÷ 8**, MF = 1 except last, DF = 0

## Fragmentation across links

- **MTU = frame size − frame header**
- Follow the datagram link by link; small pieces pass unchanged
- Don't forget the TCP/UDP header is inside the IP data

## Datagram count

- Data per datagram = MTU − IP header − TCP header
- 4,000,000 / (1500 − 20 − 20) = **2740**

## IPv4 header tricks

- **Header bytes = HLEN × 4** (HLEN < 5 → rejected)
- Options = header − 20
- First data byte = offset × 8; last = first + data − 1
- Protocol 1 ICMP, 6 TCP, 17 UDP

## Dijkstra / Link state

- Row 1: neighbours' costs, others ∞
- Box the smallest; relax its neighbours: **new = boxed + edge**, replace only if smaller
- Repeat until every node is boxed; trace "via" backwards for paths

## Distance vector

- **D(X,Y) = min over neighbours V [ cost(X,V) + D(V,Y) ]**
- Table per router: Dest | Dist | Next
- Use neighbours' previous-step tables; repeat until no change

## Units 1–4 quick formulas

- Transmission = bits / bandwidth; propagation = distance / speed
- **Latency = propagation + transmission + queuing + processing**
- Mesh links = **n(n − 1)/2**
- Pure ALOHA max **18.4%** (G = 0.5), slotted **36.8%** (G = 1)
- CSMA/CD min frame = **2 × Tp × B**; after k collisions R ∈ 0 … 2ᵏ − 1
