# yash-fynd

A Turborepo monorepo starter built with Next.js, Express, BullMQ, Prisma and a
shared UI package. Use this as the foundation for new features.

## What's inside?

### Apps

- `web` — [Next.js](https://nextjs.org/) frontend (App Router, Tailwind, theming)
- `server` — [Express](https://expressjs.com/) API with Better Auth, Prisma and
  shared middleware (auth, validation, errors)
- `worker` — [BullMQ](https://docs.bullmq.io/) background job worker backed by
  Redis

### Packages

- `@repo/db` — Prisma client and schema
- `@repo/env` — typed environment variables (server + worker)
- `@repo/schemas` — shared Zod schemas
- `@repo/ui` — shared React component library (Tailwind + Base UI)
- `@repo/eslint-config` — shared ESLint configs
- `@repo/typescript-config` — shared `tsconfig` files

## Getting started

```sh
pnpm install
pnpm compose:up      # start Postgres + Redis
pnpm prisma:dev      # push the schema to the database
pnpm dev             # run all apps with Turbo
```

Copy `.env.local` values from your local environment file before running the
apps. The `server` and `worker` validate their environment on boot.

### Useful scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Run all apps and packages in dev mode |
| `pnpm build`           | Build everything                      |
| `pnpm lint`            | Lint everything                       |
| `pnpm check-types`     | Type-check everything                 |
| `pnpm prisma:generate` | Generate the Prisma client            |
| `pnpm prisma:dev`      | Push schema changes to the database   |
| `pnpm prisma:reset`    | Reset the database                    |

## Adding features

- Add an API module under `apps/server/src/modules/<name>` and mount it in
  `apps/server/src/modules/version.route.ts`.
- Add a job processor under `apps/worker/src/processors` and register it in
  `apps/worker/src/index.ts`.
- Add shared Zod schemas to `packages/schemas/src`.
- Add shared components to `packages/ui/src/components`.
