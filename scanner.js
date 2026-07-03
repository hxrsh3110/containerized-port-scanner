const net = require('net');

// process.argv captures terminal inputs. 
// Index 0 is Node, Index 1 is the file path, Index 2 is your input argument.
const host = process.argv[2];

// If the user forgets to type a target, stop the script and explain how to use it
if (!host) {
    console.log("Error: Please specify a target host.");
    console.log("Usage: node scanner.js <website-or-ip-address>");
    process.exit(1); 
}

const portsToScan = [21, 22, 80, 443, 8080];

console.log(`[!] Initializing security port scan for target: ${host}`);
console.log(`[*] Testing common ports: ${portsToScan.join(', ')}\n`);

for (let i = 0; i < portsToScan.length; i++) {
    const currentPort = portsToScan[i];
    const socket = new net.Socket();
    
    // Give external web servers 2 seconds to respond
    socket.setTimeout(2000); 

    socket.on('connect', () => {
        console.log(`[+] SUCCESS: Port ${currentPort} is OPEN on ${host}`);
        socket.destroy();
    });

    socket.on('timeout', () => {
        socket.destroy();
    });

    socket.on('error', () => {
        socket.destroy();
    });

    socket.connect(currentPort, host);
}