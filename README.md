# Фронтенд по проектной деятельности

## Для конфигурации env

```
NEXT_PUBLIC_BACKEND_URL=<URL на котором держится бек>
```

## Запуск локальной версии

### Установка пакетов

```
yarn
```

### Локальный билд

```
yarn dev
```

## Запуск прод версии

```
docker run -d \
  -p 8080:80 \
  -e NEXT_PUBLIC_BACKEND_URL="https://your-backend.com" \
  -e NEXT_PUBLIC_FRONTEND_URL="https://your-frontend.com" \
  -e NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_recaptcha_site_key_value" \
  -e NEXT_PUBLIC_YANDEX_VERIFICATION="your_yandex_verification_value" \
  th3ro/smuzi_frontend:latest
```
