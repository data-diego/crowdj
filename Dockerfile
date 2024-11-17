# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -S botuser && \
    adduser -S botuser -G botuser

# Set working directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy source code
COPY src/ ./src/

# Set environment variables
ENV NODE_ENV=production

# Change ownership of the working directory to non-root user
RUN chown -R botuser:botuser /app

# Switch to non-root user
USER botuser

# Start the bot
CMD ["node", "src/index.js"]