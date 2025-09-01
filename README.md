# cool-tool

Nest + GraphQL + REST + Prisma (Postgres)

### Build your tiny API store.

The target of the store will be definied the first days of the challenge.

## Technical Requirements

* PostgreSql
  ** Kysely / Drizzle
  ** Prisma
* NestJS
* Typescript
* Prettier
* Eslint

## Setup / Run

### 1. Clone repo & enter folder
```bash
git clone https://github.com/YOUR_USER/my-store.git
```

### 2. Install dependencies:

```bash
npm install
# or
yarn install
```

### 3. Create a .env.development file in the project root with:

```bash
ENV_MODE = "development"
PORT=PORT
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="JWT_SECRET"
JWT_EXPIRATION_TIME="15m"
STRIPE_SECRET_KEY="STRIPE_SECRET_KEY"
WEB_HOOK_SECRET="WEB_HOOK_SECRET"
STRIPE_API_KEY="STRIPE_API_KEY"
REDIS_HOST="REDIS_HOST"
REDIS_PORT=REDIS_PORT
REDIS_PASSWORD="REDIS_PASSWORD"
REDIS_USERNAME="default"
CLOUDINARY_CLOUD_NAME = "cloud_name"
CLOUDINARY_API_KEY = "CLOUDINARY_API_KEY",
CLOUDINARY_API_SECRET: "CLOUDINARY_API_SECRET"
```

### 4. Migrate Prisma schemas

```bash
npm run migrate:dev
```


### 5. Generate Prisma schemas

```bash
npx prisma generate
```

### 7. Generate Prisma seeds

```bash
npx prisma generate
```


### 6. Start server

```bash
npm run start:dev
```
