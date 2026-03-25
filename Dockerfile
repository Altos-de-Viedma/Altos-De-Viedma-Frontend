# Production Dockerfile for Altos de Viedma Frontend
# Updated: 2026-03-25 - Enhanced Security Configuration

# Build stage
FROM node:20-alpine as build

# Security: Update packages and remove unnecessary ones
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY --chown=nodejs:nodejs package.json yarn.lock .npmrc ./

# Security: Install dependencies with ignore-scripts
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build with security environment variables
ARG VITE_BACKEND_BASE_URL=__VITE_BACKEND_BASE_URL__
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV NODE_ENV=production
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

# Security: Run audit before build
RUN npm audit --audit-level moderate

# Build the application
RUN yarn build

# Production stage with secure nginx
FROM nginx:1.25-alpine

# Security: Update packages and install security tools
RUN apk update && apk upgrade && \
    apk add --no-cache tini && \
    rm -rf /var/cache/apk/*

# Security: Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# Copy built application
COPY --from=build --chown=nginx-app:nginx-app /app/dist /usr/share/nginx/html

# Copy secure nginx configuration
COPY --chown=nginx-app:nginx-app nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx-app:nginx-app entrypoint.sh /entrypoint.sh

# Security: Set proper permissions
RUN chmod +x /entrypoint.sh && \
    chmod -R 555 /usr/share/nginx/html && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Security: Remove default nginx user and use our secure user
RUN sed -i 's/user nginx;/user nginx-app;/' /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Security: Use non-privileged port in production (change to 8080)
EXPOSE 8080

# Security: Use tini for proper signal handling
ENTRYPOINT ["tini", "--", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]