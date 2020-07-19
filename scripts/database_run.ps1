docker-compose -f "sql-server/docker-compose.yml" stop
docker-compose -f "sql-server/docker-compose.yml" rm --force
docker-compose -f "sql-server/docker-compose.yml" up --build database