Puesta a punto de la base de datos

Crear el contenedor de docker:
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=tangerin_player --name tangerin_player mysql

Para iniciar la API debemos ejecutar:
npm run dev

Para crear la BBDD y los datos de prueba debes ejecutar estos comandos:
npx prisma generate
npx prisma migrate dev
npm run seed

