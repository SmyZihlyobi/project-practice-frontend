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

RUN bun run build

FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]