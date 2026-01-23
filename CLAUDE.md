# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** implementing a modern application stack with DDD (Domain-Driven Design), CQRS (Command Query Responsibility Segregation), and Event-Driven Architecture. The project includes a NestJS GraphQL API backend and a Next.js 16 web frontend.

## Development Commands

### Monorepo-wide Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Development (specific app)
pnpm dev --filter=api
pnpm dev --filter=web

# Build all apps
pnpm build

# Build specific app
pnpm build --filter=api

# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm check-types

# Formatting
pnpm format
pnpm format:check
```

### API-specific Commands

```bash
cd apps/api

# Development modes
pnpm dev                    # Watch mode
pnpm debug                  # Debug mode
pnpm start                  # Production mode

# Testing
pnpm test                   # Run all tests
pnpm test:watch             # Watch mode
pnpm test:cov               # With coverage (80% threshold)
pnpm test:e2e               # End-to-end tests
```

### Testing Guidelines

- Coverage thresholds are set to 80% for branches, functions, lines, and statements
- Excluded from coverage: repositories, interfaces, DTOs, value objects, modules, primitives
- Run `pnpm test:cov` to verify coverage before commits

### Database Migrations (TypeORM)

```bash
cd apps/api

# Run migrations
pnpm typeorm migration:run

# Generate new migration
pnpm typeorm migration:generate -n MigrationName
```

## Architecture Overview

### Layered Architecture

The API follows a strict 4-layer architecture for each bounded context:

```
{context}/
├── domain/              # Core domain logic (aggregates, value objects, repositories, builders)
├── application/         # CQRS handlers (commands, queries, event handlers, services)
├── infrastructure/      # External concerns (database, repositories, mappers)
└── transport/          # External interfaces (GraphQL resolvers, DTOs, mappers)
```

### Data Flow

1. **GraphQL Resolver** (transport layer) receives request and converts to DTO
2. **Command/Query Handler** (application layer) processes the request
3. **Aggregate** (domain layer) executes business rules and generates events
4. **Repository** (infrastructure layer) persists changes to PostgreSQL
5. **Event Bus** publishes domain events
6. **Event Handlers** update read models in MongoDB

### Database Strategy (CQRS)

- **Write Model**: PostgreSQL with TypeORM for transactional data (aggregates)
- **Read Model**: MongoDB for optimized queries (view models)
- **Event Store**: Domain events trigger async updates from write to read models

## Domain Layer Patterns

### Aggregates

- Extend `BaseAggregate` (which extends NestJS `AggregateRoot`)
- Use private properties with `_` prefix (e.g., `_id`, `_name`)
- Expose properties via public getters (e.g., `get id()`)
- **All properties must be Value Objects** - never use primitives directly
- Include `createdAt` and `updatedAt` as `DateValueObject`
- Implement `toPrimitives()` for serialization
- Use `this.apply()` to generate domain events for state changes
- Methods should represent domain actions (e.g., `activate()`, `addPlant()`), not technical setters

### Aggregate Structure Order

Follow this strict order for readability:

1. **State** (private properties)
2. **Construction** (constructor, builder initialization)
3. **Domain Behavior** (public methods with domain verbs)
4. **Internal Rules** (private validation methods)
5. **Read Access** (getters)
6. **Serialization** (`toPrimitives()`)

### Value Objects

- Must be immutable (readonly properties)
- Validate in constructor, throw domain exceptions on failure
- Extend base value objects: `StringValueObject`, `EnumValueObject`, `NumberValueObject`, `DateValueObject`
- Implement `value` getter for primitive access
- Example: `ExampleNameValueObject extends StringValueObject`

### Repositories

- Separate **write** (aggregates, PostgreSQL) and **read** (view models, MongoDB) repositories
- Write repositories extend `IBaseWriteRepository<TAggregate>`
- Read repositories extend `IBaseReadRepository<TViewModel>`
- Use **type aliases** when no additional methods needed:
  ```typescript
  export type IExampleWriteRepository = IBaseWriteRepository<ExampleAggregate>;
  ```
- Use **interfaces** when additional methods required:
  ```typescript
  export interface ExampleWriteRepository extends IBaseWriteRepository<ExampleAggregate> {
    findBySlug(slug: string): Promise<ExampleAggregate | null>;
  }
  ```
- Always export a Symbol token for dependency injection: `export const EXAMPLE_WRITE_REPOSITORY_TOKEN = Symbol('ExampleWriteRepository');`

### Builders

- Implement `IWriteBuilder<TEntity, TPrimitives>` for aggregates
- Implement `IReadBuilder<TViewModel, TPrimitives>` for view models
- Use fluent API with `with{Property}()` methods for each property
- Implement `fromPrimitives()` for reconstruction from database
- Implement `fromAggregate()` for view model builders (convert aggregate to view model)
- Implement `build()` to construct the final entity/view model
- Implement `reset()` to reuse the builder instance
- Validate required fields in `build()` method before construction
- Be in folders: `builders/aggregates/{entity}-aggregate/` and `builders/view-models/{entity}-view-model/`

**Example usage:**
```typescript
// Creating a new aggregate
const location = new LocationAggregateBuilder()
  .withId(new LocationUuidValueObject())
  .withName(new LocationNameValueObject('Greenhouse 1'))
  .withType(new LocationTypeValueObject('GREENHOUSE'))
  .build();

