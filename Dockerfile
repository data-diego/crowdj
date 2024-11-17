# Use Node.js LTS (Long Term Support) version
FROM node:20-alpine

# Create and set working directory 
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY src/ ./src/

# Start the bot
CMD ["node", "src/index.js"]