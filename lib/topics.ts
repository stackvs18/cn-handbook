// The table of contents: every syllabus unit and every topic, in study order.
// This file has no server-only code, so both pages and client components can import it.

export type Unit = {
  id: string;
  name: string;
  syllabusLabel: string; // e.g. "Unit 5 · 12.5%" from the official LJU syllabus
};

export type Topic = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  source: string; // where the questions come from
  unitId: string;
};

export const UNITS: Unit[] = [
  { id: "network", name: "Network Layer", syllabusLabel: "Unit 5 · 12.5%" },
  { id: "routing", name: "Routing", syllabusLabel: "Unit 6 · 12.5%" },
  { id: "transport-intro", name: "Transport Layer", syllabusLabel: "Unit 7 · 7.5%" },
  { id: "transport", name: "TCP & UDP", syllabusLabel: "Unit 8 · 10%" },
  { id: "application", name: "Application Layer", syllabusLabel: "Unit 9 · 7.5%" },
  { id: "tools", name: "Design & Monitoring", syllabusLabel: "Unit 10 · 5%" },
  { id: "t1", name: "Units 1–4 revision", syllabusLabel: "T1 units · ~6 MCQs" },
];

export const TOPICS: Topic[] = [
  { slug: "network-layer", number: 1, title: "Network Layer & Switching", summary: "What the network layer does, circuit vs packet switching, datagram vs virtual circuit.", source: "PB Q214–220, 229, 246–247", unitId: "network" },
  { slug: "ip-headers", number: 2, title: "IPv4 & IPv6 Headers, NAT", summary: "Every header field, HLEN × 4, TTL, IPv6 extension headers and NAT.", source: "PB Q221–226, 237, 250", unitId: "network" },
  { slug: "classful", number: 3, title: "Classful Addressing", summary: "Classes A to E, network ID, broadcast, first and last host.", source: "PB Q216, 230–231, 251, 258, 271", unitId: "network" },
  { slug: "subnetting", number: 4, title: "Subnetting & CIDR", summary: "The block-size trick: network, broadcast and hosts for any /n in seconds.", source: "PB Q227–236, 252–260", unitId: "network" },
  { slug: "vlsm", number: 5, title: "Block Allocation (VLSM)", summary: "Giving address blocks to groups of customers: the 4-mark paper question.", source: "PB Q248–255, T2 paper Q4.1", unitId: "network" },
  { slug: "fragmentation", number: 6, title: "IP Fragmentation", summary: "MTU, offset, MF and total length tables, including multi-link sums.", source: "PB Q237–245, 261, T2 paper Q4.3", unitId: "network" },
  { slug: "routing-basics", number: 7, title: "Routing & Forwarding", summary: "Routing tables, forwarding types, flooding, multicast, RIP vs OSPF vs BGP.", source: "PB Q262–276", unitId: "routing" },
  { slug: "link-state", number: 8, title: "Link State (Dijkstra)", summary: "The table method for shortest paths, with every practice-book graph solved.", source: "PB Q275–295, T2 paper Q4.5", unitId: "routing" },
  { slug: "distance-vector", number: 9, title: "Distance Vector (Bellman–Ford)", summary: "Router tables, exchanging vectors, count to infinity.", source: "PB Q262, 282, 285–294, T2 paper Q4.2", unitId: "routing" },
  { slug: "transport-intro", number: 10, title: "Transport Layer Services", summary: "Process-to-process delivery, ports, sockets, multiplexing, TDM, sliding window.", source: "PB Q296–322, T2 paper Q4.4", unitId: "transport-intro" },
  { slug: "udp", number: 11, title: "UDP & Header Dumps", summary: "The 8-byte header and the hex-dump sum that comes every year.", source: "PB Q336–356, 371–374, T2 paper Q4.6", unitId: "transport" },
  { slug: "tcp", number: 12, title: "TCP", summary: "Header fields, flags, sequence numbers, 3-way handshake, TCP header dumps.", source: "PB Q326–349, class notes", unitId: "transport" },
  { slug: "congestion", number: 13, title: "Flow & Congestion Control", summary: "rwnd, cwnd, slow start, congestion avoidance and TCP Reno.", source: "PB Q323–325, 352–369, T2 paper Q4.7", unitId: "transport" },
  { slug: "application-layer", number: 14, title: "HTTP, DNS, SMTP, FTP", summary: "Client–server vs P2P, HTTP messages, DNS, email, ports.", source: "PB Q379–409, T2 paper", unitId: "application" },
  { slug: "tools", number: 15, title: "Packet Tracer & Wireshark", summary: "Commands (ping, traceroute, route, nmap) and Wireshark filters.", source: "PB Q410–420", unitId: "tools" },
  { slug: "intro-delays", number: 16, title: "Unit 1: Networks & Delays", summary: "Network types, OSI vs TCP/IP, devices, and the four delays.", source: "PB Q1–70", unitId: "t1" },
  { slug: "physical-layer", number: 17, title: "Unit 2: Physical Layer", summary: "Duplex modes, topologies, mesh links, cables and wireless.", source: "PB Q67–116", unitId: "t1" },
  { slug: "data-link", number: 18, title: "Unit 3: Data Link & Errors", summary: "Framing, CRC, checksum, Hamming code, ARQ.", source: "PB Q117–162", unitId: "t1" },
  { slug: "mac-sublayer", number: 19, title: "Unit 4: ALOHA, CSMA, Ethernet", summary: "Pure and slotted ALOHA, CSMA/CD, CSMA/CA, Ethernet.", source: "PB Q163–213", unitId: "t1" },
];

// Returns the topics that belong to one unit, in topic-number order.
export function getTopicsInUnit(unitId: string): Topic[] {
  const topicsInUnit: Topic[] = [];
  for (const topic of TOPICS) {
    if (topic.unitId === unitId) {
      topicsInUnit.push(topic);
    }
  }
  return topicsInUnit;
}

// Finds one topic by its slug, plus its unit and the topics before and after it.
// Returns null when no topic has that slug.
export function getTopic(slug: string) {
  for (let position = 0; position < TOPICS.length; position++) {
    const topic = TOPICS[position];
    if (topic.slug !== slug) {
      continue;
    }

    let unit: Unit | null = null;
    for (const candidateUnit of UNITS) {
      if (candidateUnit.id === topic.unitId) {
        unit = candidateUnit;
      }
    }

    const previousTopic = position > 0 ? TOPICS[position - 1] : null;
    const nextTopic = position < TOPICS.length - 1 ? TOPICS[position + 1] : null;
    return { topic, unit: unit as Unit, previousTopic, nextTopic };
  }
  return null;
}

// Turns a topic slug into its title, e.g. "udp" -> "UDP & Header Dumps".
export function getTopicTitle(slug: string): string {
  for (const topic of TOPICS) {
    if (topic.slug === slug) {
      return topic.title;
    }
  }
  return slug;
}

// Pads a number to two digits for the "04" style labels.
export function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}
