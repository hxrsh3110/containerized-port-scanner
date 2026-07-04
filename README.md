# Containerized Network Reconnaissance Tool

An asynchronous, containerized TCP network port scanner engineered with Node.js. 

### 🔍 What does this tool do? (High-Level Overview)
Think of a server on the internet like a massive office building with 65,535 doors (ports). 
Some doors need to be open so the public can enter (like Port 80 for a website). Other doors should be strictly locked (like Port 22 for administrative backend access). 

This tool is a specialized security auditor. It rapidly walks around the perimeter of the building, checking every single door to see which ones are open, closed, or ignoring requests. Security teams use this data (Attack Surface Management) to find exposed entry points before malicious actors do.

---

## 🏗️ Architecture & Engineering

While tools like Nmap exist, this project was built from scratch to demonstrate a deep understanding of network protocols, asynchronous programming, and container security.

* **Asynchronous Concurrency:** Implements a Promise-based batching engine. Instead of flooding the network with thousands of simultaneous requests (which causes local OS file descriptor exhaustion or NAT crashes), the engine throttles connections to **100 concurrent sockets** at a time.
* **Intelligent Defaults:** Dynamically parses command-line arguments. Accepts specific port lists, ranges, or automatically defaults to scanning the top 1000 ports if no parameters are provided.
* **Graceful Timeout Management:** Configured with a strict 2000ms timeout to silently drop filtered or unresponsive ports without stalling the execution thread.
* **Hardened Containerization:** Packaged in a multi-stage `node:20-alpine` Docker image (reducing the attack surface to ~50MB). Enforces the principle of least privilege by dropping root access and executing via a restricted `appuser`.

## ⚙️ Prerequisites
* [Docker](https://docs.docker.com/get-docker/) installed and running.

## 🚀 Installation & Build

Clone the repository and build the minimal Docker image:

```bash
git clone [https://github.com/yourusername/reconnaissance-tool.git](https://github.com/yourusername/reconnaissance-tool.git)
cd reconnaissance-tool
docker build -t net-scanner . 
```
## 🛠️ Usage
The tool is executed directly via Docker. The --rm flag is recommended to instantly remove the container footprint after execution.

1. Default Sweep (Scans the top 1000 ports)

```bash
docker run --rm net-scanner example.com
```
2. Targeted Port List

```bash
docker run --rm net-scanner google.com 80,443,8080
```
3. Specific Port Range

```bash 
docker run --rm net-scanner scanme.nmap.org 75-85
```

## 🔒 Security & Operational Considerations
Permissions: This tool generates live TCP traffic. Only scan targets you have explicit authorization to audit (e.g., your own infrastructure, local networks, or designated test targets like scanme.nmap.org).

Resource Limits: The batching engine prevents local denial-of-service, but aggressive scanning on restrictive corporate networks may still trigger Intrusion Detection Systems (IDS).