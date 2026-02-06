# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** implementing a full-stack application with DDD (Domain-Driven Design), CQRS (Command Query Responsibility Segregation), and Event-Driven Architecture. The project consists of a NestJS GraphQL backend API and a Next.js 16 web application.

## Architecture

### High-Level Architecture

The system implements a **layered architecture** with clear separation of concerns:

- **Domain Layer**: Core business logic with aggregates, value objects, and domain events
- **Application Layer**: CQRS implementation with commands, queries, and event handlers
- **Infrastructure Layer**: Database implementations (TypeORM for PostgreSQL writes, MongoDB for reads)
- **Transport Layer**: GraphQL API with resolvers, DTOs, and mappers

### Event-Driven Architecture

The system uses **event sourcing patterns** where:
- Domain events are published when aggregate state changes
- Event handlers asynchronously update read models in MongoDB
- Write models (aggregates) are persisted in PostgreSQL via TypeORM
- Read models (view models) are stored in MongoDB for optimized queries
- Events are distributed via NestJS CQRS EventBus

### Bounded Contexts

The API is organized into **bounded contexts**:

**Core Contexts** (`apps/api/src/core/`):
- `plant-context`: Plant management domain
- `location-context`: Location management domain

**Generic Contexts** (`apps/api/src/generic/`):
- `auth`: Authentication and authorization with JWT
- `users`: User management
- `saga-context`: Distributed transaction orchestration
- `overview`: Dashboard/overview functionality

**Support Contexts** (`apps/api/src/support/`):
- `health`: Health checks and monitoring
- `logging`: Centralized logging with Winston
- `math`: Mathematical utilities

## Development Commands

### Monorepo Commands (from root)

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=api       # Start only the API
pnpm dev --filter=web       # Start only the web app

# Build
pnpm build                  # Build all apps and packages
pnpm build --filter=api     # Build only the API
pnpm build --filter=web     # Build only the web app

# Linting
pnpm lint                   # Run linting across the project
pnpm lint:fix               # Run linting with auto-fix
pnpm format                 # Format code with Prettier

# Type Checking
pnpm check-types            # Verify TypeScript types across the project

# Project Reset
pnpm reset                  # Reset all package versions to 0.0.0, delete changelogs
```

### API Commands (from `apps/api/`)

```bash
# Development
pnpm dev                    # Start in watch mode
pnpm start                  # Start in production mode
pnpm debug                  # Start in debug mode

# Testing
pnpm test                   # Run unit tests
pnpm test:watch             # Run tests in watch mode
pnpm test:cov               # Run tests with coverage
pnpm test:e2e               # Run end-to-end tests

# Linting
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix linting issues
```

### Web Commands (from `apps/web/`)

```bash
# Development
pnpm dev                    # Start Next.js dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Linting
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix linting issues
```

### Database Commands

TypeORM migrations are managed from the API directory:

```bash
cd apps/api

# Run migrations
pnpm typeorm migration:run

# Generate a new migration
pnpm typeorm migration:generate -n MigrationName

# Revert last migration
pnpm typeorm migration:revert
```

## DDD Architecture Patterns

This codebase follows strict DDD patterns defined in `.cursor/rules/`. Key principles:

### Domain Layer Structure

```
domain/
├── aggregates/         # Domain aggregates extending BaseAggregate
├── value-objects/      # Immutable value objects (extend base VOs)
├── repositories/       # Repository interfaces (read & write)
├── factories/          # Aggregate and view model factories
├── enums/              # Domain enums
└── primitives/         # Primitive types (serialization DTOs)
```

**Aggregates**:
- Extend `BaseAggregate` (which extends `AggregateRoot` from `@nestjs/cqrs`)
- Use private `_` prefixed properties with public getters
- All properties must be Value Objects (never primitives)
- Emit domain events via `this.apply()` for state changes
- Include `generateEvent` parameter to control event generation

**Value Objects**:
- Extend base classes: `StringValueObject`, `EnumValueObject`, `NumberValueObject`, etc.
- Are immutable with readonly properties
- Validate in constructor
- Use for ALL domain properties (IDs, names, statuses, etc.)

**Repositories**:
- Extend `IBaseWriteRepository` or `IBaseReadRepository`
- Use type aliases when no additional methods needed
- Use interfaces when extending with custom methods
- Always include Symbol token for dependency injection
- Write repositories return Aggregates, read repositories return ViewModels

### Application Layer Structure

```
application/
├── commands/            # Command handlers (write operations)
├── queries/             # Query handlers (read operations)
├── event-handlers/      # Event handlers (async processing)
├── services/           # Application services (business logic)
├── dtos/               # Data Transfer Objects (interfaces)
└── exceptions/         # Application exceptions
```

**Commands**:
- Use Value Objects for all properties
- Accept DTOs in constructor
- Handlers inject repositories with Symbol tokens
- Use factories to create aggregates
- Publish events via `EventBus.publishAll()`
- Return primitive values (e.g., `string` for IDs)

**Queries**:
- Use read repositories only
- Return ViewModels or Aggregates (never primitives)
- Use assert services for validation

**Event Handlers**:
- Update read models (ViewModels) in MongoDB
- Use factories to create ViewModels from events
- Never throw errors (handle gracefully)

### Infrastructure Layer Structure

```
infrastructure/
├── database/
│   ├── typeorm/          # PostgreSQL write repositories
│   │   ├── entities/     # TypeORM entities
│   │   ├── mappers/      # TypeORM mappers
│   │   └── repositories/ # Repository implementations
│   └── mongodb/          # MongoDB read repositories
│       ├── dtos/         # MongoDB DTOs
│       ├── mappers/      # MongoDB mappers
│       └── repositories/ # Repository implementations
```

**TypeORM (Write Side)**:
- Extend `BaseTypeormMasterRepository`
- Use soft delete (`softDelete()`) instead of hard delete
- Use mappers for entity-to-aggregate conversion

**MongoDB (Read Side)**:
- Extend `BaseMongoMasterRepository`
- Use upsert (`replaceOne` with `upsert: true`) for save operations
- Use mappers for DTO-to-ViewModel conversion

### Transport Layer Structure

```
transport/
└── graphql/
    ├── resolvers/        # Queries and mutations (separate files)
    ├── dtos/
    │   ├── requests/     # Input types (@InputType)
    │   └── responses/    # Output types (@ObjectType)
    └── mappers/          # GraphQL mappers