// Reconstructing from primitives
const location = new LocationAggregateBuilder()
  .fromPrimitives(primitives)
  .build();

// Converting aggregate to view model
const viewModel = new LocationViewModelBuilder()
  .fromAggregate(locationAggregate)
  .build();
```

## Application Layer Patterns

### Commands (Write Operations)

- Command classes use Value Objects for all properties
- Command handlers implement `ICommandHandler<CommandType>`
- Inject repositories using Symbol tokens: `@Inject(REPOSITORY_TOKEN)`
- Use `EventBus.publishAll()` to publish events after saving
- **Return primitive values** (e.g., `string` for IDs), not Value Objects
- Structure: `{entity}-{action}/` folders

### Queries (Read Operations)

- Query handlers implement `IQueryHandler<QueryType>`
- **Use read repositories** for queries (MongoDB view models)
- **Return ViewModels or Aggregates**, not primitives
- Use assert services to validate existence
- For ViewModel queries, name them `{Entity}ViewModelFindByIdQuery`

### Event Handlers

- Implement `IEventHandler<EventType>` from `@nestjs/cqrs`
- Update **read models only** (ViewModels in MongoDB)
- Use view model builders to create instances
- Handle errors gracefully (do not throw)

### Integration Events

Integration events communicate entity lifecycle changes across bounded contexts. The application uses an abstraction layer that allows changing the transport mechanism without modifying business logic.

#### Publishing Integration Events

Use `PublishIntegrationEventsService` in command handlers:

```typescript
await this.publishIntegrationEventsService.execute(
  new EntityCreatedEvent(metadata, data)
);
```

#### Architecture

- **Domain Layer**: `IIntegrationEventPublisher` interface + `INTEGRATION_EVENT_PUBLISHER_TOKEN` for DI
- **Infrastructure Layer**: Concrete implementations (EventBus, Kafka, RabbitMQ, etc.)
- **Application Layer**: `PublishIntegrationEventsService` delegates to the abstraction

#### Available Implementations

- **EventBus** (default): In-process events using NestJS CQRS EventBus
  - Location: `shared/infrastructure/event-publishers/event-bus/`
  - Use case: Single-instance applications, development
- **Kafka** (future): Distributed events via Kafka topics
- **RabbitMQ** (future): Message queue events via AMQP

#### Adding New Transport

To add a new transport mechanism:

1. Create implementation in `shared/infrastructure/event-publishers/{transport}/`
2. Implement `IIntegrationEventPublisher` interface
3. Update `SharedModule` provider configuration:
   ```typescript
   const EVENT_PUBLISHERS = [
     {
       provide: INTEGRATION_EVENT_PUBLISHER_TOKEN,
       useClass: YourNewPublisher,
     },
   ];
   ```
4. Configure environment variables if needed

### Services

- Implement `IBaseService<TInput, TOutput>`
- Use for reusable business logic (e.g., assert existence, check uniqueness)
- Assert services use **write repository** for aggregates, **read repository** for view models

### DTOs (Application Layer)

- Must be **interfaces** (not classes)
- Use primitive types only
- Follow naming: `I{Entity}{Action}CommandDto` or `I{Entity}{Action}QueryDto`
- Document with TSDoc

## Infrastructure Layer Patterns

### TypeORM (Write Repositories)

- Extend `BaseTypeormMasterRepository<TEntity>`
- Implement domain write repository interface
- Use mappers for entity ↔ aggregate conversion
- Use **soft delete** (`softDelete()`) for delete operations
- Entities extend `BaseTypeormEntity` (provides `id`, `createdAt`, `updatedAt`, `deletedAt`)

### MongoDB (Read Repositories)

- Extend `BaseMongoMasterRepository`
- Implement domain read repository interface
- Use **upsert** (`replaceOne` with `upsert: true`) for save operations
- DTOs are **type aliases** (not interfaces or classes)
- Use mappers for DTO ↔ view model conversion

### Mappers

- TypeORM mappers: `toDomainEntity()` and `toTypeormEntity()`
- MongoDB mappers: `toViewModel()` and `toMongoData()`
- Always use builders to create aggregates/view models
- Handle null values with `?? null` for nullable fields

## Transport Layer Patterns

### GraphQL Resolvers

- Separate **queries** and **mutations** into different resolver files
- Query resolvers use `QueryBus`, mutation resolvers use `CommandBus`
- Use `@UseGuards(JwtAuthGuard, RolesGuard)` for authentication
- Use `@Roles(UserRoleEnum.ADMIN)` for role-based authorization
- Number steps with comments: `// 01:`, `// 02:`, etc.

