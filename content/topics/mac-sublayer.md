## The channel allocation problem

When many stations share **one channel** (a radio frequency, an old Ethernet cable), something must decide who sends when. That is the job of the **MAC (medium access control) sublayer**. The protocols fall into three groups:

- **Random access**: anyone sends when ready; collisions are handled (ALOHA, CSMA, CSMA/CD, CSMA/CA).
- **Controlled access**: stations take turns (reservation, polling, token passing).
- **Channelization**: split the channel (FDMA, TDMA, CDMA).

## ALOHA

Built for radio links, where all stations broadcast on a common frequency.

**Pure ALOHA**: send whenever you have a frame. If no ACK comes, wait a **random** back-off time (so you don't collide again) and resend. After too many attempts (Kmax), give up.
- Vulnerable time = **2 × T** (T = frame time).
- Throughput **S = G × e⁻²ᴳ**, maximum **0.184 (18.4%) at G = 0.5**.

**Slotted ALOHA**: time is cut into slots of length T. A frame may only start at the beginning of a slot.
- Vulnerable time = **T**.
- Throughput **S = G × e⁻ᴳ**, maximum **0.368 (36.8%) at G = 1**.

G = average number of frames generated per frame time.

**Ex 1.** (PB Q167, T2 paper) 800 kbps link with pure ALOHA → maximum useful bandwidth = 0.184 × 800 = **147.2 kbps**. Slotted (PB Q173) → 0.368 × 800 = **294.4 kbps**.

**Ex 2.** (PB Q198–200) Pure ALOHA, 200-bit frames on 200 kbps → T = 1 ms, so 1000 frames per second fill the channel (G = 1).

| System produces | G | S = G e⁻²ᴳ | Successful frames/s |
|---|---|---|---|
| 1000 frames/s | 1 | 0.135 | 135 |
| 500 frames/s | 0.5 | 0.184 | 184 |
| 250 frames/s | 0.25 | 0.152 | 152 |

**Ex 3.** (PB Q205–207) The same network with slotted ALOHA (S = G e⁻ᴳ): 1000 → **368**, 500 → **303**, 250 → **195** frames/s.

**Ex 4.** (PB Q202) Pure ALOHA, 1000-bit frames at 1 Mbps (T = 1 ms), 1000 transmissions per second → G = 1 → 1000 × e⁻² ≈ **135 frames/s**.

**Ex 5.** (PB Q201) Pure ALOHA, 100 stations, T = 1 s. Maximum efficiency at G = 0.5 → 0.5 frames per second in total → each station **0.005 frames/s**. Slotted (PB Q204): G = 1 → each station **0.01 frames/s**.

**Ex 6.** (PB Q209) Pure ALOHA, 200-bit frames at 200 kbps → T = 1 ms. To be collision-free, no other station may start sending in the 1 ms before this frame starts or during the 1 ms it is being sent (vulnerable time 2 ms).

## CSMA: listen before talking

**CSMA** = **Carrier Sense Multiple Access**: listen to the channel first and only send if it is idle. Collisions can still happen because of propagation delay. Persistence modes:

- **1-persistent**: if idle, send immediately (probability 1).
- **Non-persistent**: if busy, wait a random time, then sense again.
- **p-persistent**: if idle, send with probability p (slotted channels).

There is no "A-persistent".

## CSMA/CD (wired Ethernet)

Send, and **keep listening**. If a collision is detected: stop, send a **jamming signal**, **increment k** (the attempt count), wait a random back-off, try again.

**Binary exponential back-off**: after the k-th collision, pick R at random from **0 to 2ᵏ − 1**, wait R × slot time.

**Ex 7.** (PB Q181) After the 5th collision, R is from 0 to 31 → P(R = 4) = 1/32 = **0.03125**.

**Ex 8.** (PB Q196) After the 6th collision, R can take **64** values (0–63).

**Ex 9.** (PB Q211) After the 3rd collision, P(k = 2) = **1/8**. (PB Q212) After the 4th, P(K = 5) = 1/16, delay = 5 × 0.125 μs = 0.625 μs. (PB Q213) After the 6th, P(k = 10) = 1/64, delay = 10 × 0.5 μs = 5 μs.

**Minimum frame size**: the sender must still be sending when news of a collision gets back, so

```
minimum frame size = 2 × Tp × bandwidth
```

**Ex 10.** (PB Q182) 1 Gbps, 1 km cable, 200,000 km/s. Tp = 1 / 200,000 s = 5 μs. Minimum frame = 2 × 5 × 10⁻⁶ × 10⁹ = 10,000 bits = **1250 bytes**.

**Ex 11.** (PB Q210) 10 Mbps, maximum propagation 25.6 μs → 2 × 25.6 × 10⁻⁶ × 10⁷ = 512 bits = **64 bytes** (the Ethernet minimum).

CSMA/CD works at the **data link** layer and is used in **Ethernet**.

## CSMA/CA (wireless)

Wireless stations cannot detect collisions while sending, so they **avoid** them instead (PB Q184):

- **IFS** (interframe space): wait before sending. A shorter IFS means a higher **priority** (PB Q183).
- **Contention window**: wait a random number of slots.
- **Acknowledgement**: after sending, wait for an ACK; if none arrives before the timeout, the frame is assumed lost.

## Ethernet (IEEE 802.3)

| Field | Size |
|---|---|
| Preamble | 7 bytes (`10101010` × 7) |
| SFD (start frame delimiter) | 1 byte = **10101011** |
| Destination MAC | 6 bytes |
| Source MAC | 6 bytes |
| Type / length | 2 bytes |
| Data (payload) | 46 to **1500 bytes** |
| CRC | 4 bytes |

- Ethernet = **IEEE 802.3** (wired). Wi-Fi = **IEEE 802.11**.
- Standards are named like **10BASE-T** (10 Mbps, baseband, twisted pair).
- The 1500-byte maximum payload is the **MTU** used in fragmentation sums.