```

**Resolvers**:
- Separate query and mutation resolvers
- Use QueryBus for queries, CommandBus for mutations
- Use mappers to convert domain objects to DTOs
- Apply guards for authorization
- Number steps with comments (`// 01:`, `// 02:`, etc.)

### Aggregate Ordering

Aggregates and entities should be ordered to tell a clear domain story:

1. **State** - Private properties with `_` prefix
2. **Construction** - Constructor and factory methods
3. **Domain Behavior** - Public methods expressing business intent (e.g., `activate()`, `addItem()`)
4. **Internal Rules** - Private validation/helper methods (e.g., `ensureCanActivate()`)
5. **Read Access** - Public getters
6. **Serialization** - `toPrimitives()` method

## Tech Stack

### Backend (API)
- **Framework**: NestJS 10
- **GraphQL**: Apollo Server 5
- **Write DB**: PostgreSQL via TypeORM 0.3
- **Read DB**: MongoDB 7
- **Auth**: JWT with Passport
- **Testing**: Jest
- **Logging**: Winston with daily rotate file
- **Storage**: AWS S3
- **Validation**: class-validator, class-transformer

### Frontend (Web)
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Motion (Framer Motion)
- **i18n**: next-intl

### Monorepo
- **Build System**: Turborepo
- **Package Manager**: pnpm 9
- **TypeScript**: 5.9.2

## Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
MONGODB_URI="mongodb://localhost:27017/event_store"
JWT_ACCESS_SECRET="your-jwt-access-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
PORT=4100
```

## Key Principles

### Value Object Usage
- ALL domain properties must be Value Objects
- Never use primitives directly in aggregates
- Extend base Value Objects when possible (`StringValueObject`, `EnumValueObject`, etc.)

### Repository Pattern
- Write repositories use TypeORM and return Aggregates
- Read repositories use MongoDB and return ViewModels
- Always inject with Symbol tokens
- Extend base repository interfaces

### Event Publishing
- Always publish events after saving aggregates
- Use `generateEvent` parameter to control event generation
- Event handlers update read models asynchronously

### CQRS Separation
- Commands modify state and return primitive IDs
- Queries read state and return ViewModels/Aggregates
- Never use CommandBus in queries or QueryBus in mutations

### Clean Architecture
- Transport layer converts to/from DTOs
- Application layer orchestrates use cases
- Domain layer contains business logic
- Infrastructure layer handles persistence

## Application URLs

- **GraphQL API**: http://localhost:4100/graphql
- **GraphQL Playground**: http://localhost:4100/graphql (development)
- **Web App**: http://localhost:3000

## Testing

```bash
# API Tests
cd apps/api
pnpm test           # Unit tests
pnpm test:watch     # Watch mode
pnpm test:cov       # With coverage (80% threshold)
pnpm test:e2e       # End-to-end tests
```

Coverage requirements (defined in `apps/api/package.json`):
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Excluded from coverage:
- Domain repositories (interfaces)
- DTOs
- Value objects
- Module files
- Primitives

## Important Notes

### File Naming Conventions
- Aggregates: `{entity}.aggregate.ts`
- Value Objects: `{name}.vo.ts`
- Commands: `{entity}-{action}.command.ts`
- Queries: `{entity}-find-by-{criteria}.query.ts`
- Event Handlers: `{entity}-{event}.handler.ts`
- Factories: `{entity}-aggregate.factory.ts`, `{entity}-view-model.factory.ts`

### Dependency Injection
- Always use Symbol tokens for repository injection
- Example: `@Inject(EXAMPLE_WRITE_REPOSITORY_TOKEN)`

### GraphQL DTOs
- Must be classes (not interfaces) for decorators
- Use `@InputType()` for requests
- Use `@ObjectType()` for responses
- Always include field descriptions

### No Backwards Compatibility Hacks
- Don't rename unused variables with `_` prefix
- Don't re-export types that aren't used
- Don't add `// removed` comments for deleted code
- If something is unused, delete it completely

### Avoid Over-Engineering
- Only make changes that are directly requested
- Don't add features, refactoring, or "improvements" beyond what was asked
- Don't add error handling for scenarios that can't happen
- Trust internal code and framework guarantees
- Three similar lines is better than a premature abstraction
