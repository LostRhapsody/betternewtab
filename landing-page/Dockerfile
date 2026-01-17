# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage - serve static files
FROM oven/bun:1-alpine

WORKDIR /app

# Install serve
RUN bun add serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Serve the static files
CMD ["bunx", "serve", "-s", "dist", "-l", "3000"]
