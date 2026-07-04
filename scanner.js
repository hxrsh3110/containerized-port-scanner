const net = require('net');

const host = process.argv[2];
const portInput = process.argv[3]; 

if (!host || !portInput) {
    console.log("Error: Missing target or port range.");
    console.log("Usage: node scanner.js <target> <startPort-endPort> OR <port1,port2,port3>");
    process.exit(1); 
}

// 1. Dynamic Input Parsing
let portsToScan = [];
if (portInput.includes('-')) {
    const [start, end] = portInput.split('-').map(Number);
    for (let i = start; i <= end; i++) {
        portsToScan.push(i);
    }
} else {
    portsToScan = portInput.split(',').map(Number);
}

console.log(`[!] Target: ${host}`);
console.log(`[*] Initiating scan on ${portsToScan.length} ports...\n`);

// 2. The Socket Promise Wrapper
function checkPort(port, target) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        // 2-second timeout to prevent hanging on filtered ports
        socket.setTimeout(2000); 

        socket.on('connect', () => {
            console.log(`[+] SUCCESS: Port ${port} is OPEN`);
            socket.destroy();
            resolve(); // Mark this specific port scan as complete
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(); // Silently resolve to keep the batch moving
        });

        socket.on('error', () => {
            socket.destroy();
            resolve(); // Silently resolve connection refusals
        });

        socket.connect(port, target);
    });
}

// 3. Concurrency Control Engine
async function runScan() {
    const BATCH_SIZE = 100; // Throttle limit

    for (let i = 0; i < portsToScan.length; i += BATCH_SIZE) {
        // Slice a chunk of 100 ports from the main array
        const batch = portsToScan.slice(i, i + BATCH_SIZE);
        
        // Map the chunk to our Promise wrapper
        const promises = batch.map(port => checkPort(port, host));
        
        // Wait for all 100 sockets in this batch to finish before moving on
        await Promise.all(promises);
    }

    console.log("\n[!] Scan complete.");
    process.exit(0);
}

// Execute the engine
runScan();