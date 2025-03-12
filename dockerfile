# syntax=docker.io/docker/dockerfile:1

# Базовый образ
FROM node:20-alpine AS base

# Этап установки зависимостей
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Устанавливаем зависимости
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --network-concurrency 1; \
  elif [ -f package-lock.json ]; then npm ci --prefer-offline; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Собираем приложение
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Этап production
FROM nginx:alpine AS runner

# Копируем статические файлы из сборки Next.js
COPY --from=builder /app/out /usr/share/nginx/html

# Копируем конфигурацию Nginx (опционально)
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]