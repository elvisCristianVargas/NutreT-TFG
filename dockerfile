FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip curl \
    && docker-php-ext-install pdo pdo_mysql zip \
    && a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN mkdir -p storage/recipes && chmod -R 775 storage

COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80