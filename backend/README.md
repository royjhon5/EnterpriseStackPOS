# Enterprise POS API

NestJS backend for an enterprise point-of-sale domain, organized around CQRS-style commands and queries with vertical slices for modules such as tenants, users, roles, permissions, and branches.

## What is in this repository

- **NestJS 11** application bootstrapped through Express.
- **CQRS handlers** under `src/Application` for command/query workflows.
- **TypeORM + MySQL** configuration for domain entities and migrations.
- **Developer-friendly landing page** at `/`.
- **Health endpoint** at `/health` with HTML and JSON responses.
- **Swagger / OpenAPI** support that can be enabled, renamed, and protected with basic auth.

## Project structure

```text
src/
├── Application/        # Commands, queries, handlers, provider registration
├── Configurations/     # JWT, Swagger, and auth-related setup
├── Controllers/        # HTTP controllers grouped by feature
├── Domain/             # Database context and domain entities
├── Models/             # DTOs and shared models
├── Services/           # Cross-cutting services and validation helpers
├── Settings/           # Infrastructure settings such as DB connection config
└── pages/              # Rendered HTML for landing and health pages
```

## Environment variables

The app reads environment variables with a prefix based on `NODE_ENV`:

- `development` → `DEV_`
- `production` → `PROD_`

### App and Swagger settings

| Variable | Description | Default |
| --- | --- | --- |
| `DEV_APP_NAME` / `PROD_APP_NAME` | App title shown in the landing page and Swagger UI. | `Enterprise POS API` |
| `DEV_PORT` / `PROD_PORT` | Port used when running the local Express/Nest server. | `3000` |
| `DEV_ENABLE_SWAGGER` / `PROD_ENABLE_SWAGGER` | Enables Swagger UI and OpenAPI JSON routes. | `true` |
| `DEV_SWAGGER_PATH` / `PROD_SWAGGER_PATH` | Route prefix for Swagger UI. | `swagger` |
| `DEV_SWAGGER_USER` / `PROD_SWAGGER_USER` | Optional basic-auth username for Swagger. | _unset_ |
| `DEV_SWAGGER_PASS` / `PROD_SWAGGER_PASS` | Optional basic-auth password for Swagger. | _unset_ |

### Database settings

These variables are consumed by the TypeORM MySQL connection:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### JWT settings

- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_EXPIRES_IN_MINUTES`
- `JWT_REFRESH_EXPIRES_IN_DAYS`

## Getting started

```bash
npm install
```

Create a `.env` file or export environment variables before starting the app.

## Run the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production build
npm run build
npm run start:prod
```

## Available routes

| Route | Description |
| --- | --- |
| `/` | Landing page with quick links to docs and health. |
| `/health` | HTML health page. |
| `/health?format=json` | JSON health payload for automation/monitoring. |
| `/<swaggerPath>` | Swagger UI when enabled. |
| `/<swaggerPath>-json` | OpenAPI document when enabled. |

## Database migrations

```bash
# generate a migration
npm run migration:generate --name=MyMigrationName

# apply migrations
npm run migration:run

# revert the last migration
npm run migration:revert
```

## Quality checks

```bash
npm run test
npm run lint
```

## Notes

- Swagger basic auth is applied only when both `SWAGGER_USER` and `SWAGGER_PASS` are set for the active environment prefix.
- The `/health` route returns HTML by default and JSON when `format=json` is passed or when the request prefers `application/json`.
