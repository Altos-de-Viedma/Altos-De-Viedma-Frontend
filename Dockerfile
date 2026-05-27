# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (dev + prod) needed for build
# --ignore-scripts avoids postinstall audit that breaks CI
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy source code
COPY . .

# Build args for environment variables baked into the build
ARG VITE_BACKEND_BASE_URL=__VITE_BACKEND_BASE_URL__
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

# Build the production bundle
RUN npx vite build

# ============================================
# Stage 2: Production (serve with vite preview)
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Only install vite (needed for `vite preview`) and its react plugin (needed by vite.config.ts)
RUN npm install --no-save vite@5 @vitejs/plugin-react@4

# Copy the built dist from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/package.json ./package.json

# Default port
ENV PORT=4186

EXPOSE 4186

# Log and serve
CMD echo "🚀 Frontend running on port $PORT" && npx vite preview --host 0.0.0.0 --port $PORT