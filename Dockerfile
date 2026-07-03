# 1. Use a tiny, secure, lightweight Linux image that already has Node installed
FROM node:alpine

# 2. Set the working directory inside the container's isolated file system
WORKDIR /app

# 3. Copy your local scanner.js script file directly into the container
COPY scanner.js .

# 4. Define the command that executes when the container starts up
ENTRYPOINT ["node", "scanner.js"]