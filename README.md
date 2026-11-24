# Commerce Order Console

Commerce Order Console is a full-stack order management app built for the Fynd Hiring Hackathon. It lets an operations user browse catalogue stock, create multi-product orders, track fulfilment, and cancel eligible orders. Server-side validation, transactions, and stock rules keep the UI and API consistent.

## Screenshots

> TODO: Add real UI screenshots here. No screenshot assets are currently tracked in the repository.

| Screen            | Screenshot |
| ----------------- | ---------- |
| Product catalogue | TODO       |
| Create order      | TODO       |
| Orders list       | TODO       |
| Order detail      | TODO       |

## Features

- Browse active products with price, stock, derived availability, search, and availability filtering.
- Create multi-product orders with quantity steppers, duplicate prevention, and a live order summary.
- Use server-generated order references and server-calculated totals.
- Search, filter, and paginate orders; inspect line items and product names on the detail page.
- Move orders through `PLACED → PACKED → SHIPPED` and cancel `PLACED` or `PACKED` orders.
- Restore stock on cancellation and roll back stock on failed order creation.
- Validate requests with shared Zod schemas and surface API failures in the UI.

## Engineering highlights

- **Prisma transactions:** order creation and cancellation update orders, items, and stock as one unit of work.
- **Atomic stock decrements:** conditional `updateMany` checks prevent two orders from overselling the same row.
- **Automatic rollback:** insufficient stock on any line aborts the whole order, leaving no order and no partial stock deduction.
- **Transactional restock:** cancellation increments every ordered product back to stock in the same transaction that sets `CANCELLED`.
- **Status validation:** the API rejects illegal transitions such as `PLACED → SHIPPED`, even if the UI hides the button.
- **Server-owned money and identity:** prices, subtotals, totals, and references are computed on the server with `Prisma.Decimal`.
- **Shared contracts:** `@repo/schemas` drives both form validation and API request validation.
- **Layered API:** routes wire middleware/controllers, controllers handle HTTP, services own business logic and database access.
- **Typed environment:** `@repo/env` validates required server and client variables at startup.
- **Query/cache discipline:** mutations invalidate affected order and product queries so the UI stays in sync.

## Architecture

```mermaid
flowchart LR
  Browser --> Web["Web<br/>Next.js"]
  Web --> API["API<br/>Express"]
  API --> DB[(PostgreSQL)]

  Shared["@repo/ui · @repo/schemas · @repo/env · @repo/db"] -.-> Web
  Shared -.-> API
```

pnpm workspaces manage the repo; Turborepo runs `build`, `lint`, `check-types`, `test`, and `dev` tasks.

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript 7, Tailwind CSS 4, Base UI, TanStack Query 5, Axios, React Hook Form, Zod, Tabler icons, Sonner
- **Backend:** Express 5, TypeScript 7, tsup, Zod, Vitest
- **Database:** PostgreSQL 17, Prisma 7, `@prisma/adapter-pg`, `pg`
- **Tooling:** pnpm, Turborepo 2, ESLint 10, Prettier 3

## Getting started

Prerequisites: Node.js `>=24`, pnpm `11.25.0`, Docker with Compose.

```sh
pnpm install
```

Create `.env.local` in the repository root using the placeholders in the environment section, then start the services:

```sh
pnpm compose:up
pnpm prisma:generate
pnpm prisma:dev
pnpm --filter @repo/db seed:products
pnpm dev
```

| Surface      | URL                                |
| ------------ | ---------------------------------- |
| Web console  | `http://localhost:3000`            |
| Products     | `http://localhost:3000/products`   |
| Orders       | `http://localhost:3000/orders`     |
| Create order | `http://localhost:3000/orders/new` |
| API base     | `http://localhost:8000/api/v1`     |

## Environment variables

| Variable                   | Placeholder value                                                                                                                | Purpose                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `NODE_ENV`                 | `development`                                                                                                                    | Environment mode; defaults to `development` |
| `PORT`                     | `8000`                                                                                                                           | API port; defaults to `8000`                |
| `POSTGRES_USER`            | `replace-with-local-db-user`                                                                                                     | Postgres role                               |
| `POSTGRES_PASSWORD`        | `replace-with-local-db-password`                                                                                                 | Postgres password                           |
| `POSTGRES_DB`              | `replace-with-local-db-name`                                                                                                     | Development database name                   |
| `DATABASE_URL`             | `postgresql://replace-with-local-db-user:replace-with-local-db-password@localhost:5432/replace-with-local-db-name?schema=public` | Prisma connection string                    |
| `NEXT_PUBLIC_FRONTEND_URL` | `http://localhost:3000`                                                                                                          | CORS allowlist origin                       |
| `NEXT_PUBLIC_BACKEND_URL`  | `http://localhost:8000`                                                                                                          | Browser API base URL                        |

## Database setup

Schema lives in `packages/db/prisma/schema.prisma`. The checked-in migration is in `packages/db/prisma/migrations/`.

```sh
pnpm prisma:generate   # generate Prisma client
pnpm prisma:dev        # push schema to dev DB
pnpm prisma:prod       # apply checked-in migrations
pnpm prisma:reset      # destructive reset
pnpm --filter @repo/db seed:products
```

The seed inserts six products: T-shirt, Hoodie, Cap, Mug, Sticker Pack, and Desktop pad.

## Testing

```sh
pnpm compose:test:up
pnpm test
```

Targeted suites:

```sh
pnpm --filter @repo/schemas test
pnpm --filter server test
```

| Suite              | Scenario covered                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Schema unit tests  | Valid single/multi-product orders; invalid UUIDs, quantities, duplicates, extra price/total fields |
| Server integration | Order saved with total `45.50`, two line items, and stock deducted `10 → 8` and `5 → 4`            |
| Server integration | Insufficient stock on one item leaves no order and no stock changes                                |
| Server integration | Illegal `PLACED → SHIPPED` transition returns `409 CONFLICT` and leaves status `PLACED`            |

Tests use a separate Postgres service on port `5433`; do not point the test config at the development database.

## API overview

Base URL: `http://localhost:8000`. All responses use `{ status, data, message, error, success }`.

| Method  | Endpoint                    | Essential request                      | Essential response data                       |
| ------- | --------------------------- | -------------------------------------- | --------------------------------------------- |
| `GET`   | `/api/v1/products`          | none                                   | Products with `id`, `name`, `price`, `stock`  |
| `POST`  | `/api/v1/orders`            | `{ items: [{ productId, quantity }] }` | `id`, `reference`, `status`, `total`, `items` |
| `GET`   | `/api/v1/orders`            | `?page=1&limit=10&search=&status=`     | `items` plus `pagination`                     |
| `GET`   | `/api/v1/orders/:id`        | UUID path param                        | Order detail with per-item `productName`      |
| `PATCH` | `/api/v1/orders/:id/status` | `{ status: "PACKED" }`                 | Updated order detail                          |

Expected failures: `400 VALIDATION_ERROR`, `404 NOT_FOUND`, and `409 CONFLICT` for stock or transition problems.

## Project structure

```text
apps/
  web/       Next.js routes, components, hooks, API clients
  server/    Express routes, controllers, services, tests
packages/
  db/        Prisma schema, migrations, seed
  env/       Typed environment schemas
  schemas/   Shared Zod contracts
  ui/        Shared components
```
