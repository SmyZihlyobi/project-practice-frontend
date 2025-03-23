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

# Объявляем ARG для переменных, которые можно передать во время сборки (опционально, если нужно менять что-то при сборке)
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_YANDEX_VERIFICATION

# Передаем ARG как ENV, чтобы они были доступны и во время выполнения контейнера.
# Если переменные окружения с такими же именами будут переданы при запуске контейнера,
# они ПЕРЕЗАПИШУТ значения, установленные здесь.
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}

RUN bun run build

FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
