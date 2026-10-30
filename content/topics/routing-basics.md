## Routing vs forwarding

- **Forwarding** is what a router does with each packet: look at the destination address, look it up in the table, send it out of the right interface. It is fast and happens per packet.
- **Routing** is how that table gets filled in: routers run a **routing algorithm** (Dijkstra, Bellman–Ford) through a **routing protocol** (OSPF, RIP, BGP). It happens in the background.

A **routing table** keeps track of the **routes to use for forwarding data to its destination** (PB Q264). A typical row:

| Destination network | Mask | Next hop | Interface |
|---|---|---|---|
| 192.168.1.0 | /24 | – (directly connected) | eth0 |
| 10.0.0.0 | /8 | 192.168.1.254 | eth0 |
| 0.0.0.0 | /0 | 203.0.113.1 | eth1 (default route) |

## Types of forwarding

| Type | What the table stores |
|---|---|
| **Next-hop** | Only the address of the next router, not the full route |
| **Network-specific** | One row per destination **network**, not per host |
| **Host-specific** | The **full IP address of the destination host** (PB Q266) |
| **Default** | One catch-all row (0.0.0.0/0) for everything not listed |

**Longest prefix match**: if several rows match a destination, the router uses the most specific one (the longest prefix).

**Address aggregation** (route summarisation) combines several smaller blocks into one larger prefix so the table stays short. It needs **classless addressing** (PB Q267).

## Inside a router

- **Input ports** and **output ports** handle the **physical and data link** layers.
- The **switching fabric** moves packets from input to output.
- The **routing processor** runs the **network layer** functions: routing protocols and the table (PB Q268).

## Routing algorithms and protocols

| | Algorithm | Where | Shares | Example protocol |
|---|---|---|---|---|
| Distance vector | Bellman–Ford | Intradomain | Its full table, with neighbours, periodically | **RIP** |
| Link state | Dijkstra | Intradomain | Its neighbour costs, with everyone (flooding) | **OSPF** |
| Path vector | (BGP decision process) | **Interdomain** (between ISPs) | Whole paths of autonomous systems | **BGP** |

- **Intradomain** = inside one organisation (autonomous system): RIP, OSPF.
- **Interdomain** = between organisations: BGP.

## Static vs dynamic routing

- **Static**: the admin types the routes by hand (`route add` / `ip route` in Packet Tracer). Simple, but does not adapt when a link fails.
- **Dynamic**: routers learn routes with RIP/OSPF and adapt automatically. Practicals 6–8 in the syllabus cover both.

The `route` command shows and edits the TCP/IP routing table (PB Q265).

## Flooding

Every incoming packet is sent out of **every** interface except the one it came in on. It always finds the destination and is very robust, but it creates **duplicates and loops** (PB Q270). TTL or a sequence number is used to stop it. Link state routing uses controlled flooding to spread LSPs.

## Unicast, multicast, broadcast

- **Unicast**: one sender → one receiver.
- **Multicast**: one sender → a **group** (class D addresses 224–239). Each router builds a **shortest path tree** for each group (PB Q272).
- **Broadcast**: one sender → everyone on the network.

## Shortest path routing

The network is drawn as a graph: routers are nodes and links are edges with a **cost** (delay, distance, or simply 1 per hop). The best route is the one with the lowest total cost. The two sum types are in the next two topics: **Dijkstra (link state)** and **Bellman–Ford (distance vector)**.

## Exam traps

- Count to infinity → **distance vector**.
- OSPF → **link state**. RIP → **distance vector**. BGP → **path vector**, interdomain.
- DV updates are **periodic**. Link state packets carry knowledge of the **neighbourhood**.
- All three algorithms (Dijkstra, DV, LS) can be used for network layer design (PB Q263).
