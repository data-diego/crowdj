# Use Node.js LTS (Long Term Support) version
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Start the bot
CMD ["node", "src/index.js"]