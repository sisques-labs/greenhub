# Health Module

A comprehensive health check module that monitors the application's database connections and overall system status. This module provides both REST and GraphQL endpoints for health monitoring, making it ideal for load balancers, monitoring systems, and deployment pipelines.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Domain Model](#domain-model)
- [Health Status](#health-status)
- [Queries](#queries)
- [GraphQL API](#graphql-api)
- [REST API](#rest-api)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

The Health Module provides a simple yet powerful way to monitor the health of your application. It checks the connectivity and status of both write (PostgreSQL) and read (MongoDB) databases, providing an overall health status that can be used by monitoring tools, load balancers, and deployment systems.

### Features

- ✅ Database connection health checks (PostgreSQL and MongoDB)
- ✅ Overall system health status
- ✅ REST API endpoint (`GET /health`)
- ✅ GraphQL query endpoint
- ✅ Real-time health status
- ✅ Clean Architecture with CQRS pattern
- ✅ Domain-driven design

## Architecture

The module is organized following Clean Architecture principles:

```
health/
├── application/              # Application layer (CQRS)
│   ├── queries/            # Query handlers
│   │   └── health-check/
│   └── services/          # Application services
│       ├── health-check/
│       ├── health-write-database-check/
│       └── health-read-database-check/
├── domain/                 # Domain layer
│   ├── aggregates/        # Domain aggregates
│   │   └── health.aggregate.ts
│   ├── view-models/       # Read models
│   │   └── health.view-model.ts
│   ├── value-objects/     # Value objects
│   │   └── health-status/
│   ├── factories/         # Domain factories
│   │   └── health-view-model.factory.ts
│   ├── enums/            # Domain enums
│   │   └── health-status.enum.ts
│   └── primitives/       # Primitive types
│       └── health.primitives.ts
└── transport/             # Transport layer
    ├── graphql/          # GraphQL resolvers and DTOs
    │   ├── resolvers/
    │   ├── dtos/
    │   └── mappers/
    └── rest/             # REST controllers and DTOs
        ├── controllers/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Queries**: Read operations that check health status
- **Services**: Business logic for health checks
- **No Commands**: Health module is read-only

#### Event-Driven Architecture

The health module does not publish domain events as it's a read-only monitoring module.

## Domain Model

### Health Aggregate

The `HealthAggregate` represents the health status of the system:

```typescript
class HealthAggregate {
  status: HealthStatusValueObject;
  writeDatabaseStatus: HealthStatusValueObject;
  readDatabaseStatus: HealthStatusValueObject;
}
```

**Properties:**

- `status`: Overall system health status (OK, ERROR, WARNING)
- `writeDatabaseStatus`: PostgreSQL connection status
- `readDatabaseStatus`: MongoDB connection status

### Health View Model

The `HealthViewModel` is optimized for read operations and returned by queries:

```typescript
class HealthViewModel {
  status: string;
  writeDatabaseStatus: string;
  readDatabaseStatus: string;
}
```

### Value Objects

- **HealthStatusValueObject**: Validates health status enum values (OK, ERROR, WARNING)

### Enums

- **HealthStatusEnum**: Defines possible health status values
  - `OK`: System is healthy
  - `ERROR`: System has errors
  - `WARNING`: System has warnings

## Health Status

The module checks three different health statuses:

### Overall Status

The overall status is determined by the database checks:

- **OK**: Both write and read databases are healthy
- **ERROR**: One or both databases are unhealthy

### Write Database Status

Checks the PostgreSQL connection:

- **OK**: Connection successful
- **ERROR**: Connection failed

### Read Database Status

Checks the MongoDB connection:

- **OK**: Connection successful
- **ERROR**: Connection failed

## Queries

### HealthCheckQuery

Checks the overall health of the application.

**Handler:** `HealthCheckQueryHandler`

**Process:**

1. Checks write database (PostgreSQL) connection
2. Checks read database (MongoDB) connection
3. Determines overall status based on database checks
4. Returns `HealthViewModel` with all statuses

**Output:** `HealthViewModel`

**Business Rules:**

- Overall status is OK only if both databases are OK
- Overall status is ERROR if any database check fails

## GraphQL API

The module exposes a GraphQL query for health checks.

### Authentication

Health checks are typically public endpoints and don't require authentication.

### HealthQueryResolver

Handles health check queries.

**Query:**

#### healthCheck

Checks the health of the application.

```graphql
query HealthCheck {
  healthCheck {
    status
    writeDatabaseStatus
    readDatabaseStatus
  }
}
```

**Response:**

```json
{
  "data": {
    "healthCheck": {
      "status": "OK",
      "writeDatabaseStatus": "OK",
      "readDatabaseStatus": "OK"
    }
  }
}
```

**Possible Status Values:**

- `OK`: System is healthy
- `ERROR`: System has errors

## REST API

The module also provides a REST endpoint for health checks.

### HealthController

Handles REST health check requests.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "OK",
  "writeDatabaseStatus": "OK",
  "readDatabaseStatus": "OK"
}
```

**Status Codes:**

- `200 OK`: Health check successful
- `503 Service Unavailable`: Health check failed (if configured)

## Usage Examples

### GraphQL Query

```graphql
query {
  healthCheck {
    status
    writeDatabaseStatus
    readDatabaseStatus
  }
}
```

### REST Request

```bash
curl http://localhost:4100/health
```

**Response:**

```json
{
  "status": "OK",
  "writeDatabaseStatus": "OK",
  "readDatabaseStatus": "OK"
}
```

### Using in Load Balancer

Configure your load balancer to check the health endpoint:

```nginx
upstream api {
    server api1:4100;
    server api2:4100;

    # Health check
    check interval=3000 rise=2 fall=3 timeout=1000;
    check_http_send "GET /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

### Using in Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  containers:
    - name: api
      image: api:latest
      livenessProbe:
        httpGet:
          path: /health
          port: 4100
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /health
          port: 4100
        initialDelaySeconds: 5
        periodSeconds: 5
```

### Using in Docker Compose

```yaml
services:
  api:
    image: api:latest
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:4100/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Configuration

The health module doesn't require specific configuration. It automatically uses the database connections configured in the application.

### Environment Variables

The health checks use the same database connections as the rest of the application:

```env
# PostgreSQL (Write Database)
DATABASE_URL="postgresql://user:password@localhost:5432/project_db"

# MongoDB (Read Database)
MONGODB_URI="mongodb://localhost:27017/project_event_store"
```

## Troubleshooting

### Common Issues

1. **Health Check Returns ERROR**
   - **Solution**: Check database connections
   - Verify `DATABASE_URL` and `MONGODB_URI` are correct
   - Ensure databases are running and accessible
   - Check network connectivity

2. **Write Database Status is ERROR**
   - **Solution**: Check PostgreSQL connection
   - Verify PostgreSQL is running
   - Check connection string format
   - Ensure database exists
   - Check firewall rules

3. **Read Database Status is ERROR**
   - **Solution**: Check MongoDB connection
   - Verify MongoDB is running
   - Check connection string format
   - Ensure MongoDB is accessible
   - Check firewall rules

4. **Health Endpoint Not Responding**
   - **Solution**: Check application is running
   - Verify port configuration
   - Check application logs
   - Ensure module is properly registered

### Debugging

Enable debug logging to see detailed health check information:

```env
LOG_LEVEL=debug
```

This will show:

- Database connection attempts
- Connection success/failure
- Health check execution time

## Best Practices

1. **Monitoring**: Use health checks in monitoring systems (Prometheus, Datadog, etc.)
2. **Load Balancers**: Configure load balancers to use health checks for routing
3. **Deployment**: Use health checks in deployment pipelines to verify deployments
4. **Alerting**: Set up alerts when health checks fail
5. **Response Time**: Keep health checks fast (< 1 second)
6. **Caching**: Don't cache health check results (they should be real-time)

## Integration with Other Modules

### Shared Module

- Uses shared value objects and utilities
- Uses shared database services

### Logging Module

- Health checks are logged for monitoring
- Errors are logged with appropriate log levels

## Related Documentation

- [Main README](../../../../README.md)
- [User Module](../../../generic/users/README.md)
- [Auth Module](../../../generic/auth/README.md)
- [Saga Context](../../../generic/saga-context/README.md)
