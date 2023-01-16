if [[ $* == *--local* ]]; then
  echo " > setting artisan env";
  export APP_ENV=artisan;
fi


echo " > running migrations";

if [[ $* == *--refresh* ]]; then
  echo "   > clear and rerun migration";
  php artisan migrate:refresh;
else
  echo "   > update migrations";
  php artisan migrate;
fi

if [[ $* == *--seed* ]]; then 
  echo " > running seeders";
  php artisan db:seed --class=DatabaseSeeder;
else
  echo " > skipping seeds";
fi

echo " > done";
