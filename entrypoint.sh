#!/bin/bash
set -e

/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

php artisan migrate:fresh --seed --force

exec php artisan serve --host=0.0.0.0 --port=8000
