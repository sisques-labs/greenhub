# Overview Module

A comprehensive read-only module that provides aggregated system metrics and statistics from the plant context (core). This module calculates and maintains a single overview entity containing all key metrics about plants, growing units, capacity, dimensions, and aggregated statistics. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Domain Model](#domain-model)
- [Metrics](#metrics)
- [Event-Driven Updates](#event-driven-updates)
- [Queries](#queries)
- [GraphQL API](#graphql-api)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Overview Module provides a centralized, read-only view of all system metrics aggregated from the plant context. It maintains a single overview entity that is continuously updated based on events from the plant context, ensuring that the metrics are always current and accurate.

### What This Module Does

- **Aggregates System Metrics**: Calculates comprehensive statistics from plants and growing units
- **Real-Time Updates**: Automatically recalculates and updates metrics when plant context events occur
- **Single Source of Truth**: Maintains one overview entity with constant ID (`'overview'`)
- **Read-Only Access**: Provides optimized read operations through GraphQL API
- **Batch Processing**: Efficiently processes large datasets in batches to avoid memory issues
- **Mathematical Operations**: Uses math commands for accurate percentage, average, and median calculations

### Key Characteristics

- **Read-Only**: This module does not accept write operations (commands/mutations)
- **Event-Driven**: Automatically updates when plant context events are published
- **Single Entity**: Only one overview entity exists in the database (ID: `'overview'`)
- **Optimized for Queries**: Uses MongoDB for fast read operations
- **Comprehensive Metrics**: Tracks 30+ different metrics across multiple categories

## Architecture

The module is organized following Clean Architecture principles:

```
overview/
├── application/              # Application layer (CQRS)
│   ├── queries/             # Query handlers
│   │   └── overview-find-view-model/
│   ├── event-handlers/      # Event handlers
│   │   └── overview-updated/
│   └── services/           # Application services
│       ├── overview-calculate/
│       ├── overview-calculate-plant-metrics/
│       ├── overview-calculate-growing-unit-metrics/
│       ├── overview-calculate-capacity-metrics/
│       ├── overview-calculate-dimensions-metrics/
│       └── overview-calculate-aggregated-metrics/
├── domain/                  # Domain layer
│   ├── view-models/        # Read models
│   │   └── plant/
│   │       └── overview.view-model.ts
│   ├── repositories/       # Repository interfaces
│   │   └── overview-read/
│   ├── factories/          # Domain factories
│   │   └── view-models/
│   │       └── plant-view-model/
│   └── dtos/              # Domain DTOs
│       └── view-models/
│           └── overview/
├── infrastructure/         # Infrastructure layer
│   └── database/          # Database repositories
│       └── mongodb/       # Read repository (MongoDB)
│           ├── dtos/
│           ├── mappers/
│           └── repositories/
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Queries Only**: This module only implements query operations (no commands)
- **Read Repository**: MongoDB-based repository optimized for read operations
- **View Model**: Single `OverviewViewModel` stored in MongoDB for fast access

#### Event-Driven Architecture

The module subscribes to plant context events and automatically recalculates metrics:

- `GrowingUnitCreatedEvent` - Recalculates when a growing unit is created
- `GrowingUnitDeletedEvent` - Recalculates when a growing unit is deleted
- `GrowingUnitTypeChangedEvent` - Recalculates when growing unit type changes
- `GrowingUnitCapacityChangedEvent` - Recalculates when capacity changes
- `GrowingUnitDimensionsChangedEvent` - Recalculates when dimensions change
- `GrowingUnitPlantAddedEvent` - Recalculates when a plant is added
- `GrowingUnitPlantRemovedEvent` - Recalculates when a plant is removed
- `GrowingUnitPlantStatusChangedEvent` - Recalculates when plant status changes
- `GrowingUnitPlantPlantedDateChangedEvent` - Recalculates when planted date changes
- `GrowingUnitPlantNotesChangedEvent` - Recalculates when plant notes change
- `GrowingUnitPlantGrowingUnitChangedEvent` - Recalculates when plant is moved

#### Single Entity Pattern

- **Constant ID**: The overview always uses the ID `'overview'`
- **Upsert Operations**: Updates replace the existing entity or create it if it doesn't exist
- **No Multiple Instances**: Only one overview entity exists at any time

#### Batch Processing

- **Memory Efficient**: Fetches data in batches of 500 items to avoid memory issues
- **Parallel Processing**: Processes multiple batches in parallel when possible
- **Pagination Aware**: Uses `totalPages` from paginated results to fetch all data

## Features

- ✅ Comprehensive system metrics aggregation
- ✅ Real-time automatic updates via event handlers
- ✅ Single overview entity with constant ID
- ✅ Read-only GraphQL API
- ✅ Batch processing for large datasets
- ✅ Mathematical operations via math commands
- ✅ Event-driven architecture
- ✅ CQRS pattern with read-only repository
- ✅ Domain-driven design with view models
- ✅ Authentication and authorization guards
- ✅ Comprehensive test coverage

## Domain Model

### OverviewViewModel

The `OverviewViewModel` is the main domain entity that encapsulates all system metrics:

```typescript
class OverviewViewModel {
  id: string; // Always 'overview'

  // Plants metrics
  totalPlants: number;
  totalActivePlants: number;
  averagePlantsPerGrowingUnit: number;

  // Plants by status
  plantsPlanted: number;
  plantsGrowing: number;
  plantsHarvested: number;
  plantsDead: number;
  plantsArchived: number;

  // Additional plant metrics
  plantsWithoutPlantedDate: number;
  plantsWithNotes: number;
  recentPlants: number; // Last 7 days

  // Growing units metrics
  totalGrowingUnits: number;
  activeGrowingUnits: number;
  emptyGrowingUnits: number;

  // Growing units by type
  growingUnitsPot: number;
  growingUnitsGardenBed: number;
  growingUnitsHangingBasket: number;
  growingUnitsWindowBox: number;

  // Capacity metrics
  totalCapacity: number;
  totalCapacityUsed: number;
  averageOccupancy: number; // Percentage
  growingUnitsAtLimit: number; // >= 80% occupancy
  growingUnitsFull: number; // 100% occupancy
  totalRemainingCapacity: number;

  // Dimensions metrics
  growingUnitsWithDimensions: number;
  totalVolume: number;
  averageVolume: number;

  // Aggregated metrics
  minPlantsPerGrowingUnit: number;
  maxPlantsPerGrowingUnit: number;
  medianPlantsPerGrowingUnit: number;

  createdAt: Date;
  updatedAt: Date;
}
```

**Methods:**

- `update(updateData)`: Updates the view model with new calculated data
- Getters for all metrics (read-only access)

## Metrics

The overview module calculates and maintains the following categories of metrics:

### Plants Metrics

- **totalPlants**: Total number of plants in the system
- **totalActivePlants**: Plants that are not dead or archived
- **averagePlantsPerGrowingUnit**: Average number of plants per growing unit

### Plants by Status

- **plantsPlanted**: Plants with `PLANTED` status
- **plantsGrowing**: Plants with `GROWING` status
- **plantsHarvested**: Plants with `HARVESTED` status
- **plantsDead**: Plants with `DEAD` status
- **plantsArchived**: Plants with `ARCHIVED` status

### Additional Plant Metrics

- **plantsWithoutPlantedDate**: Plants missing a planted date
- **plantsWithNotes**: Plants that have notes
- **recentPlants**: Plants created in the last 7 days

### Growing Units Metrics

- **totalGrowingUnits**: Total number of growing units
- **activeGrowingUnits**: Growing units with at least 1 plant
- **emptyGrowingUnits**: Growing units without any plants

### Growing Units by Type

- **growingUnitsPot**: Number of `POT` type growing units
- **growingUnitsGardenBed**: Number of `GARDEN_BED` type growing units
- **growingUnitsHangingBasket**: Number of `HANGING_BASKET` type growing units
- **growingUnitsWindowBox**: Number of `WINDOW_BOX` type growing units

### Capacity Metrics

- **totalCapacity**: Sum of all growing unit capacities
- **totalCapacityUsed**: Sum of all plants across growing units
- **averageOccupancy**: Average occupancy percentage (calculated via math command)
- **growingUnitsAtLimit**: Growing units at >= 80% occupancy
- **growingUnitsFull**: Growing units at 100% occupancy
- **totalRemainingCapacity**: Total remaining capacity across all units

### Dimensions Metrics

- **growingUnitsWithDimensions**: Number of growing units with dimension data
- **totalVolume**: Sum of volumes for units with dimensions
- **averageVolume**: Average volume for units with dimensions (calculated via math command)

### Aggregated Metrics

- **minPlantsPerGrowingUnit**: Minimum number of plants in any growing unit
- **maxPlantsPerGrowingUnit**: Maximum number of plants in any growing unit
- **medianPlantsPerGrowingUnit**: Median number of plants per growing unit (calculated via math command)

## Event-Driven Updates

The overview is automatically updated whenever relevant events occur in the plant context. The `OverviewUpdatedEventHandler` listens to the following events:

### Events That Trigger Recalculation

1. **GrowingUnitCreatedEvent** - New growing unit created
2. **GrowingUnitDeletedEvent** - Growing unit deleted
3. **GrowingUnitTypeChangedEvent** - Growing unit type changed
4. **GrowingUnitCapacityChangedEvent** - Growing unit capacity changed
5. **GrowingUnitDimensionsChangedEvent** - Growing unit dimensions changed
6. **GrowingUnitPlantAddedEvent** - Plant added to growing unit
7. **GrowingUnitPlantRemovedEvent** - Plant removed from growing unit
8. **GrowingUnitPlantStatusChangedEvent** - Plant status changed
9. **GrowingUnitPlantPlantedDateChangedEvent** - Plant planted date changed
10. **GrowingUnitPlantNotesChangedEvent** - Plant notes changed
11. **GrowingUnitPlantGrowingUnitChangedEvent** - Plant moved to different growing unit

### Update Process

When an event is received:

1. **Event Handler Triggered**: `OverviewUpdatedEventHandler` receives the event
2. **Full Recalculation**: `OverviewCalculateService` recalculates all metrics
3. **Batch Data Fetching**: Fetches all growing units in batches of 500
4. **Metric Calculation**: Uses specialized services to calculate each metric category
5. **View Model Creation**: Creates or updates the `OverviewViewModel` with ID `'overview'`
6. **Database Update**: Saves the updated view model to MongoDB (upsert operation)

### Performance Considerations

- **Batch Processing**: Data is fetched in batches to avoid memory issues
- **Parallel Processing**: Multiple batches are processed in parallel when possible
- **Efficient Calculations**: Uses specialized services for each metric category
- **Math Commands**: Leverages math module commands for accurate calculations

## Queries

Queries represent read operations that don't modify state:

### OverviewFindViewModelQuery

Finds the single overview view model. Since there is only one overview entity, this query requires no parameters.

**Handler:** `OverviewFindViewModelQueryHandler`

**Input:** None (no parameters required)

**Output:** `OverviewViewModel | null`

**Process:**

1. Retrieves the overview view model with ID `'overview'` from the read repository
2. Returns the view model if found, `null` otherwise

## GraphQL API

The module exposes a GraphQL API through a single query resolver:

### Authentication & Authorization

All overview operations require authentication. The module uses guards to ensure security.

### Required Headers

Every request to the overview API must include:

1. **Authorization Header** - JWT token for authentication
   ```http
   Authorization: Bearer <jwt-token>
   ```

### Guards

The module applies the following guards to all endpoints:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **RolesGuard** - Validates user has appropriate role

### Authorization Rules

- **ADMIN Role**: Can query the overview
- **USER Role**: Can query the overview

### OverviewQueriesResolver

Handles read operations (queries).

**Queries:**

#### findOverview

Finds the overview with all system metrics. **Requires authentication (ADMIN or USER role).**

```graphql
query FindOverview {
  findOverview {
    id
    totalPlants
    totalActivePlants
    averagePlantsPerGrowingUnit
    plantsPlanted
    plantsGrowing
    plantsHarvested
    plantsDead
    plantsArchived
    plantsWithoutPlantedDate
    plantsWithNotes
    recentPlants
    totalGrowingUnits
    activeGrowingUnits
    emptyGrowingUnits
    growingUnitsPot
    growingUnitsGardenBed
    growingUnitsHangingBasket
    growingUnitsWindowBox
    totalCapacity
    totalCapacityUsed
    averageOccupancy
    growingUnitsAtLimit
    growingUnitsFull
    totalRemainingCapacity
    growingUnitsWithDimensions
    totalVolume
    averageVolume
    minPlantsPerGrowingUnit
    maxPlantsPerGrowingUnit
    medianPlantsPerGrowingUnit
    createdAt
    updatedAt
  }
}
```

**Response:**

```json
{
  "data": {
    "findOverview": {
      "id": "overview",
      "totalPlants": 150,
      "totalActivePlants": 140,
      "averagePlantsPerGrowingUnit": 6.0,
      "plantsPlanted": 50,
      "plantsGrowing": 60,
      "plantsHarvested": 20,
      "plantsDead": 5,
      "plantsArchived": 15,
      "plantsWithoutPlantedDate": 10,
      "plantsWithNotes": 30,
      "recentPlants": 25,
      "totalGrowingUnits": 25,
      "activeGrowingUnits": 20,
      "emptyGrowingUnits": 5,
      "growingUnitsPot": 10,
      "growingUnitsGardenBed": 8,
      "growingUnitsHangingBasket": 5,
      "growingUnitsWindowBox": 2,
      "totalCapacity": 250,
      "totalCapacityUsed": 150,
      "averageOccupancy": 60.0,
      "growingUnitsAtLimit": 5,
      "growingUnitsFull": 2,
      "totalRemainingCapacity": 100,
      "growingUnitsWithDimensions": 20,
      "totalVolume": 50.5,
      "averageVolume": 2.525,
      "minPlantsPerGrowingUnit": 0,
      "maxPlantsPerGrowingUnit": 10,
      "medianPlantsPerGrowingUnit": 6.0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

**Note:** The query returns `null` if the overview has not been initialized yet (e.g., on first system startup before any events have been processed).

## Usage Examples

### Query Overview via GraphQL

```graphql
query {
  findOverview {
    id
    totalPlants
    totalActivePlants
    totalGrowingUnits
    averageOccupancy
    createdAt
    updatedAt
  }
}
```

### Query Specific Metrics

```graphql
query {
  findOverview {
    # Plant metrics
    totalPlants
    totalActivePlants
    plantsPlanted
    plantsGrowing

    # Growing unit metrics
    totalGrowingUnits
    activeGrowingUnits
    emptyGrowingUnits

    # Capacity metrics
    totalCapacity
    totalCapacityUsed
    averageOccupancy
    growingUnitsAtLimit
    growingUnitsFull
  }
}
```

### Using in Application Code

```typescript
import { QueryBus } from '@nestjs/cqrs';
import { OverviewFindViewModelQuery } from '@/generic/overview/application/queries/overview-find-view-model/overview-find-view-model.query';

@Injectable()
export class MyService {
  constructor(private readonly queryBus: QueryBus) {}

  async getSystemOverview() {
    const overview = await this.queryBus.execute(
      new OverviewFindViewModelQuery(),
    );

    if (!overview) {
      // Overview not initialized yet
      return null;
    }

    return {
      totalPlants: overview.totalPlants,
      totalGrowingUnits: overview.totalGrowingUnits,
      averageOccupancy: overview.averageOccupancy,
    };
  }
}
```

## Repositories

The module uses a read-only repository following CQRS pattern:

### Read Repository (MongoDB)

**Interface:** `IOverviewReadRepository`

**Implementation:** `OverviewMongoRepository`

**Database:** MongoDB

**Operations:**

- `findById(id: string): Promise<OverviewViewModel | null>` - Finds overview by ID (always `'overview'`)
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<OverviewViewModel>>` - Finds by criteria (rarely used)
- `save(viewModel: OverviewViewModel): Promise<void>` - Saves/updates overview (used by event handler)
- `delete(id: string): Promise<void>` - Deletes overview (rarely used)

**Features:**

- Optimized for read operations
- Single entity with constant ID (`'overview'`)
- Upsert operations for automatic updates
- Supports complex queries with filters, sorts, and pagination (if needed)

## Services

The module provides several specialized services for calculating metrics:

### OverviewCalculateService

Orchestrates the calculation of all overview metrics.

**Methods:**

- `execute(overviewId?: string): Promise<OverviewViewModel>` - Calculates all metrics and returns view model

**Process:**

1. Fetches all growing units in batches of 500
2. Extracts all plants from growing units
3. Calculates plant metrics
4. Calculates growing unit metrics
5. Calculates capacity metrics
6. Calculates dimensions metrics
7. Calculates aggregated metrics
8. Creates and returns the overview view model

### OverviewCalculatePlantMetricsService

Calculates metrics related to plants.

**Metrics Calculated:**

- Total plants, active plants
- Plants by status (planted, growing, harvested, dead, archived)
- Additional metrics (without planted date, with notes, recent plants)

### OverviewCalculateGrowingUnitMetricsService

Calculates metrics related to growing units.

**Metrics Calculated:**

- Total, active, and empty growing units
- Growing units by type (pot, garden bed, hanging basket, window box)

### OverviewCalculateCapacityMetricsService

Calculates capacity-related metrics using math commands.

**Metrics Calculated:**

- Total capacity, used capacity, remaining capacity
- Average occupancy (via `CalculatePercentageCommand`)
- Growing units at limit (>= 80%) and full (100%)

### OverviewCalculateDimensionsMetricsService

Calculates dimensions-related metrics using math commands.

**Metrics Calculated:**

- Growing units with dimensions
- Total volume, average volume (via `CalculateAverageCommand`)

### OverviewCalculateAggregatedMetricsService

Calculates aggregated statistics using math commands.

**Metrics Calculated:**

- Average, min, max, and median plants per growing unit
- Uses `CalculateAverageCommand` and `CalculateMedianCommand`

## Troubleshooting

### Common Issues

1. **Overview Not Found:**
   - **Cause**: Overview has not been initialized yet
   - **Solution**: The overview is created automatically when the first plant context event is processed
   - **Workaround**: Trigger any plant context operation (create growing unit, add plant, etc.)

2. **Stale Metrics:**
   - **Cause**: Event handler may have failed or events not being processed
   - **Solution**: Check event handler logs for errors
   - **Verification**: Check `updatedAt` timestamp in the overview

3. **Memory Issues During Calculation:**
   - **Cause**: Too many growing units loaded at once
   - **Solution**: The service uses batch processing (500 items per batch) to prevent this
   - **Note**: Batch size can be adjusted in `OverviewCalculateService.BATCH_SIZE`

4. **Incorrect Metrics:**
   - **Cause**: Calculation logic error or data inconsistency
   - **Solution**: Review calculation service logs
   - **Verification**: Compare calculated metrics with actual data

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Overview calculation process
- Batch fetching operations
- Metric calculations
- Event handling
- Repository operations

### Manual Recalculation

If needed, you can manually trigger a recalculation by publishing any plant context event or by directly calling the calculation service:

```typescript
import { OverviewCalculateService } from '@/generic/overview/application/services/overview-calculate/overview-calculate.service';

// In your service
await this.overviewCalculateService.execute('overview');
```

## Database Schema

### MongoDB Schema (Read Database)

The MongoDB collection stores a single overview document:

```typescript
{
  id: 'overview', // Constant ID
  totalPlants: number,
  totalActivePlants: number,
  averagePlantsPerGrowingUnit: number,
  // ... all other metrics
  createdAt: Date,
  updatedAt: Date
}
```

**Collection Name:** `overviews`

**Indexes:** The `id` field is used as the primary identifier (always `'overview'`)

## Best Practices

1. **Read-Only Access**: This module is read-only - do not attempt to create commands or mutations
2. **Event-Driven Updates**: Rely on event handlers for automatic updates - don't manually trigger calculations unless necessary
3. **Batch Processing**: The service handles large datasets efficiently - trust the batch processing mechanism
4. **Math Commands**: All mathematical operations use math module commands for consistency and accuracy
5. **Single Entity**: Always use the constant ID `'overview'` when querying
6. **Error Handling**: Handle `null` responses when the overview hasn't been initialized yet
7. **Performance**: The overview is optimized for fast reads - use it for dashboard and reporting features

## Integration with Other Modules

### Plant Context

- **Data Source**: Overview metrics are calculated from plant context data
- **Event Subscription**: Listens to all relevant plant context events
- **Read-Only**: Only reads data, never modifies plant context

### Math Module

- **Dependencies**: Uses math commands for percentage, average, and median calculations
- **Commands Used**:
  - `CalculatePercentageCommand` - For occupancy calculations
  - `CalculateAverageCommand` - For average calculations
  - `CalculateMedianCommand` - For median calculations

### Auth Module

- **Authentication**: Uses JWT authentication guards
- **Authorization**: Requires ADMIN or USER role for access

## Testing

The module includes comprehensive test coverage:

- **Domain Tests**: View model and factory tests
- **Application Tests**: Service and query handler tests
- **Infrastructure Tests**: Repository and mapper tests
- **Transport Tests**: Resolver and mapper tests

Run tests with:

```bash
# Run all overview module tests
pnpm test overview

# Run with coverage
pnpm test:cov overview
```

## License

This module is part of the GreenHub project.
