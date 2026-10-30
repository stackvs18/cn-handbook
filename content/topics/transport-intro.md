## Where the transport layer sits

The network layer delivers a packet to the right **host** (computer). But a computer runs many programs at once: a browser, WhatsApp, a game. The transport layer delivers data to the right **process** (program) on that host. That is **process-to-process** delivery (PB Q297).

| Layer | Delivery | Address used | Data unit |
|---|---|---|---|
| Data link | Node to node (one link) | MAC address | Frame |
| Network | Host to host | IP address | Packet |
| **Transport** | **Process to process** | **Port number** | **Segment** |
| Application | User to user | URL / names | Message |

## Duties of the transport layer (Q319, 3 marks)

1. **Process-to-process delivery** using port numbers.
2. **Multiplexing and demultiplexing**: many applications share one network connection.
3. **Segmentation and reassembly**: split messages into segments and rebuild them.
4. **Connection control**: connectionless (UDP) or connection-oriented (TCP).
5. **Flow control**: don't overwhelm the receiver.
6. **Error control**: detect and recover lost or damaged segments, end to end.
7. **Congestion control**: don't overwhelm the network.

The data link layer also does flow and error control, but only **across one link**. The transport layer does it **end to end** (PB Q308).

## Ports and sockets

A **port number** is a 16-bit number that names a process: **0 to 65,535** (PB Q301).

| Range | Name | Used by |
|---|---|---|
| 0 – 1023 | **Well-known** | Servers: HTTP 80, HTTPS 443, FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53 |
| 1024 – 49151 | **Registered** | Registered applications (e.g. 3306 MySQL, 8080 web) |
| 49152 – 65535 | **Dynamic / private** | Short-lived client (ephemeral) ports |

A **socket** = **IP address + port number**, e.g. `192.168.1.5:52100`. One connection is identified by two sockets (client socket + server socket). The PB key calls the TCP name for a transport service access point a **port** (Q298).

**Why sockets matter (Q322)**: the application only talks to its socket. The operating system uses the socket pair to hand every arriving segment to the right process, which is how one machine can hold hundreds of connections at once.

## Multiplexing and demultiplexing

- **Multiplexing** (at the sender): the transport layer collects data from many applications, adds a header with port numbers to each, and passes them all **down to the network layer** as one stream (PB Q296).
- **Demultiplexing** (at the receiver): it reads the destination port in each segment and hands the data **up** to the right process.

## Connection-oriented vs connectionless (Q357)

| Connection-oriented (TCP) | Connectionless (UDP) |
|---|---|
| Connection set up before data (handshake) | No setup, just send |
| Reliable: ACKs and retransmission | Unreliable: no ACK by default |
| Data arrives in order | Data may arrive out of order |
| Flow and congestion control | None |
| More overhead, slower | Less overhead, faster |
| HTTP, FTP, SMTP | DNS, video, VoIP |

## Multiplexing on the link: TDM

The PB puts a few physical-layer multiplexing questions in this unit.

- **Multiplexing** = several devices sharing one medium/link (PB Q311). The device that does it is a **multiplexer** (Q309).
- **TDM** (time-division multiplexing): time is cut into frames, and each frame has **one slot per source**. With n sources, there are **n slots** (Q312).
- **Rate of one circuit** = frames per second × bits per slot.

**Ex 1.** (PB Q313, T2 paper) The link sends 4000 frames/s and each slot holds 8 bits → each circuit gets 4000 × 8 = **32 kbps**.

- **Synchronous TDM** gives every device its slot even when it has nothing to send. Efficiency = used slots / total slots.

**Ex 2.** (PB Q316, T2 paper) 5 devices, 2 have nothing to send → 3 / 5 = **0.6 (60%)**.

## Sliding window throughput

With a fixed window of W packets, the sender can send W packets and must then wait for an ACK, which takes one RTT. So:

```
throughput = W / RTT     (but never more than the link capacity)
```

**Ex 3.** (PB Q320) Capacity 100 packets/s, RTT 100 ms, window 4 packets. Throughput = 4 / 0.1 = **40 packets/s**. That is less than 100, so the answer is 40 packets/s.

**Ex 4.** (T2 paper Q4.4) Capacity 150 packets/s, RTT 120 ms, Selective Repeat with window 8. Throughput = 8 / 0.12 = **66.67 packets/s**, below 150, so the answer is 66.67 packets/s.

> If W / RTT comes out **more** than the capacity, the answer is the capacity (the link is full).

## Reliable data transfer mechanisms (Q376)

| Mechanism | Purpose |
|---|---|
| Checksum | Detect corrupted bits |
| Sequence numbers | Detect lost and duplicate segments, keep order |
| Acknowledgements (ACK/NAK) | Tell the sender what arrived |
| Timer | Resend if no ACK arrives in time |
| Window / pipelining | Send several segments before waiting (Go-Back-N, Selective Repeat) |

**ARQ** = Automatic Repeat reQuest: the receiver's ACKs (or their absence) trigger retransmission.

## SSL

**SSL** = **Secure Socket Layer** (today TLS). It sits on top of TCP and secures data at the **transport layer** (PB Q307). HTTPS = HTTP over SSL/TLS, port 443.

## Exam traps

- Transport = **process to process** using **port addresses**.
- Ports: 0–65,535. Well-known 0–1023.
- UDP is the one that does **not** provide reliable end-to-end delivery.
- TCP has no "fragment offset" field.
