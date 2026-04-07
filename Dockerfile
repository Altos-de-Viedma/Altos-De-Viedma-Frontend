FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock .npmrc ./
RUN yarn install --ignore-scripts

COPY . .

# Build arguments and environment variables
ARG VITE_BACKEND_BASE_URL=__VITE_BACKEND_BASE_URL__
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
ENV NODE_ENV=production

RUN yarn build

RUN npm install -g serve

# Copy and setup entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 4186

ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "4186"]