# FeedGpt

## Client
`npm intall`
`npm run dev`
if there is a problem with that then, delete the nod_modules and the package-lock.json file and do `npm install` again.

### Warning
If you want it along the Flowise chatbot, run that first and then this. Flowise uses the same port as the client(3000), 
so it will not run if it is occupied. However the client will run on port 3001 if the 3000 is occupied. Similarly make sure that 
the client does not run in any other port except the 3000 or the 3001, and if it is the case the either change that, or add the new port 
number to the accepted ports in the main file of the backend.

## Server
## Setup Guide
first time running: `docker-compose up --build --no-recreate -d`
then: `docker-compose up -d`

### DB Migrations
`docker compose exec backend alembic revision --autogenerate -m "added gender"`
`docker compose exec backend alembic upgrade head`
#### Check the Database from the terminal
`docker exec -it 4ca8d7da2203 bash`
`psql -U dev-user -d dev_db`

## Flowise
To setup flowise you need to download it from the github repository and following the instructions below. After the 
initial setup you need to initiate a new environment and import the file we provide in the Flowise directory.

1. Go to docker folder at the root of the project

2. Copy the .env.example file and paste it as another file named .env

3. docker-compose up -d

4. Open http://localhost:3000

5. You can bring the containers down by docker-compose stop
## Endpoints
### Miniflux
http://localhost:80/
### Backend 
http://localhost:8000/
### Client
http://localhost:3000/
