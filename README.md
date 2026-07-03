# Containerized Network Port Scanner

A lightweight, high-performance command-line security tool written in native JavaScript (Node.js) and isolated completely within an optimized Docker container. 

This utility acts as a primitive port scanner (similar to basic Nmap functionality) to detect active ports across a target infrastructure.

## System Architecture
* **Backend Runtime:** Node.js using the built-in asynchronous `net` module.
* **Isolation Layer:** Docker Alpine-node base image to minimize security attack surface and system memory utilization.

## Defensive Features
* **Zero Dependency Footprint:** Relies strictly on core native networking modules—no third-party npm packages required.
* **Automated Asset Isolation:** Packaged via Docker to run seamlessly on any infrastructure independent of local environment dependencies.

## How To Run

### 1. Build the image locally:
```bash
sudo docker build -t local-port-scanner .