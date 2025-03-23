FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock* .npmrc* ./
RUN bun install --frozen-lockfile

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Объявляем ARG для переменных, которые *МОГУТ* быть переданы во время сборки.
# Значения по умолчанию НЕ указываем здесь!
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_YANDEX_VERIFICATION

# Используем ENV для установки переменных окружения внутри контейнера.
# Значения берутся из ARG (если они были переданы), иначе остаются НЕОПРЕДЕЛЕННЫМИ.
# Важно: переменные, установленные через ENV, будут доступны и во время сборки, и во время выполнения.
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}

RUN bun run build

FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
