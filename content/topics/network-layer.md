## What the network layer does

The data link layer moves a frame across **one** link. The network layer moves a **packet** from the source **host** all the way to the destination **host**, across many links and routers. Its data unit is the **packet** (also called a datagram).

**Jobs (design issues) of the network layer**

- **Logical addressing**: every host gets an IP address (32-bit IPv4 or 128-bit IPv6).
- **Routing**: deciding the path a packet takes.
- **Forwarding**: moving a packet from a router's input to the right output.
- **Internetworking**: connecting different kinds of networks into one internet.
- **Fragmentation**: splitting packets that are too big for a link.
- **Congestion control**: avoiding overloaded routers.
- **Service to the transport layer**: connectionless (datagram) or connection-oriented (virtual circuit).

**Error control is not a network layer job.** That is done by the data link and transport layers (PB Q215).

## Store-and-forward

A router receives the **whole packet**, checks it, stores it in a queue, and then forwards it to the next hop. This is why every hop adds transmission, queuing and processing delay.

## Circuit switching vs packet switching

**Circuit switching**: a dedicated path is set up before any data flows, and its bandwidth is reserved for the whole conversation, even when nobody is talking. Example: the old **telephone network** (PB Q218).

**Packet switching**: data is cut into packets, and each packet shares the links with everyone else's packets. Nothing is reserved.

| | Circuit switching | Packet switching |
|---|---|---|
| Setup | Required before data | None (datagram) |
| Path | Dedicated, fixed | Shared |
| Bandwidth | Reserved, wasted when idle | Used on demand |
| Delay | Constant after setup | Varies (queuing) |
| Example | Telephone network | Internet |

**Ex 1.** (PB Q246) A 3 Mbps link is shared. Each user needs 150 kbps while transmitting and transmits only 10% of the time.
- (a) Circuit switching reserves 150 kbps per user: 3000 / 150 = **20 users**.
- (b) With packet switching, the probability that a given user is transmitting = **0.1**.

(Packet switching can therefore support many more than 20 users, because they are rarely all active at once.)

## Two kinds of packet switching

**Datagram network (connectionless)**: every packet carries the **full source and destination address** and is routed on its own. Packets from the same source to the same destination can take **different routes** and arrive out of order. This is how IP works.

**Virtual circuit network (connection-oriented)**: a path is set up first (like a call), then every packet carries only a short **VC number** (PB Q229) and follows the same path in order.

| | Datagram | Virtual circuit |
|---|---|---|
| Setup phase | No | Yes |
| Each packet carries | Full addresses | Short VC number |
| Route | Can differ per packet | Same for all packets |
| Order | May arrive out of order | In order |
| Router failure | Packets reroute | Circuit is broken |
| Example | IP (Internet) | ATM, Frame Relay |

A network that offers only connection service at the network layer is a **virtual-circuit network**. One that offers only connectionless service is a **datagram network** (PB Q220).

## IP's service

IP is **best effort**: it tries, but it does not promise delivery, order or no duplicates. That is why IP is called **unreliable** (PB Q217). Reliability, when needed, is added on top by TCP.

True statements about IP (PB Q219):
- A computer can have **multiple IP addresses** (one per interface).
- Packets from the same source to the same destination **can take different routes**.
- A packet is **discarded** when its TTL reaches 0.
- The source **can** set the route (source routing option), so the statement "the source cannot set the route" is the **false** one.

## Traffic shaping: token bucket

A **token bucket** controls how fast a host may send. Tokens drop into a bucket at a fixed rate. Each packet (or cell) needs a token to leave. So the long-run sending rate equals the token rate.

**Ex 2.** (PB Q247) A token is added every 5 μs, and each token sends one ATM cell with 48 bytes of data. Maximum sustainable rate = 48 × 8 bits / 5 μs = 384 / (5 × 10⁻⁶) = **76.8 Mbps**.

## Exam traps

- Network layer unit = **packet**. Data link = frame. Transport = segment.
- Telephone = **circuit switched**.
- VC network packets carry a **VC number**, not full addresses.
- IP is **unreliable** and **connectionless**.
