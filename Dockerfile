# 1. Base Image: Use the minimal Alpine Linux distribution to reduce the attack surface.
FROM node:20-alpine

# 2. Workspace: Define a specific working directory inside the container.
WORKDIR /usr/src/scanner

# 3. Copy Code: Move the local script into the container workspace.
COPY scanner.js .

# 4. Privilege Drop: Create a non-root user and switch to it. 
# Security tools should never run as root unless explicitly required.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 5. Execution: Use ENTRYPOINT instead of CMD. 
# This forces the container to behave like an executable binary.
ENTRYPOINT ["node", "scanner.js"]