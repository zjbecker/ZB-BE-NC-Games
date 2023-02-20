In order to connect to the two databases you will need to create two .env files using the following commands:

touch .env.test
touch .env.development

Each file will contain the the expression to assign the database to the environment variable:

.env.test > PGDATABASE=nc_games_test
.env.development > PGDATABASE=nc_games
