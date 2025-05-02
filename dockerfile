FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app

COPY package.json  ./
RUN bun install 

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_YANDEX_VERIFICATION

RUN echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" > .env \
    && echo "NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}" >> .env \
    && echo "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}" >> .env \
    && echo "NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}" >> .env

RUN bun run build

FROM nginx:alpine AS runner

RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/.env /usr/share/nginx/html/.env
COPY nginx.conf /etc/nginx/nginx.conf