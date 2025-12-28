# Containers Module

## Overview

The Containers module is responsible for managing container entities within the application. Containers represent physical spaces where plants are located (pots, garden beds, hanging baskets, window boxes, etc.). The module provides a complete CQRS-based implementation for creating, updating, deleting, and querying containers.

## Architecture

This module follows Clean Architecture principles with clear separation of concerns:

- **Domain Layer**: Contains aggregates, value objects, repositories, factories, and primitives
- **Application Layer**: Contains commands, queries, event handlers, services, and DTOs
- **Infrastructure Layer**: Contains database implementations (TypeORM for writes, MongoDB for reads)
- **Transport Layer**: Contains GraphQL resolvers, DTOs, and mappers

## Features

### Commands (Write Operations)

- **Create Container**: Create a new container with name and type
- **Update Container**: Update container properties (name, type)
- **Delete Container**: Soft delete a container (archives it)

### Queries (Read Operations)

- **Find Container by ID**: Retrieve a single container aggregate by its ID
- **Find Container View Model by ID**: Retrieve a single container view model by its ID (includes plants list and count)
- **Find Containers by Criteria**: Search containers with filtering, sorting, and pagination

### Domain Events

- **ContainerCreatedEvent**: Published when a container is created
- **ContainerUpdatedEvent**: Published when a container is updated
- **ContainerDeletedEvent**: Published when a container is deleted

### Cross-Module Event Handlers

The containers module listens to plant events to maintain consistency in the read model:

- **PlantCreatedContainerEventHandler**: Updates container view model when a plant is created
- **PlantDeletedContainerEventHandler**: Updates container view model when a plant is deleted
- **PlantContainerChangedContainerEventHandler**: Updates both old and new container view models when a plant's container is changed
- **PlantUpdatedContainerEventHandler**: Handles plant update events (currently no-op as container changes are handled by `PlantContainerChangedContainerEventHandler`)

### Container Types

The module supports the following container types:

- `POT`: A pot container for individual plants
- `GARDEN_BED`: A garden bed for multiple plants
- `HANGING_BASKET`: A hanging basket container
- `WINDOW_BOX`: A window box container

## Domain Model

### Container Aggregate

The `ContainerAggregate` represents the core domain entity with the following properties:

- **id**: Unique identifier (UUID)
- **name**: Container name
- **type**: Container type (POT, GARDEN_BED, HANGING_BASKET, WINDOW_BOX)
- **location**: Optional location information
- **metadata**: Optional metadata (JSON)
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

### Container View Model

The `ContainerViewModel` extends the aggregate with read-optimized properties:

- **plants**: Array of `ContainerPlantViewModel` objects representing plants in the container
- **numberOfPlants**: Count of plants in the container

These properties are automatically maintained through event-driven projections when plants are created, deleted, or moved between containers.

### Value Objects

- `ContainerNameValueObject`: Validates and encapsulates container names
- `ContainerTypeValueObject`: Validates and encapsulates container types
- `ContainerLocationValueObject`: Validates and encapsulates container locations
- `ContainerMetadataValueObject`: Validates and encapsulates container metadata

## Database Schema

### Write Database (PostgreSQL via TypeORM)

The `ContainerTypeormEntity` table structure:

- `id`: UUID (primary key)
- `name`: VARCHAR
- `type`: ENUM (POT, GARDEN_BED, HANGING_BASKET, WINDOW_BOX)
- `location`: VARCHAR (nullable)
- `metadata`: JSONB (nullable)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP
- `deletedAt`: TIMESTAMP (nullable, for soft deletes)

### Read Database (MongoDB)

The `ContainerViewModel` is stored in MongoDB for optimized read operations with the following structure:

- All aggregate properties
- `plants`: Array of plant view models
- `numberOfPlants`: Number of plants in the container

## Event-Driven Projections

The containers module uses event-driven architecture to maintain consistency between the write model (PostgreSQL) and read model (MongoDB). When plants are created, deleted, or moved between containers, the corresponding container view models are automatically updated:

1. **Plant Created**: The container's `plants` array and `numberOfPlants` are updated
2. **Plant Deleted**: The container's `plants` array and `numberOfPlants` are updated
3. **Plant Container Changed**: Both the old and new containers' `plants` arrays and `numberOfPlants` are updated

This ensures that the read model always reflects the current state of plants within containers without requiring expensive joins or aggregations.

## GraphQL API

### Queries

```graphql
# Find containers by criteria
query {
  containersFindByCriteria(input: {
    filters: [...]
    sorts: [...]
    pagination: { page: 1, perPage: 10 }
  }) {
    items {
      id
      name
      type
      plants {
        id
        name
        species
        status
        plantedDate
        notes
      }
      numberOfPlants
      createdAt
      updatedAt
    }
    total
    page
    perPage
    totalPages
  }
}

# Find container by ID
query {
  containerFindById(input: { id: "..." }) {
    id
    name
    type
    plants {
      id
      name
      species
      status
      plantedDate
      notes
    }
    numberOfPlants
    createdAt
    updatedAt
  }
}
```

### Mutations

```graphql
# Create container
mutation {
  createContainer(input: { name: "Garden Bed 1", type: GARDEN_BED }) {
    success
    message
    id
  }
}

# Update container
mutation {
  updateContainer(
    input: { id: "...", name: "Updated Garden Bed 1", type: POT }
  ) {
    success
    message
    id
  }
}

# Delete container
mutation {
  deleteContainer(input: { id: "..." }) {
    success
    message
    id
  }
}
```

## Services

### AssertContainerExistsService

Validates that a container aggregate exists by ID. Throws `ContainerNotFoundException` if not found.

### AssertContainerViewModelExistsService

Validates that a container view model exists by ID. Throws `ContainerNotFoundException` if not found.

### ContainerObtainPlantsService

Retrieves all plants belonging to a specific container. Used by event handlers to update container view models when plants are created, deleted, or moved.

## Event Handlers

### ContainerCreatedEventHandler

Handles `ContainerCreatedEvent` by creating a corresponding view model in MongoDB with empty `plants` array and `numberOfPlants` set to 0.

### ContainerUpdatedEventHandler

Handles `ContainerUpdatedEvent` by updating the corresponding view model in MongoDB.

### ContainerDeletedEventHandler

Handles `ContainerDeletedEvent` by deleting the corresponding view model from MongoDB.

### Plant Event Handlers

- **PlantCreatedContainerEventHandler**: Updates container view model when a plant is created
- **PlantDeletedContainerEventHandler**: Updates container view model when a plant is deleted
- **PlantContainerChangedContainerEventHandler**: Updates both old and new container view models when a plant's container is changed
- **PlantUpdatedContainerEventHandler**: Handles plant update events (no-op, as container changes are handled separately)

## Authorization

All GraphQL operations require:

- **Authentication**: JWT token via `JwtAuthGuard`
- **Roles**: `ADMIN` or `USER` role via `RolesGuard`

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
npm test -- containers
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

- **Plants Module**: Containers are associated with plants. The containers module listens to plant events to maintain consistency in the read model.
