# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Build con variables placeholder
ARG VITE_BACKEND_BASE_URL=__VITE_BACKEND_BASE_URL__
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]