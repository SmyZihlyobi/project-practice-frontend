# Project Practice

Project Practice - Next.js PWA для проектной практики ИКНТ

- Большая часть проекта общается через Apollo GraphQL, другая через Axios т.к. настроены interceptors

- Стейт менеджер Mobx

- PWA для кроссплатформености и offline-first подхода

- Полностью контейнерезировано и изолировано от общества

- Весь проект на TS

- Есть unit тесты

- Настроен husky на прекоммит

## Структура проекта

```plaintext
  src/
    ├── api/dto # Типизация ответа от бекенда
    ├── api/mutations # Мутации Graphql
    ├── api/queries # Квери запросы Graphql
    ├── store/ # Mobx сторы
    ├── app/ # Страницы и их компоненты
    ├── components/ui/ # глобальные компоненты
    ├── lib/ # глобальные классы
    ├── ...
```

## Пример .env

```bash
  NEXT_PUBLIC_BACKEND_URL=https://api.ivanmalks.online # URL бекенда
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your-key> # Токен recaptha v3
  NEXT_PUBLIC_FRONTEND_URL=https://ivanmalks.online # Урл на котором будет висеть фронт
  NEXT_PUBLIC_YANDEX_VERIFICATION=<your-key> # Код для индексации в яндексе
  COMPOSE_BAKE=true # Ускоряем сборочку
  FRONTEND_PORT=80 # Указываем порт на выход для nginx
```

## Требования

- Node.js (version >= 20)

- Docker (для изолирования)

- bun или npm или чё по кайфу

## Установка

- git clone репозиторий

- Установка зависимостей

```bash
  bun install
```

## Разработка

```bash
  bun run dev
```

## Билд

```bash
  bun run build
  bun run start
```

## Тестирование

```bash
  bun run test
```

## Запуск прод версии

### 1 вариант

Самый простой и лаконичный

```bash
  ./deploy.sh
```

### 2 вариант

Тоже лаконичный

```bash
  docker-compose up -d
```

### 3 вариант

Этот вариант собирает прямиком с докерхаба, но для него нужно настроить ci/cd

```bash
  docker run -d \
    -p 8080:80 \
    -e NEXT_PUBLIC_BACKEND_URL="https://your-backend.com" \
    -e NEXT_PUBLIC_FRONTEND_URL="https://your-frontend.com" \
    -e NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_recaptcha_site_key_value" \
    -e NEXT_PUBLIC_YANDEX_VERIFICATION="your_yandex_verification_value" \
    th3ro/smuzi_frontend:latest
```
