## What the application layer is

The top layer: the protocols that programs use to talk to each other over the network. HTTP for the web, SMTP for email, DNS for names, FTP for files. Its data unit is the **message**, and its address is the **URL** (PB Q379, Q380).

**Responsibilities** (Q397, Q405):
- Give users and programs access to network services (web, mail, file transfer, remote login).
- Define the **types of messages** exchanged, their **format (syntax)**, their **meaning (semantics)**, and the **rules for when and how** processes send and respond (PB Q394).
- Identify the communicating partners and check that resources are available.

## Two architectures

- **Client–server**: an always-on **server** with a fixed address, and **clients** that request from it. Clients do not talk to each other. Example: the web.
- **Peer-to-peer (P2P)**: no central server. Peers request and serve each other. It scales well. Example: BitTorrent.
- Some apps use both (hybrid). The PB answer for "architecture paradigms" is **both** (Q381).

## What an application needs from transport

| Need | Example apps |
|---|---|
| **No data loss** | File transfer, email, web |
| **Timing (time-sensitive)** | Internet telephony, interactive games, video calls |
| **Bandwidth-sensitive** | Video streaming |
| **Elastic** (any speed works) | **Email**, file transfer, web |

Email is an **elastic** application (Q384). **Internet telephony** is time-sensitive (Q385). The odd one out of file transfer, file download, email and **interactive games** is the game (Q392).

The developer chooses the **transport protocol** and a few parameters like **buffer sizes** (Q382).

## HTTP

**HTTP** (HyperText Transfer Protocol) defines how a web client asks for pages and how the server sends them.

- Uses **TCP**, server port **80** (HTTPS: 443).
- **Stateless**: the server keeps no memory of earlier requests (cookies are added for that).
- **Non-persistent** (HTTP/1.0): one TCP connection per object, closed after the response.
- **Persistent** (HTTP/1.1, default): the connection stays open for more requests.

**Four main properties of HTTP** (Q404): client–server, request–response, stateless, and media independent (any type of data can be sent if both sides understand it). Connectionless in the sense that the client disconnects after each response.

### HTTP messages (T2 paper Q3.1, 2 marks)

There are two types of messages: **request** and **response**.

**Request message**

```
GET /index.html HTTP/1.1          ← request line: method, URL, version
Host: www.example.com             ← header lines
User-Agent: Mozilla/5.0
Accept-Language: en
                                  ← blank line
(body: empty for GET, form data for POST)
```

Methods: **GET** (fetch), **POST** (send data), **HEAD** (headers only), **PUT** (upload), **DELETE** (remove).

**Response message**

```
HTTP/1.1 200 OK                   ← status line: version, code, phrase
Date: Thu, 29 Oct 2026 10:00:00 GMT
Content-Type: text/html
Content-Length: 3285
                                  ← blank line
<html>…</html>                    ← body (the requested object)
```

Status codes: **1xx** informational, **2xx** success (200 OK), **3xx** redirect (301 Moved Permanently), **4xx** client error (404 Not Found), **5xx** server error (500).

### Web documents

- **Static**: a fixed file stored on the server.
- **Dynamic**: created by the server when requested (e.g. PHP).
- **Active**: a program sent to the client and **run at the client** (e.g. JavaScript) (Q391).

## FTP

**FTP** (File Transfer Protocol) moves files between computers over TCP. It uses **two parallel connections**:
- **Control connection on port 21**: commands and replies, open for the whole session.
- **Data connection on port 20**: opened for each file transfer.

HTTP and FTP can both use multiple TCP connections between the same client and server (Q389).

## DNS

**DNS** (Domain Name System) translates **domain names into IP addresses** (Q387), e.g. `www.google.com` → `142.250.183.4`. It mostly uses **UDP port 53**.

- **Hierarchy**: **root servers** → **top-level domain (TLD)** servers (.com, .org, .edu, .in) → **authoritative** servers for each domain.
- A **local DNS resolver** asks these on your behalf and **caches** the answer.
- Each cached record has a **TTL** (time to live) in seconds. It counts down, and the record is thrown away at 0.

**Ex 1.** (T2 paper) A record is cached with TTL 3600 s. After 900 s without refresh, the remaining TTL = 3600 − 900 = **2700 s**.

## SMTP and email

**SMTP** (Simple Mail Transfer Protocol) **sends** mail: from your mail client to your mail server, and from your server to the receiver's server. It uses **TCP port 25**. Mail is **read** with **POP3** (110) or **IMAP** (143).

- **User agent (UA)**: the program you use to read and write mail (Gmail app, Outlook).
- **Mail transfer agent (MTA)**: the server software that moves mail between servers using SMTP.

**Steps to send a mail** (Q398, Q408):
1. You write the mail in your **user agent**.
2. The UA sends it to your **mail server** with SMTP.
3. Your server's **MTA** opens a TCP connection to the receiver's mail server (port 25) and transfers it with SMTP.
4. The mail waits in the receiver's **mailbox**.
5. The receiver's UA fetches it with **POP3 or IMAP**.

**Functions of SMTP** (Q401): set up a TCP connection between mail servers, transfer the mail (HELO, MAIL FROM, RCPT TO, DATA, QUIT), report delivery errors, and relay mail through intermediate servers.

## Other protocols

| Protocol | Job | Transport, port |
|---|---|---|
| HTTP / HTTPS | Web | TCP 80 / 443 |
| FTP | File transfer | TCP 20 (data), 21 (control) |
| SMTP | Send mail | TCP 25 |
| POP3 / IMAP | Read mail | TCP 110 / 143 |
| DNS | Names → IP | UDP (and TCP) 53 |
| Telnet | Remote login, sends keystrokes (Q388) | TCP 23 |
| SSH | Secure remote login | TCP 22 |
| DHCP | Gives a host its IP automatically | UDP 67/68 |
| SNMP | Network management | UDP 161 |

Which protocol uses **both** TCP and UDP (Q364)? **DNS**: normal lookups go over UDP (small and fast). Zone transfers between DNS servers, and answers larger than 512 bytes, use TCP.

## Exam traps

- UDP and TCP are **not** application layer protocols (Q395, Q396).
- SMTP **sends**; POP3/IMAP **receive**.
- FTP: 21 = control, 20 = data.
- Email is **elastic**, not loss-tolerant.
