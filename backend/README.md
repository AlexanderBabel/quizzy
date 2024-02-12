# Quizzy 2 Backend

## Setup
1. Install NPM dependencies.
```bash
npm install
```
2. Generate Prisma files
```bash
npx prisma generate
```
3. Copy the .env.example to .env and paste in the correct values.
```bash
cp .env.example .env
```
4. Start the database with docker compose. The database will be available at localhost:5454
```bash
docker compose up -d
```
5. Migrate the database
```bash
npx prisma migrate dev --name init
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build with Docker
```bash
docker build -t ghcr.io/pss-uu/quizzy-2-backend:dev .
```

Build multi platform build for production
```bash 
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/pss-uu/quizzy-2-backend:latest --push .
```

Run with Docker
```bash
docker compose --profile api up -d
```
