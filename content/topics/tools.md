## Unit 10 in one line

You design networks in **Cisco Packet Tracer** (a simulator) and watch real traffic with **Wireshark** (a packet analyser). The MCQs ask about commands and Wireshark filters, and they come word for word from the practice book.

## Network commands

| Command | What it does | MCQ hook |
|---|---|---|
| `ping 8.8.8.8` | Sends ICMP echo requests; tests whether a host is reachable and measures round-trip time | Reachability |
| `traceroute` / `tracert` (Windows) | Lists every router between source and destination | **Number of routers on a path** (PB Q410, T2 paper) |
| `route` | Shows and edits the TCP/IP **routing table** | **Manipulate the routing table** (PB Q265, Q411) |
| `ipconfig` (Windows) / `ifconfig` (Linux) | Shows the IP address, mask and gateway of your interfaces | Your own settings |
| `nslookup google.com` | Asks DNS for a name's IP address | DNS lookup |
| `netstat` | Lists open connections and listening ports | Connections |
| `arp -a` | Shows the IP → MAC table | ARP cache |
| `nmap` | Scans a network for live hosts and open ports. A **ping sweep** is part of Nmap | **Ping sweep** (PB Q412, T2 paper) |

## Packet Tracer

Cisco Packet Tracer lets you drag in PCs, switches, hubs and routers, connect them with cables, and test them without real hardware. The syllabus practicals:

1. **Bus topology**: devices on one backbone.
2. **Star topology** with a **switch** and with a **hub**. A hub repeats every frame to every port; a switch learns MAC addresses and sends each frame only where it needs to go.
3. **TCP/IP configuration**: give each PC an IP address, subnet mask and default gateway (Desktop → IP Configuration). Test with `ping`.
4. **Static routing**: on each router, add routes by hand (Config → Static, or `ip route <network> <mask> <next-hop>`).
5. **Dynamic routing with RIP**: `router rip`, then `network <each connected network>`.
6. **Dynamic routing with OSPF**: `router ospf 1`, then `network <network> <wildcard> area 0`.
7. **HTTP**: put a server in the topology, turn on its HTTP service, and open it from a PC's web browser.

Simulation mode in Packet Tracer shows each packet (ICMP, ARP, DNS, HTTP) moving step by step, which is a good way to see the layers working.

## Wireshark

**Wireshark** is a **network protocol analysis** tool (PB Q413). It captures packets on your network card and shows every header, layer by layer (Ethernet → IP → TCP/UDP → HTTP/DNS).

### Display filters (learn these exactly)

| You want | Filter |
|---|---|
| Packets **from or to** an IP | `ip.addr == 10.10.50.1` |
| By **destination** IP | `ip.dest == 10.10.50.1` (the practice-book answer; real Wireshark spells it `ip.dst`) |
| By **source** IP | `ip.src == 10.10.50.1` |
| By **port** (either side) | `tcp.port == 25` |
| By **destination port** | `tcp.dstport == 25` |
| By **URL / host name** | `http.host == "hostname"` |
| From or to 8.8.8.8 | `ip.addr==8.8.8.8` |
| Only one protocol | `http`, `dns`, `tcp`, `udp`, `icmp`, `arp` |

> In the T2 paper the destination-IP question listed both `ip.dst` and `ip.dest` among 8 options. The practice book's key is `ip.dest`; real Wireshark uses `ip.dst`. Pick whichever of the two appears. If both appear, the safe choice is the book's `ip.dest`.

### What you can see in a capture

- The **3-way handshake** (SYN, SYN-ACK, ACK) at the start of every TCP connection.
- **DNS** queries and responses over UDP port 53.
- **HTTP** GET requests and 200 OK responses.
- The source and destination MAC, IP and port of every packet.

## Exam traps

- Number of routers → **traceroute**. Manipulate routing table → **route**. Ping sweep → **Nmap**.
- `ip.addr` = either direction. `ip.src` = source. `tcp.dstport` = destination port.
