## Physical layer in one line

It moves **raw bits** over a medium as signals (electrical, light or radio). It turns the data link layer's requests into hardware operations.

## Transmission modes

| Mode | Direction | Example |
|---|---|---|
| **Simplex** | One way only | Keyboard → computer, TV broadcast |
| **Half duplex** | Both ways, one at a time | Walkie-talkie |
| **Full duplex** | Both ways at the same time | Phone call (best for interactive use) |

"Double duplex" does not exist (PB Q69).

**Point-to-point**: a dedicated link between two devices. **Multipoint**: three or more devices share one link.

## Topologies

| Topology | Layout | Good | Bad |
|---|---|---|---|
| **Mesh** | Every device linked to every other | Most reliable, private, no traffic sharing | Many cables and ports |
| **Star** | Every device to a central hub/switch | Easy to add and fix | Hub failure stops everything |
| **Bus** | All devices on one backbone cable (multipoint) | Cheap, little cable | Backbone failure stops everything |
| **Ring** | Each device to two neighbours in a circle | Simple, data goes one way round | One break can stop the ring |

## Mesh links (comes every year)

In a full mesh of n devices every pair needs one link:

```
links          = n (n − 1) / 2
ports per device = n − 1
```

**Ex 1.** (PB Q79, T2 paper) 99 devices → 99 × 98 / 2 = **4851 links**.

**Ex 2.** (PB Q111) 6 devices → 6 × 5 / 2 = **15 cables**, each device needs **5 ports**.

A bus with n devices needs **one backbone and n drop lines**.

## Guided media (wired, "bound")

| Cable | Build | Notes |
|---|---|---|
| **Twisted pair** | Two insulated copper wires twisted together | UTP and STP (2 forms). Twisting cancels noise. RJ-45 connector |
| **Coaxial** | Central conductor, insulation, metal **shield**, cover | Thinnet and thicknet. BNC, T and barrel connectors |
| **Fiber optic** | Glass or plastic core, cladding | Carries **light**. Fastest, least affected by EMI, hard to tap, low noise |

Fiber uses **total internal reflection**: light stays in the core when the angle of incidence is **greater than the critical angle**. Propagation modes: multimode step-index, multimode graded-index, single mode.

## Unguided media (wireless)

| Type | Behaviour |
|---|---|
| **Radio waves** | **Omnidirectional**, pass through walls. Below 2 MHz they use **ground** propagation |
| **Microwaves** | **Unidirectional** (parabolic dish), need **line of sight** |
| **Infrared** | Short range, line of sight, cannot pass walls |

A modem is a device, not a transmission medium.

## Exam traps

- Highest reliability = **mesh**. Needs a central hub = **star**. Multipoint = **bus**.
- Mesh cables = **n(n − 1)/2**.
- Least EMI = **fiber**. Radio = **omnidirectional**. Microwave = **line of sight**.
