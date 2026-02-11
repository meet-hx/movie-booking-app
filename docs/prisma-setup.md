# Prisma Setup Overview

## Step-by-step

1. Define the relational schema in `prisma/schema.prisma` with enums, relations, and indexes.
2. Run `npx prisma generate` after dependency install to create a type-safe Prisma Client.
3. Use `npx prisma migrate dev --name <migration-name>` in development to create and apply migrations.
4. Use `npx prisma migrate deploy` in production to apply checked-in migrations.
5. Ensure the NestJS `PrismaService` connects on module init and registers shutdown hooks.
6. Access data through repository interfaces and inject Prisma-backed implementations via tokens.

## Folder structure

- `src/domain`: Entities and repository interfaces.
- `src/application`: Application services and use cases.
- `src/infrastructure`: Prisma module/service and repository implementations.
- `src/presentation`: HTTP controllers (kept free of business logic).

## Migration strategy

- **Development:** `prisma migrate dev` to create iterative migrations from schema updates.
- **Production:** `prisma migrate deploy` to apply migrations generated and reviewed in CI/CD.
- **Client generation:** `prisma generate` after install/build to keep Prisma Client in sync.
