### ----- POSTGRES
docker run \
    --name postgres \
    -e POSTGRES_USER=rafaelbarros \
    -e POSTGRES_PASSWORD=root \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

docker ps 
docker exec -it postgres /bin/bash
docker-machine ip default

docker run \
    --name adminer \
    -p 8181:8080 \
    --link postgres:postgres \
    -d \
    adminer

### ----- MONGODB

docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=root \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -i mongodb \
    mongo --host localhost -u admin -p root --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'rafaelbarros', pwd: 'root', roles: [{role: 'readWrite', db: 'herois'}]})"

