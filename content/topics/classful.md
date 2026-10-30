## What an IP address is

An IPv4 address is **32 bits**, written as 4 numbers (octets) from 0 to 255 separated by dots: `192.168.10.25`. Each octet is 8 bits.

Every address has two parts:

- **Network ID (NID)**: which network the device is on. All devices on the same network share it.
- **Host ID (HID)**: which device on that network.

Something has to say where the network part ends. In **classful** addressing the first few bits of the address decide it. In **classless** addressing (next topic) a mask or `/n` decides it.

## Binary in 30 seconds

An octet has 8 bit positions worth **128 64 32 16 8 4 2 1**. To convert a number, take the biggest value that fits, subtract, and repeat.

**Ex 1.** (PB Q230) 223.1.3.27 in binary. 223 = 128 + 64 + 16 + 8 + 4 + 2 + 1 → `11011111`. 1 → `00000001`. 3 → `00000011`. 27 = 16 + 8 + 2 + 1 → `00011011`. Answer: **11011111.00000001.00000011.00011011**.

## The five classes

The first bits (and so the first octet) tell you the class:

| Class | First bits | First octet | Default mask | Network / host split | Share of addresses | Used for |
|---|---|---|---|---|---|---|
| A | `0` | 0–127 | 255.0.0.0 (/8) | N.H.H.H | 50% | Huge networks |
| B | `10` | 128–191 | 255.255.0.0 (/16) | N.N.H.H | 25% | Medium networks |
| C | `110` | 192–223 | 255.255.255.0 (/24) | N.N.N.H | 12.5% | Small networks |
| D | `1110` | 224–239 | none | (multicast group) | 6.25% | Multicast |
| E | `1111` | 240–255 | none | (reserved) | 6.25% | Experimental |

Counts from the class notes:

| Class | Number of networks | Hosts per network |
|---|---|---|
| A | 2⁷ = 128 (126 usable) | 2²⁴ − 2 |
| B | 2¹⁴ = 16384 | 2¹⁶ − 2 = 65534 |
| C | 2²¹ | 2⁸ − 2 = 254 |

> Why "− 2"? In every network, the address with all host bits **0** is the network ID, and the address with all host bits **1** is the broadcast address. Neither can be given to a device.

## The four addresses you are always asked for

For any classful address:

1. **Network ID**: keep the network octets, set the host octets to **0** (this is IP AND default mask).
2. **Broadcast address**: keep the network octets, set the host octets to **255**.
3. **First host** = network ID + 1.
4. **Last host** = broadcast − 1.

**Ex 2.** (class notes) 201.20.30.40 → first octet 201 → **class C** → N.N.N.H. Network ID **201.20.30.0**, broadcast **201.20.30.255**, first host **201.20.30.1**, last host **201.20.30.254**, 4th host 201.20.30.4.

**Ex 3.** 64.0.0.8 → class A → network ID **64.0.0.0**. 130.2.3.4 → class B → **130.2.0.0**. 194.5.6.4 → class C → **194.5.6.0**, broadcast 194.5.6.255.

**Ex 4.** (PB Q231) The broadcast address of a class B network with the default mask: 172.16.x.x → **172.16.255.255**.

## Finding the class from binary

**Ex 5.** (PB Q251) Find the class of each address.
- `00000001 00001011 00001011 11101111` → starts with `0` → **class A**.
- `11000001 10000011 00011011 11111111` → starts with `110` → **class C**.
- 14.23.120.8 → 14 is in 0–127 → **class A**.
- 252.5.15.111 → 252 is in 240–255 → **class E**.

## Counting 1-bits

**Ex 6.** (PB Q258) 201.24.58.69 (classful). a = number of 1s in the directed broadcast address, b = number of 1s in the network ID. Find a + b.

Step 1: class C → network ID 201.24.58.0, broadcast 201.24.58.255.

Step 2: 201 = `11001001` → 4 ones. 24 = `00011000` → 2 ones. 58 = `00111010` → 4 ones. 255 → 8 ones. 0 → 0.

Step 3: a = 4 + 2 + 4 + 8 = **18**. b = 4 + 2 + 4 + 0 = **10**. a + b = **28**.

## Why classful addressing was replaced

Classes waste addresses. A company with 300 hosts is too big for class C (254) and gets a class B with 65,534 addresses, wasting more than 65,000. **Classless addressing (CIDR)** lets a block be any power of two, which is the next topic.

## Exam traps

- Class A is 0–127 (127 is loopback). Class B starts at **128**, class C at **192**.
- Natural (default) mask for class C = **255.255.255.0**.
- An IP address = **network address + host address** (not a MAC address).
