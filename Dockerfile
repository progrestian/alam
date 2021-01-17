FROM node:lts-alpine AS builder
WORKDIR /alam
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --production
COPY . .
RUN npm run build

FROM alpine
WORKDIR /alam
COPY --from=builder /alam/dist ./
