# AppVentory API - backend for AppVentory.

AppVentory is a tool to manage applications.

Built with [nestjs](https://nestjs.com/) and [prisma](https://prisma.io).

## Installation

Add keys
Instal mkcert https://github.com/FiloSottile/mkcert

```bash
mkcert -install
mkcert localhost
```

Install dependencies
```bash
$ npm install
```

## Running the app

Launch the database

```bash
docker-compose up -d
```

## Seed the database
```bash
npx prisma generate && npx prisma db push --force-reset && npx prisma db seed
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Open your browser: https://localhost:3000

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```