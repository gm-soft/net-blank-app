docker-compose -f "elk/docker-compose.yml" stop
docker-compose -f "elk/docker-compose.yml" rm --force
docker-compose -f "elk/docker-compose.yml" up --build elasticsearch kibana