FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app

COPY package.json  ./
RUN bun install 

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Объявляем ARG для переменных, которые могут быть переданы во время сборки
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_YANDEX_VERIFICATION

# Создаем .env файл с переданными аргументами
RUN echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" > .env \
    && echo "NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}" >> .env \
    && echo "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}" >> .env \
    && echo "NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}" >> .env

RUN bun run build

FROM nginx:alpine AS runner

# Create log directory and set permissions for the nginx user
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/.env /usr/share/nginx/html/.env
COPY nginx.conf /etc/nginx/nginx.conf

# Optional: Ensure nginx runs as the nginx user (usually default)
# USER nginx