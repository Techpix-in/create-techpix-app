# Use Node.js base image (Node 20 recommended)
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files and install dependencies in a separate stage for caching
COPY package.json package-lock.json ./
RUN npm ci

# Build the application in a separate stage
FROM base AS builder
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Prepare production image with only necessary files
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security purposes
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy built files and static assets from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership of files to non-root user for security
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Start application using standalone mode server.js file
CMD ["node", "./server.js"]
