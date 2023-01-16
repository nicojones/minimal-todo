echo " > running migrations";

php artisan migrate:fresh;

echo " > running seeders";

php artisan db:seed --class=DatabaseSeeder;

echo " > done";
