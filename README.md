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

```

### 4. Migrate Prisma schemas

```bash
npx prisma migrate dev
```

If you are using an unexisting database use this command to create the database and migrate Prisma:

```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma schemas

```bash
npx prisma generate
```

### 6. Start server

```bash
npm run start
```
