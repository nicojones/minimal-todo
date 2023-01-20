#!/bin/bash

# git pull https://github.com/nicojones/minimal-todo
export COMPOSER_ALLOW_SUPERUSER=1
echo "PULLING"
git pull origin main
cd /var/www/minimaltodo-api/laravel
echo "INSTALLING"
php8.1 composer.phar install # --ignore-platform-reqs
echo "MAKING STORAGE WRITABLE"
chmod -R 777 storage

echo "CLEARING CACHE"
#php8.1 artisan config:cache
#php8.1 artisan config:clear
#php8.1 artisan cache:clear
php8.1 artisan optimize:clear

#echo "UPDATING COMPOSER DEPS"
#php8.1 composer.phar update # --ignore-platform-reqs

echo "REMOVING FRONTEND"
cd /var/www/minimaltodo-api
rm -rf app

echo "PULLING FRONTEND"
cd /var/www/minimaltodo
git pull

echo "COPY ENV"
cp /var/www/minimaltodo-api/env.production /var/www/minimaltodo-api/laravel/.env

echo "DONE"
