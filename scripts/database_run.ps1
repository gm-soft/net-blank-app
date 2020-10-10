docker-compose -f "postgresql/docker-compose.yml" stop
docker-compose -f "postgresql/docker-compose.yml" rm --force
docker-compose -f "postgresql/docker-compose.yml" up --build database pgadmin4