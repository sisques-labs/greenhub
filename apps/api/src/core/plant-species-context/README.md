# Plant Species Context Module

This document describes the **Plant Species** bounded context: its purpose, architecture, main concepts, and how to work with it. It is written for developers joining the project with no prior context.

---

## Table of Contents

1. [Overview](#overview)
2. [What is a Plant Species?](#what-is-a-plant-species)
3. [Architecture at a Glance](#architecture-at-a-glance)
4. [Module Structure](#module-structure)
5. [Domain Layer](#domain-layer)
6. [Application Layer](#application-layer)
7. [Infrastructure Layer](#infrastructure-layer)
8. [Transport Layer (GraphQL API)](#transport-layer-graphql-api)
9. [Data Flow: Write Path (CQRS + Events)](#data-flow-write-path-cqrs--events)
10. [Data Flow: Read Path](#data-flow-read-path)
11. [Dependencies](#dependencies)
12. [Testing](#testing)
13. [GraphQL Usage Examples](#graphql-usage-examples)

---

## Overview

The **Plant Species** module is a [bounded context](https://martinfowler.com/bliki/BoundedContext.html) that manages the catalogue of plant species (e.g. "Tomato", "Rosa canina") and their care and growth metadata. It does **not** manage individual plants or plantings; it only manages the **species** (the “template” or “definition”) that can later be used when adding plants to the system.

The module follows:

- **Domain-Driven Design (DDD)** for the domain model
- **CQRS** (Command Query Responsibility Segregation) for application use cases
- **Event-driven** updates from the write model to the read model
- **Clean Architecture** layering: domain → application → infrastructure → transport

---

## What is a Plant Species?

A **plant species** in this system is an entity that describes:

| Concept | Description |
|--------|-------------|
| **Identity** | UUID, common name, scientific name (unique), family |
| **Description** | Free-text description |
| **Classification** | Category (e.g. VEGETABLE, FLOWER, HERB), difficulty, growth rate |
| **Environment** | Light, water, temperature range, humidity, soil type, pH range |
| **Growth** | Mature size (height/width), growth time (days), tags |
| **Curation** | `isVerified`, `contributorId` |
| **Audit** | `createdAt`, `updatedAt`, `deletedAt` (soft delete) |

All of these are expressed in the **domain** as value objects and encapsulated in the **Plant Species aggregate**.

---

## Architecture at a Glance

- **Writes** (create, update, delete) go through **commands**. The command handler loads/saves the **aggregate** in **PostgreSQL** (TypeORM) and publishes **domain events**. **Event handlers** (in infrastructure) listen to those events and update the **read model** in **MongoDB**.
- **Reads** (get by id, list by criteria) go through **queries**. Query handlers use only the **read repository** and return **view models** (read from **MongoDB**).

So:

- **Write model**: PostgreSQL + aggregate (source of truth for writes).
- **Read model**: MongoDB + view model (optimized for queries and listing).

---

## Module Structure

The module lives under `apps/api/src/core/plant-species-context/`. High-level layout:

```
plant-species-context/
├── plant-species-context.module.ts   # NestJS module: resolvers, command/query/event handlers, repos, builders, mappers
├── README.md                         # This file
├── domain/                           # Domain layer (no framework)
│   ├── aggregates/
│   ├── value-objects/
│   ├── repositories/                 # Interfaces only
│   ├── primitives/
│   ├── view-models/
│   ├── enums/
│   ├── events/                       # Field-level domain events
│   ├── dtos/
│   └── builders/
├── application/                      # Application layer (use cases)
│   ├── commands/                     # Create, Update, Delete
│   ├── queries/                      # FindById, FindByCriteria
│   ├── events/                       # Application-level events (Created, Updated, Deleted)
│   ├── services/                     # Assert exists, etc.
│   ├── exceptions/
│   └── dtos/
├── infrastructure/                    # Concrete implementations
│   ├── database/
│   │   ├── typeorm/                  # Write side (PostgreSQL)
│   │   └── mongodb/                  # Read side (MongoDB)
│   └── event-handlers/               # Sync read model on domain events
└── transport/                        # GraphQL API
    └── graphql/
        ├── resolvers/
        ├── dtos/                     # Request/response DTOs
        ├── mappers/
        └── enums/
```

The module file (`plant-species-context.module.ts`) wires: **RESOLVERS**, **APPLICATION_SERVICES**, **QUERY_HANDLERS**, **COMMAND_HANDLERS**, **EVENT_HANDLERS**, **REPOSITORIES**, **BUILDERS**, and **MAPPERS**. Event handlers (Created, Updated, Deleted) are included so the read model in MongoDB stays in sync when the write model changes.

---

## Domain Layer

The domain layer defines **what** a plant species is and **what** can be done with it, without databases or HTTP.

### Aggregate: `PlantSpeciesAggregate`

- **Location**: `domain/aggregates/plant-species/plant-species.aggregate.ts`
- **Role**: Root entity for the Plant Species aggregate. Holds all attributes as **value objects** and enforces invariants.
- **Behaviour**:
  - **Creation**: The aggregate is built by `PlantSpeciesAggregateBuilder` in the create command handler. The aggregate **constructor** applies **PlantSpeciesCreatedEvent**. The handler then saves and publishes all uncommitted events via `BaseCommandHandler.publishEvents(aggregate)`.
  - **Update**: `update(props)` applies field-level changes (e.g. `changeCommonName`, `changeScientificName`) and at the end applies a single **PlantSpeciesUpdatedEvent**.
  - **Delete**: `delete()` sets `_deletedAt` and applies **PlantSpeciesDeletedEvent**.
- **Events**: The aggregate uses `this.apply(...)` to record domain events. All command handlers (create, update, delete) publish these events the same way: via **BaseCommandHandler.publishEvents(aggregate)**, which calls `EventBus.publishAll(aggregate.getUncommittedEvents())` and then commits the aggregate.

### Value Objects

All attributes of the aggregate are value objects (e.g. `PlantSpeciesCommonNameValueObject`, `PlantSpeciesScientificNameValueObject`, `PlantSpeciesCategoryValueObject`). They live under `domain/value-objects/plant-species/`. Shared value objects (e.g. IDs, dates, boolean) come from `@/shared/domain/value-objects/`.

### Primitives

- **Location**: `domain/primitives/plant-species/plant-species.primitives.ts`
- **Role**: Plain TypeScript type used for serialization (e.g. aggregate → `toPrimitives()`), persistence, and event payloads. No behaviour.

### Repositories (interfaces)

- **Write**: `IPlantSpeciesWriteRepository`  
  - **Token**: `PLANT_SPECIES_WRITE_REPOSITORY_TOKEN`  
  - **Methods**: `findById`, `save`, `delete`, plus `findByScientificName`, `findByCommonName`.  
  - **Returns**: `PlantSpeciesAggregate` (or null).

- **Read**: `IPlantSpeciesReadRepository`  
  - **Token**: `PLANT_SPECIES_READ_REPOSITORY_TOKEN`  
  - **Methods**: From `IBaseReadRepository`: `findById`, `findByCriteria`, `save`, `delete`.  
  - **Returns**: `PlantSpeciesViewModel` (or paginated view models).

### View Model

- **Location**: `domain/view-models/plant-species/plant-species.view-model.ts`
- **Role**: Read model for queries. Plain data (e.g. strings, numbers, ranges) with getters. Used by the read repository and the GraphQL mapper to build response DTOs.

### Enums

Domain enums live under `domain/enums/plant-species/` and define allowed values for category, difficulty, growth rate, light/water/humidity/soil, etc. They are used in value objects and in the GraphQL schema (via `plant-species-registered-enums.graphql.ts`).

### Domain Events (field-level)

Under `domain/events/plant-species/field-changed/` you will find events such as `PlantSpeciesCommonNameChangedEvent`, `PlantSpeciesCategoryChangedEvent`, etc. These are applied by the aggregate when a field is changed; the aggregate also applies a single **PlantSpeciesUpdatedEvent** (application event) at the end of `update()`.

### Application Events (lifecycle)

Under `application/events/plant-species/`:

- **PlantSpeciesCreatedEvent**
- **PlantSpeciesUpdatedEvent**
- **PlantSpeciesDeletedEvent**

These are the events that command handlers publish and that infrastructure **event handlers** use to keep the MongoDB read model in sync.

---

## Application Layer

The application layer implements use cases by orchestrating the domain and repositories.

### Commands and command handlers

| Command | Handler | Responsibility |
|--------|---------|----------------|
| **PlantSpeciesCreateCommand** | PlantSpeciesCreateCommandHandler | Validate scientific name uniqueness, build aggregate (via builder; constructor applies **PlantSpeciesCreatedEvent**), save to write repository, then publish all domain events via `BaseCommandHandler.publishEvents(aggregate)`. |
| **PlantSpeciesUpdateCommand** | PlantSpeciesUpdateCommandHandler | Load aggregate (assert exists), validate scientific name uniqueness if changed, call `aggregate.update(command)`, save, then publish events via `publishEvents(aggregate)`. |
| **PlantSpeciesDeleteCommand** | PlantSpeciesDeleteCommandHandler | Load aggregate, call `aggregate.delete()`, save (or delete from repo), then publish events via `publishEvents(aggregate)`. |

Commands receive DTOs with primitives; the command class builds value objects (e.g. IDs, names). All command handlers extend **BaseCommandHandler** and use the **write repository** plus **EventBus** via `this.publishEvents(aggregate)` to publish every domain event (Created, Updated, Deleted) through the same pipeline—no separate integration-events service.

### Queries and query handlers

| Query | Handler | Responsibility |
|-------|---------|----------------|
| **PlantSpeciesFindByIdQuery** | PlantSpeciesFindByIdQueryHandler | Uses **AssertPlantSpeciesViewModelExistsService** and returns a **PlantSpeciesViewModel**. |
| **PlantSpeciesFindByCriteriaQuery** | PlantSpeciesFindByCriteriaQueryHandler | Uses read repository `findByCriteria(criteria)` and returns a **PaginatedResult** of view models. |

Queries **never** use the write repository; they only use the read repository (MongoDB).

### Services

- **AssertPlantSpeciesExistsService**: Loads aggregate by id from the **write** repository; throws **PlantSpeciesNotFoundException** if not found. Used by command handlers and by the **PlantSpeciesCreatedEventHandler** to build the initial view model.
- **AssertPlantSpeciesViewModelExistsService**: Loads view model by id from the **read** repository; throws if not found. Used by **PlantSpeciesFindByIdQueryHandler**.

### Exceptions

- **PlantSpeciesNotFoundException** (domain/application): When an aggregate or view model is not found by id.
- **PlantSpeciesScientificNameAlreadyInUseException**: When create/update would violate uniqueness of scientific name.

---

## Infrastructure Layer

Infrastructure provides concrete implementations of repositories and reacts to domain events.

### Write side: TypeORM (PostgreSQL)

- **Entity**: `PlantSpeciesTypeormEntity` in `infrastructure/database/typeorm/entities/`. Maps to table `plant_species` with columns for all primitive fields (enums, jsonb for ranges/sizes/tags, etc.).
- **Mapper**: `PlantSpeciesTypeormMapper` converts between `PlantSpeciesTypeormEntity` and `PlantSpeciesAggregate` (using primitives and aggregate factory/builder as appropriate).
- **Repository**: `PlantSpeciesTypeormRepository` implements `IPlantSpeciesWriteRepository`, uses TypeORM repository and the TypeORM mapper. Registered in the module with `PLANT_SPECIES_WRITE_REPOSITORY_TOKEN`.

### Read side: MongoDB

- **DTO**: `PlantSpeciesMongoDbDto` (or similar) describes the document shape in MongoDB.
- **Mapper**: `PlantSpeciesMongoDBMapper` converts between MongoDB documents and `PlantSpeciesViewModel`.
- **Repository**: `PlantSpeciesMongoRepository` implements `IPlantSpeciesReadRepository`, uses MongoDB collection and the MongoDB mapper. Registered with `PLANT_SPECIES_READ_REPOSITORY_TOKEN`.

### Event handlers

Event handlers subscribe to application lifecycle events and keep the **read model** (MongoDB) in sync:

- **PlantSpeciesCreatedEventHandler**: On **PlantSpeciesCreatedEvent**, loads the new aggregate (via AssertPlantSpeciesExistsService), builds a **PlantSpeciesViewModel** from it, and saves it to the **read** repository.
- **PlantSpeciesUpdatedEventHandler**: On **PlantSpeciesUpdatedEvent**, loads the aggregate, builds the updated view model, and saves it to the read repository (upsert).
- **PlantSpeciesDeletedEventHandler**: On **PlantSpeciesDeletedEvent**, removes (or marks deleted) the view model in the read repository.

These handlers live under `infrastructure/event-handlers/plant-species/`. They are registered in the NestJS module **providers** via the `EVENT_HANDLERS` array in `plant-species-context.module.ts`, so the CQRS `EventBus` can dispatch to them when commands publish domain events.

---

## Transport Layer (GraphQL API)

The only entry point for external clients is **GraphQL**. There are no REST controllers in this module.

### Resolvers

- **PlantSpeciesQueriesResolver**
  - **plantSpeciesFindById(input)**: Returns one `PlantSpeciesResponseDto` by id. Uses `PlantSpeciesFindByIdQuery`.
  - **plantSpeciesFindByCriteria(input?)**: Returns `PaginatedPlantSpeciesResultDto`. Uses `PlantSpeciesFindByCriteriaQuery` with `Criteria` built from optional filters, sorts, and pagination.

- **PlantSpeciesMutationsResolver**
  - **plantSpeciesCreate(input)**: Creates a plant species; returns `MutationResponseDto` with the new id. Uses `PlantSpeciesCreateCommand`.
  - **plantSpeciesUpdate(input)**: Updates a plant species; returns `MutationResponseDto`. Uses `PlantSpeciesUpdateCommand`.
  - **plantSpeciesDelete(input)**: Soft-deletes a plant species; returns `MutationResponseDto`. Uses `PlantSpeciesDeleteCommand`.

All resolvers use **JwtAuthGuard** and **RolesGuard** with roles **ADMIN** and **USER** (see decorators on the resolver classes).

### DTOs

- **Request DTOs** (inputs): `PlantSpeciesFindByIdRequestDto`, `PlantSpeciesFindByCriteriaRequestDto`, `PlantSpeciesCreateRequestDto`, `PlantSpeciesUpdateRequestDto`, `PlantSpeciesDeleteRequestDto`. They live under `transport/graphql/dtos/requests/plant-species/`.
- **Response DTOs**: `PlantSpeciesResponseDto` (single), `PaginatedPlantSpeciesResultDto` (list with `items`, `total`, `page`, `perPage`, `totalPages`). Nested types (e.g. temperature range, pH range, mature size) are defined in `transport/graphql/dtos/responses/plant-species/plant-species.response.dto.ts`.

### Mapper

**PlantSpeciesGraphQLMapper** converts:

- `PlantSpeciesViewModel` → `PlantSpeciesResponseDto` (`toResponseDto`)
- `PaginatedResult<PlantSpeciesViewModel>` → `PaginatedPlantSpeciesResultDto` (`toPaginatedResponseDto`)

Resolvers never expose domain types or view models directly; they always go through this mapper.

### Enums

GraphQL enums (e.g. category, difficulty, growth rate, light/water/humidity/soil) are registered via `transport/graphql/enums/plant-species/plant-species-registered-enums.graphql.ts` so that the schema and the domain enums stay aligned.

---

## Data Flow: Write Path (CQRS + Events)

1. Client sends a **mutation** (e.g. `plantSpeciesCreate`) with input.
2. **Mutation resolver** builds a **command** (e.g. `PlantSpeciesCreateCommand`) and sends it to the **CommandBus**.
3. **Command handler** runs:
   - Validations (e.g. scientific name uniqueness).
   - Load aggregate (for update/delete) or build new aggregate (for create; constructor applies **PlantSpeciesCreatedEvent**).
   - Call domain methods (e.g. `aggregate.update(command)`, `aggregate.delete()`).
   - **Save aggregate** to the **write repository** (TypeORM → PostgreSQL).
   - **Publish all domain events** via `BaseCommandHandler.publishEvents(aggregate)` (i.e. `EventBus.publishAll(aggregate.getUncommittedEvents())` and commit). Create, update, and delete all use this same path; there is no separate integration-events pipeline.
4. **Event handlers** (infrastructure) receive **PlantSpeciesCreatedEvent** / **PlantSpeciesUpdatedEvent** / **PlantSpeciesDeletedEvent** and update the **read repository** (MongoDB): create/update/delete the corresponding **view model** document.

So: one write to PostgreSQL, then asynchronous propagation to MongoDB via events.

---

## Data Flow: Read Path

1. Client sends a **query** (e.g. `plantSpeciesFindById` or `plantSpeciesFindByCriteria`) with optional input.
2. **Query resolver** builds a **query** object (e.g. `PlantSpeciesFindByIdQuery` or `PlantSpeciesFindByCriteriaQuery` with `Criteria`) and sends it to the **QueryBus**.
3. **Query handler** uses only the **read repository** (MongoDB):
   - `findById(id)` for single fetch (via assert view model exists).
   - `findByCriteria(criteria)` for list with filters, sorts, pagination.
4. Handler returns **PlantSpeciesViewModel**(s).
5. Resolver uses **PlantSpeciesGraphQLMapper** to convert view model(s) to **PlantSpeciesResponseDto** or **PaginatedPlantSpeciesResultDto** and returns them.

No write repository or aggregate is involved on the read path.

---

## Dependencies

- **NestJS**: Module system, dependency injection, guards.
- **@nestjs/cqrs**: CommandBus, QueryBus, EventBus, AggregateRoot, CommandHandler, QueryHandler, EventsHandler.
- **TypeORM**: Write repository and entity for PostgreSQL.
- **MongoDB** (via project’s Mongo client/service): Read repository for view models.
- **GraphQL** (Apollo/NestJS): Resolvers, DTOs, decorators.
- **SharedModule**: Criteria, pagination, base repositories, value objects, exceptions, etc.
- **Auth**: JwtAuthGuard, RolesGuard, UserRoleEnum (from `@/generic/auth`).

The module is registered in the app by importing `PlantSpeciesContextModule` (e.g. in `AppModule` or a core module).

---

## Testing

- **Unit tests**: Handlers (command/query), resolvers, mappers, and event handlers have `.spec.ts` files next to the implementation. They mock repositories and buses and assert on calls and return values.
- **Coverage**: Follow the project’s coverage rules (e.g. 80% where required). Domain repositories (interfaces), DTOs, value objects, and primitives are often excluded from coverage.

Running tests for this context (from repo root or `apps/api`):

```bash
pnpm test -- plant-species-context
```

Or for a specific file:

```bash
pnpm test -- core/plant-species-context/application/commands/plant-species/plant-species-create
```

---

## GraphQL Usage Examples

### Find by ID

```graphql
query {
  plantSpeciesFindById(input: { id: "123e4567-e89b-12d3-a456-426614174000" }) {
    id
    commonName
    scientificName
    category
    difficulty
    lightRequirements
    waterRequirements
    temperatureRange { min max }
    phRange { min max }
    matureSize { height width }
    growthTime
    tags
    isVerified
    createdAt
    updatedAt
  }
}
```

### Find by criteria (with filters and pagination)

```graphql
query {
  plantSpeciesFindByCriteria(input: {
    filters: [
      { field: "category", value: "VEGETABLE" }
      { field: "isVerified", value: "true" }
    ]
    sorts: [{ field: "commonName", direction: ASC }]
    pagination: { page: 1, perPage: 10 }
  }) {
    items {
      id
      commonName
      scientificName
      category
    }
    total
    page
    perPage
    totalPages
  }
}
```

### Create plant species

```graphql
mutation {
  plantSpeciesCreate(input: {
    commonName: "Tomato"
    scientificName: "Solanum lycopersicum"
    family: "Solanaceae"
    description: "A common garden vegetable"
    category: VEGETABLE
    difficulty: EASY
    growthRate: FAST
    lightRequirements: FULL_SUN
    waterRequirements: HIGH
    temperatureRange: { min: 15, max: 30 }
    humidityRequirements: MEDIUM
    soilType: LOAMY
    phRange: { min: 6.0, max: 6.8 }
    matureSize: { height: 150, width: 60 }
    growthTime: 80
    tags: ["vegetable", "annual"]
    contributorId: null
  }) {
    success
    message
    id
  }
}
```

### Update plant species

```graphql
mutation {
  plantSpeciesUpdate(input: {
    id: "123e4567-e89b-12d3-a456-426614174000"
    commonName: "Cherry Tomato"
    difficulty: MEDIUM
  }) {
    success
    message
    id
  }
}
```

### Delete plant species (soft delete)

```graphql
mutation {
  plantSpeciesDelete(input: { id: "123e4567-e89b-12d3-a456-426614174000" }) {
    success
    message
    id
  }
}
```

All of the above require a valid JWT and a role of **ADMIN** or **USER**.

---

## Summary

| Layer | Responsibility |
|-------|----------------|
| **Domain** | Aggregate, value objects, primitives, repository interfaces, view model type, domain/application events. |
| **Application** | Commands, queries, command/query handlers, assert services, application events. |
| **Infrastructure** | TypeORM (write), MongoDB (read), event handlers that sync read model. |
| **Transport** | GraphQL resolvers, request/response DTOs, mappers, enum registration. |

Writes go to PostgreSQL and are then reflected in MongoDB via domain events. Reads come only from MongoDB. The public API is GraphQL only, with authentication and role checks on all operations.
