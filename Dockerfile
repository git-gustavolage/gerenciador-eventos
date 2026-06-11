ARG PHP_EXTENSIONS

FROM thecodingmachine/php:8.4-v5-apache-node22 AS base

USER root

ARG PHP_EXTENSIONS

ENV PHP_EXTENSION_GD=1 \
    PHP_EXTENSION_PCNTL=1 \
    PHP_EXTENSION_INTL=1 \
    PHP_EXTENSION_PDO_SQLITE=1 \
    PHP_EXTENSION_SQLITE3=1

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
    supervisor \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN phpenmod ${PHP_EXTENSIONS} zip

# --------- BUILD ---------
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --progress=false

COPY . .

RUN npm run build

# --------- STAGE FINAL ---------
FROM base

WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker/supervisor/laravel-worker.conf /etc/supervisor/conf.d/
COPY --from=frontend-builder /app/public/build /var/www/html/public/build
COPY . .

RUN chown -R docker:docker /var/www/html \
    && chmod -R 775 storage bootstrap/cache

RUN composer install -o --no-dev --classmap-authoritative --no-interaction

USER docker

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
