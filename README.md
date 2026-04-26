# Food Ordering Backend

A NestJS-based backend for the Food Ordering system, utilizing GraphQL, Prisma, and PostgreSQL.

## Prerequisites

- **Node.js**: v20 or higher
- **Docker**: For running the database locally

## Getting Started

### 1. Database Setup

Run a PostgreSQL database locally using Docker:

```bash
docker run --name food-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=food_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Environment Configuration

Create a `.env` file in the root directory and add your connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/food_db?schema=public"
```

### 3. Installation

```bash
npm install
```

### 4. Database Initialization

Execute the following commands to sync your database schema and pre-fill it with sample data:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Seed the database with sample restaurants, menus, and users
npx prisma db seed
```

### 5. Running the Application

```bash
# development mode
npm run start:dev

# production mode
npm run build
npm run start:prod
```
