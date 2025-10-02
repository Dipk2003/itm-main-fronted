# Indian Trade Mart Frontend - Production Dockerfile
# Multi-stage build for optimized production deployment

# ========== BUILD STAGE ==========
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies with production optimizations
RUN npm ci --only=production --frozen-lockfile \
    && npm cache clean --force

# Copy source code
COPY . .

# Set build-time environment variables
ARG NODE_ENV=production
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_BUILD_TIME
ARG NEXT_PUBLIC_ENVIRONMENT=production

ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_BUILD_TIME=${NEXT_PUBLIC_BUILD_TIME}
ENV NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}

# Build the application
RUN npm run build

# ========== PRODUCTION STAGE ==========
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile \
    && npm cache clean --force \
    && rm -rf /root/.npm

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create monitoring directory
RUN mkdir -p /app/monitoring/logs \
    && chown -R nextjs:nodejs /app/monitoring

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

# ========== DEVELOPMENT STAGE (Multi-target) ==========
FROM node:20-alpine AS development

WORKDIR /app

# Install system dependencies including development tools
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git \
    curl

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Create development user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app

# Set development environment
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs

EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# ========== TESTING STAGE ==========
FROM node:20-alpine AS testing

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    git \
    curl \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set test environment
ENV NODE_ENV=test

# Run tests
CMD ["npm", "run", "test"]

# ========== NGINX STATIC STAGE (for static export) ==========
FROM nginx:alpine AS static

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy static build from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Add health check script
RUN echo '#!/bin/sh\ncurl -f http://localhost:80/ || exit 1' > /health-check.sh \
    && chmod +x /health-check.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /health-check.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
