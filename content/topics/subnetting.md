## Classless addressing in one paragraph

In classless addressing (**CIDR**, Classless Inter-Domain Routing) an address is written with a slash: `200.10.20.40/28`. The number after the slash is the **prefix length**: how many bits from the left are the network part. The rest are host bits. So /28 means 28 network bits and 32 − 28 = **4 host bits**.

The **subnet mask** is the same information written as an address: 28 ones followed by 4 zeros = `11111111.11111111.11111111.11110000` = **255.255.255.240**. That is why the MCQ (PB Q269) says /24 is "both a subnet mask and CIDR".

**Subnetting** means borrowing host bits to split one network into several smaller networks (subnets).

## Key formulas

```
host bits        h = 32 − n
total addresses    = 2^h
usable hosts       = 2^h − 2      (network ID and broadcast are not usable)
network ID         = IP AND mask  (host bits → 0)
broadcast          = host bits → 1
```

## The block-size trick (no binary needed)

Only one octet of the mask is "interesting": the one that is not 255 and not 0. All the work happens there.

| Mask bits in that octet | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Mask value | 128 | 192 | 224 | 240 | 248 | 252 | 254 | 255 |
| **Block size** (256 − value) | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Prefix if 4th octet | /25 | /26 | /27 | /28 | /29 | /30 | /31 | /32 |
| Prefix if 3rd octet | /17 | /18 | /19 | /20 | /21 | /22 | /23 | /24 |

1. Find the **interesting octet** and its **block size** = 256 − mask value.
2. **Network ID**: in that octet, take the largest multiple of the block size that is ≤ the IP's value. Octets after it → **0**.
3. **Broadcast**: network value + block − 1 in that octet. Octets after it → **255**.
4. **First host** = network + 1. **Last host** = broadcast − 1.
5. **Usable hosts** = 2^(32 − n) − 2.

**Ex 1.** (class notes) 200.10.20.40/28. /28 → 4th octet, mask 240, block 16. Multiples of 16: 0, 16, 32, 48. 40 lies in 32–47. Network **200.10.20.32**, broadcast **200.10.20.47**, hosts **.33 to .46**, usable 2⁴ − 2 = **14**.

In binary (the way the class notes show it): 40 = `00101000`. AND with 240 = `11110000` → `00100000` = 32. Same answer.

**Ex 2.** (PB Q259) 143.128.67.235/20. /20 → 3rd octet, mask 240, block 16. 67 lies in 64–79. Network **143.128.64.0**, broadcast **143.128.79.255**, last host **143.128.79.254**. With x = 3rd octet and y = 4th octet of the last host: x × y = 79 × 254 = **20066**.

> The class notes read Q259 differently: they counted the 1-bits of 67 and 79 (3 × 5 = 15). The question says "decimal value of the 3rd octet", so 20066 matches the wording. If this exact question comes, write the network, broadcast and last host first: those earn the marks either way.

**Ex 3.** (PB Q235) IP 160.168.30.100, mask 255.255.240.0. 3rd octet, block 16. 30 lies in 16–31 → broadcast **160.168.31.255**.

**Ex 4.** (PB Q260) IP 125.134.112.66, mask 255.255.224.0. 3rd octet, block 32: 0, 32, 64, 96, 128. 112 lies in 96–127 → network **125.134.96.0**. (By AND: 112 = `01110000`, 224 = `11100000` → `01100000` = 96.)

**Ex 5.** (PB Q232) 172.16.13.7 with 255.255.255.128. Class B (172). 4th octet, block 128. 7 lies in 0–127 → subnet **172.16.13.0**, broadcast **172.16.13.127**.

## How many bits to borrow

- **For S subnets**: borrow s bits where **2^s ≥ S**. New prefix = old prefix + s.
- **For H hosts**: keep h host bits where **2^h − 2 ≥ H**. Prefix = 32 − h.

**Ex 6.** (PB Q233/234) 12 subnets (or 10) from a class C. 2³ = 8 is too few, 2⁴ = 16 is enough → borrow 4 → /28 → **255.255.255.240**.

**Ex 7.** (PB Q256) 10.0.0.0/8 into 16 subnets. 2⁴ = 16 → /8 + 4 = **/12** → mask **255.240.0.0**. Number of subnets = 2⁴ = 16.

**Ex 8.** (PB Q257) 190.76.0.0/16 into 1024 subnets. 2¹⁰ = 1024 → borrow 10 → **/26** → mask 255.255.255.192, block 64. The last subnet is **190.76.255.192/26**. First usable host **190.76.255.193**, last **190.76.255.254**, broadcast 190.76.255.255.

**Ex 9.** (PB Q254) Is 10.1.1.0/22 enough for 100 hosts? h = 32 − 22 = 10 → 2¹⁰ − 2 = **1022 ≥ 100**, so **yes**, no change needed. (The smallest fit would be 2⁷ − 2 = 126 → /25.)

## Splitting a network in two (and again)

**Ex 10.** (PB Q252) 193.1.2.0 with mask 255.255.255.128.

(a) Block size in the 4th octet = 256 − 128 = 128, so there are two subnets: **193.1.2.0/25** and **193.1.2.128/25**. Subnet-1 ID = **193.1.2.0**.

(b) Direct broadcast of subnet-1 = **193.1.2.127**.

(c) Usable hosts = 2⁷ − 2 = **126** in each subnet.

| Subnet | Network ID | Broadcast | Usable hosts |
|---|---|---|---|
| 1 | 193.1.2.0 | 193.1.2.127 | 126 |
| 2 | 193.1.2.128 | 193.1.2.255 | 126 |

(d) Split subnet-2 into two equal parts: borrow one more bit → **/26**, mask **255.255.255.192**, block 64.

| New subnet | Subnet ID | Broadcast | Usable hosts |
|---|---|---|---|
| 1 | 193.1.2.128 | 193.1.2.191 | 62 |
| 2 | 193.1.2.192 | 193.1.2.255 | 62 |

## Same network or not? (two masks)

**Ex 11.** (PB Q227) C1 = 203.197.2.53 with mask 255.255.128.0. C2 = 203.197.75.201 with mask 255.255.192.0.

- **C1's view** (its own mask, 3rd octet block 128): C1 → 2 → 203.197.0.0. C2 → 75 → 203.197.0.0. Same, so C1 thinks C2 is **on the same network**.
- **C2's view** (block 64): C2 → 75 → 203.197.64.0. C1 → 2 → 203.197.0.0. Different, so C2 thinks C1 is **on a different network**.

> To actually send a frame, a host always needs the **MAC address for an IP address** (ARP). That is PB Q228.

## Longest prefix match (forwarding table)

A router compares the destination with every row: it ANDs the address with each row's mask. If several rows match, it uses the one with the **longest prefix** (the most specific). If none match, it uses the default route. (PB Q236's answer is interface **3**; its table is a figure in the book.)

## Exam traps

- Usable hosts subtract **2**. Total addresses do not.
- The block size is in the **interesting octet** only: for /20 it is the 3rd octet, not the 4th.
- Subnets need 2^s **≥** S. 10 subnets still need 4 bits.
