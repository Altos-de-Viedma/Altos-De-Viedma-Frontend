# Multi-stage build for optimized image size
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json yarn.lock .npmrc ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build arguments and environment variables
ARG VITE_BACKEND_BASE_URL=__VITE_BACKEND_BASE_URL__
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV NODE_ENV=production

# Build the application
RUN yarn build

# Stage 2: Production image with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy and setup entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Expose port 4186
EXPOSE 4186

# Use entrypoint script and start nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]