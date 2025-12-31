# Math Module

A utility module providing mathematical operations and calculations for use throughout the application. This module contains services for common mathematical operations like calculating percentages, averages, medians, and rounding numbers.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Services](#services)
- [Usage Examples](#usage-examples)

## Overview

The Math Module provides a centralized set of mathematical utility services that can be used across the application. These services handle common calculations needed for metrics, statistics, and data processing.

### Features

- ✅ Percentage calculations
- ✅ Average (arithmetic mean) calculations
- ✅ Median calculations
- ✅ Number rounding utilities
- ✅ Configurable decimal precision
- ✅ Input validation and error handling
- ✅ Comprehensive test coverage

## Architecture

The module is organized as a simple utility module:

```
math/
├── application/
│   └── services/
│       ├── calculate-percentage/
│       ├── calculate-average/
│       ├── calculate-median/
│       └── round-number/
└── math.module.ts
```

## Services

### CalculatePercentageService

Service for calculating percentages from various inputs.

**Methods:**

- `execute(value: number, total: number, decimals?: number): number` - Calculates percentage
- `calculateOccupancy(used: number, total: number, decimals?: number): number` - Calculates occupancy percentage
- `calculateRemaining(remaining: number, total: number, decimals?: number): number` - Calculates remaining percentage

**Example:**

```typescript
const percentage = calculatePercentageService.execute(25, 100, 2); // Returns 25.00
const occupancy = calculatePercentageService.calculateOccupancy(8, 10); // Returns 80.00
```

### CalculateAverageService

Service for calculating arithmetic means (averages).

**Methods:**

- `execute(values: number[], decimals?: number): number` - Calculates average

**Example:**

```typescript
const average = calculateAverageService.execute([10, 20, 30], 2); // Returns 20.00
```

### CalculateMedianService

Service for calculating median values.

**Methods:**

- `execute(values: number[], decimals?: number): number` - Calculates median

**Example:**

```typescript
const median = calculateMedianService.execute([10, 20, 30], 2); // Returns 20.00
const median = calculateMedianService.execute([10, 20, 30, 40], 2); // Returns 25.00
```

### RoundNumberService

Service for rounding numbers to specified decimal places.

**Methods:**

- `execute(value: number, decimals?: number): number` - Rounds to specified decimals
- `roundUp(value: number): number` - Rounds up to nearest integer
- `roundDown(value: number): number` - Rounds down to nearest integer

**Example:**

```typescript
const rounded = roundNumberService.execute(3.14159, 2); // Returns 3.14
const roundedUp = roundNumberService.roundUp(3.1); // Returns 4
const roundedDown = roundNumberService.roundDown(3.9); // Returns 3
```

## Usage Examples

### Using Commands with CommandBus

```typescript
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CalculatePercentageCommand } from '@/support/math/application/commands/calculate-percentage/calculate-percentage.command';

@Injectable()
export class MyService {
  constructor(private readonly commandBus: CommandBus) {}

  async calculateOccupancyRate(used: number, total: number): Promise<number> {
    return await this.commandBus.execute(
      new CalculatePercentageCommand({
        value: used,
        total,
        decimals: 2,
      }),
    );
  }
}
```

### Using in Overview Calculations

```typescript
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CalculatePercentageCommand } from '@/support/math/application/commands/calculate-percentage/calculate-percentage.command';
import { CalculateAverageCommand } from '@/support/math/application/commands/calculate-average/calculate-average.command';

@Injectable()
export class OverviewService {
  constructor(private readonly commandBus: CommandBus) {}

  async calculateAverageOccupancy(
    growingUnits: GrowingUnitViewModel[],
  ): Promise<number> {
    const occupancies = await Promise.all(
      growingUnits.map((unit) =>
        this.commandBus.execute(
          new CalculatePercentageCommand({
            value: unit.numberOfPlants,
            total: unit.capacity,
            decimals: 2,
          }),
        ),
      ),
    );

    return await this.commandBus.execute(
      new CalculateAverageCommand({
        values: occupancies,
        decimals: 2,
      }),
    );
  }
}
```

### Direct Service Usage (Alternative)

If you prefer to use services directly instead of commands, you can still inject them:

```typescript
import { Injectable } from '@nestjs/common';
import { CalculatePercentageService } from '@/support/math/application/services/calculate-percentage/calculate-percentage.service';

@Injectable()
export class MyService {
  constructor(
    private readonly calculatePercentageService: CalculatePercentageService,
  ) {}

  calculateOccupancyRate(used: number, total: number): number {
    return this.calculatePercentageService.execute(used, total, 2);
  }
}
```

## Best Practices

- Always specify the number of decimal places when precision matters
- Use appropriate service methods for semantic clarity (e.g., `calculateOccupancy` instead of `execute`)
- Handle edge cases (empty arrays, zero totals) in your business logic
- Use the services for consistency across the application
