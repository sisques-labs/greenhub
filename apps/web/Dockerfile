# Stage 1: Dependencies
# Install all dependencies (including devDependencies) for the monorepo
FROM node:20-alpine AS dependencies

WORKDIR /app

# Install pnpm (fallback to npm global install if corepack is unavailable)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate || npm install -g pnpm@9.0.0

# Copy root package files for workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files from all packages and apps
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install all dependencies (skip frozen lockfile when the file is missing)
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install --no-frozen-lockfile; \
    fi

# Stage 2: Build
# Compile TypeScript application and build Next.js
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate || npm install -g pnpm@9.0.0

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages

# Copy source code from packages (needed for workspace dependencies)
COPY packages/sdk ./packages/sdk
COPY packages/shared ./packages/shared

# Copy web app source code and configuration files
COPY apps/web/package.json ./apps/web/
COPY apps/web/next.config.ts ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/postcss.config.mjs ./apps/web/
COPY apps/web/biome.json ./apps/web/
COPY apps/web/app ./apps/web/app
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public

# Set working directory to web app
WORKDIR /app/apps/web

# Build the Next.js application
RUN pnpm build || npm run build

# Stage 3: Production
# Final lightweight image with standalone Next.js output
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from build stage
# Next.js standalone output includes server.js and node_modules in the root
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set working directory to app root (standalone output is self-contained)
WORKDIR /app

# Expose port
EXPOSE 3000

# Set environment variable for Next.js
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Next.js application
CMD ["node", "server.js"]

