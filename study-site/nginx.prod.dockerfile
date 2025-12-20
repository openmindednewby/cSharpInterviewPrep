# Stage 1 BUILD
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript sources into dist/
RUN npm run build

# Stage 2 copy build into nginx
FROM nginx:alpine

# move to the location inside the image where the nginx configuration is
WORKDIR /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

# the folder inside the image that we specifiy in nginx.config
WORKDIR /webgl

# Copy static assets and HTML entrypoint
COPY index.html manifest.webmanifest service-worker.js favicon.ico face-deep-house-good-vibes-black.png ./

# Copy the freshly built JavaScript
COPY --from=build /app/dist ./dist