### Request DTOs (GraphQL Input)

- Must be **classes** (not interfaces) for GraphQL decorators
- Use `@InputType()` decorator
- Use `@Field()` for each property with descriptions
- Use `class-validator` decorators (`@IsString`, `@IsUUID`, `@IsEnum`, etc.)
- Extend `BaseFindByCriteriaInput` for criteria queries

### Response DTOs (GraphQL Output)

- Must be **classes** (not interfaces)
- Use `@ObjectType()` decorator
- Use `@Field()` for each property with descriptions
- Extend `BasePaginatedResultDto` for paginated results

### Mappers (Transport)

- Convert ViewModels to response DTOs
- Implement `toResponseDto()` and `toPaginatedResponseDto()`
- Never convert from Aggregates directly - use ViewModels

## Documentation Standards

### TSDoc Requirements

- **Document**: classes, interfaces, types, functions/methods, enums
- **Do NOT document**: class properties/attributes, Symbol tokens
- Use `@param` for parameters, `@returns` for return values, `@throws` for exceptions
- Start with brief description

### Example

```typescript
/**
 * Represents a plant in the system.
 *
 * @example
 * const plant = new Plant({ name: 'Rose', species: 'Rosa' });
 */
export class Plant {
  private readonly _id: PlantUuidValueObject;  // No TSDoc here
  private _name: PlantNameValueObject;          // No TSDoc here

  /**
   * Updates the plant status.
   *
   * @param newStatus - The new status to set
   * @throws {InvalidStatusTransitionException} If the status transition is invalid
   */
  updateStatus(newStatus: PlantStatusValueObject): void {
    // implementation
  }
}
```

## Key Architectural Constraints

1. **Never use primitives in domain layer** - Always use Value Objects
2. **Never use domain types in infrastructure** - Use primitives in TypeORM entities and MongoDB DTOs
3. **Never mix write and read repositories** - Commands use write, queries use read
4. **Never skip mappers** - Always convert between layers using mappers
5. **Never create aggregates without builders** - Use builders for object creation
6. **Never forget to publish events** - Use `eventBus.publishAll()` after saving aggregates
7. **Always extend base classes/interfaces** - Follow the established patterns

## Bounded Contexts

The API is organized into bounded contexts (found in `apps/api/src/generic/`):

- **auth**: Authentication and authorization with JWT
- **users**: User management
- **saga-context**: Distributed transaction orchestration
- **overview**: (specific to this implementation)

Each context follows the same 4-layer architecture (domain, application, infrastructure, transport).

## Environment Setup

**API** requires:
- PostgreSQL (main database for write models)
- MongoDB (event store and read models)
- JWT secrets for authentication

See `apps/api/.env.example` or README.md for required environment variables.

## GraphQL Development

- **GraphQL Playground**: http://localhost:4100/graphql (development mode)
- **Schema**: Auto-generated at `apps/api/src/schema.gql`
- Use Playground to test queries and mutations
- Authentication required for most operations (pass JWT in headers)
