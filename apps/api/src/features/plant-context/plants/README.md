# Plants Module

## Overview

The Plants module is responsible for managing plant entities within the application. It provides a complete CQRS-based implementation for creating, updating, deleting, and querying plants, supporting both indoor and outdoor plants.

## Architecture

This module follows Clean Architecture principles with clear separation of concerns:

- **Domain Layer**: Contains aggregates, value objects, repositories, factories, and primitives
- **Application Layer**: Contains commands, queries, event handlers, services, and DTOs
- **Infrastructure Layer**: Contains database implementations (TypeORM for writes, MongoDB for reads)
- **Transport Layer**: Contains GraphQL resolvers, DTOs, and mappers

## Features

### Commands (Write Operations)

- **Create Plant**: Create a new plant with name, species, container, status, and optional notes
- **Update Plant**: Update plant properties (name, species, planted date, notes, status)
- **Delete Plant**: Soft delete a plant (archives it)
- **Change Plant Status**: Change the status of a plant (PLANTED, GROWING, HARVESTED, DEAD)

### Queries (Read Operations)

- **Find Plant by ID**: Retrieve a single plant aggregate by its ID
- **Find Plant View Model by ID**: Retrieve a single plant view model by its ID
- **Find Plants by Container ID**: Retrieve all plants belonging to a specific container
- **Find Plants by Criteria**: Search plants with filtering, sorting, and pagination

### Domain Events

- **PlantCreatedEvent**: Published when a plant is created
- **PlantUpdatedEvent**: Published when a plant is updated
- **PlantDeletedEvent**: Published when a plant is deleted
- **PlantStatusChangedEvent**: Published when a plant's status changes
- **PlantContainerChangedEvent**: Published when a plant's container is changed

### Plant Statuses

The module supports the following plant statuses:

- `PLANTED`: The plant has been planted (initial state)
- `GROWING`: The plant is actively growing (normal/active state)
- `HARVESTED`: The plant has been harvested (for harvestable plants)
- `DEAD`: The plant has died
- `ARCHIVED`: The plant has been archived (soft delete, not exposed in API)

## Domain Model

### Plant Aggregate

The `PlantAggregate` represents the core domain entity with the following properties:

- **id**: Unique identifier (UUID)
- **tenantId**: Tenant identifier for multi-tenancy support
- **containerId**: Reference to the container where the plant is located
- **name**: Plant name
- **species**: Plant species
- **plantedDate**: Date when the plant was planted (optional)
- **notes**: Additional notes about the plant (optional)
- **status**: Current status of the plant
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

### Value Objects

- `PlantNameValueObject`: Validates and encapsulates plant names
- `PlantSpeciesValueObject`: Validates and encapsulates plant species
- `PlantPlantedDateValueObject`: Validates and encapsulates planted dates
- `PlantNotesValueObject`: Validates and encapsulates plant notes
- `PlantStatusValueObject`: Validates and encapsulates plant status

## Database Schema

### Write Database (PostgreSQL via TypeORM)

The `PlantTypeormEntity` table structure:

- `id`: UUID (primary key)
- `tenantId`: UUID (indexed, for multi-tenancy)
- `containerId`: UUID (foreign key to containers)
- `name`: VARCHAR
- `species`: VARCHAR
- `plantedDate`: DATE (nullable)
- `notes`: TEXT (nullable)
- `status`: ENUM (PLANTED, GROWING, HARVESTED, DEAD, ARCHIVED)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP
- `deletedAt`: TIMESTAMP (nullable, for soft deletes)

### Read Database (MongoDB)

The `PlantViewModel` is stored in MongoDB for optimized read operations with the same structure as the aggregate.

## GraphQL API

### Queries

```graphql
# Find plants by criteria
query {
  plantsFindByCriteria(input: {
    filters: [...]
    sorts: [...]
    pagination: { page: 1, perPage: 10 }
  }) {
    items {
      id
      name
      species
      status
      containerId
      plantedDate
      notes
      createdAt
      updatedAt
    }
    total
    page
    perPage
    totalPages
  }
}

# Find plant by ID
query {
  plantFindById(input: { id: "..." }) {
    id
    name
    species
    status
    containerId
    plantedDate
    notes
    createdAt
    updatedAt
  }
}
```

### Mutations

```graphql
# Create plant
mutation {
  createPlant(
    input: {
      containerId: "..."
      name: "Aloe Vera"
      species: "Aloe barbadensis"
      status: PLANTED
      plantedDate: "2024-01-15"
      notes: "Keep in indirect sunlight"
    }
  ) {
    success
    message
    id
  }
}

# Update plant
mutation {
  updatePlant(
    input: {
      id: "..."
      name: "Updated Name"
      species: "Updated Species"
      status: GROWING
    }
  ) {
    success
    message
    id
  }
}

# Delete plant
mutation {
  deletePlant(input: { id: "..." }) {
    success
    message
    id
  }
}

# Change plant status
mutation {
  changePlantStatus(input: { id: "...", status: HARVESTED }) {
    success
    message
    id
  }
}
```

## Services

### AssertPlantExistsService

Validates that a plant aggregate exists by ID. Throws `PlantNotFoundException` if not found.

### AssertPlantViewModelExistsService

Validates that a plant view model exists by ID. Throws `PlantNotFoundException` if not found.

## Event Handlers

### PlantCreatedEventHandler

Handles `PlantCreatedEvent` by creating a corresponding view model in MongoDB.

### PlantUpdatedEventHandler

Handles `PlantUpdatedEvent` by updating the corresponding view model in MongoDB.

### PlantDeletedEventHandler

Handles `PlantDeletedEvent` by deleting the corresponding view model from MongoDB.

### PlantStatusChangedEventHandler

Handles `PlantStatusChangedEvent` by updating the plant view model status in MongoDB.

## Multi-Tenancy

All operations are tenant-aware. The `tenantId` is automatically extracted from the request context and used to filter data. Users can only access plants belonging to their tenant.

## Authorization

All GraphQL operations require:

- **Authentication**: JWT token via `JwtAuthGuard`
- **Tenant Context**: Tenant ID via `TenantGuard`
- **Roles**: `ADMIN` or `USER` role via `RolesGuard` and `TenantRolesGuard`

## Testing

The module includes comprehensive unit tests for:

- Command handlers
- Query handlers
- Event handlers
- Services
- Domain aggregates
- Factories
- Mappers
- Repositories
- GraphQL resolvers

Run tests with:

```bash
npm test -- plants
```

## Dependencies

- `@nestjs/common`: NestJS core
- `@nestjs/cqrs`: CQRS implementation
- `@nestjs/typeorm`: TypeORM integration
- `typeorm`: ORM for PostgreSQL
- `mongodb`: MongoDB driver
- `@nestjs/graphql`: GraphQL integration
- `class-validator`: Validation decorators

## Related Modules

- **Containers Module**: Plants are associated with containers. The containers module listens to plant events to maintain consistency.
