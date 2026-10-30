1. **UDP data = total length − 8**, not − 20. The UDP header is 8 bytes.
2. **Fragment data must be a multiple of 8.** Round MTU − 20 **down** before dividing (180 → 176, 580 → 576, 670 → 664).
3. **DF = 0** when a packet was fragmented. Only **MF** changes to 0 on the last piece. (The class notes slip on this.)
4. **MTU = frame size − frame header** in multi-link fragmentation sums.
5. **Header bytes = HLEN × 4.** HLEN 2 means 8 bytes, so the packet is rejected.
6. **Usable hosts = 2^h − 2**, but block sizes and "addresses" are 2^h.
7. **Block size lives in the interesting octet.** /20 works in the 3rd octet, not the 4th.
8. **Slow start doubles per RTT**, not per ACK. Count RTTs as rows − 1.
9. **Timeout → cwnd = 1 MSS.** Triple duplicate ACK (Reno) → cwnd = cwnd / 2.
10. **Window = min(rwnd, cwnd)**, never the sum.
11. **Dijkstra**: never update a node after you box it.
12. **Distance vector**: use the neighbours' tables from the previous step.
13. **MCQ options are shuffled into A–H in the paper.** Remember answer text, not letters.
