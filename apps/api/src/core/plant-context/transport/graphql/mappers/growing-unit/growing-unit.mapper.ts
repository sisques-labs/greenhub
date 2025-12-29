import { Injectable, Logger } from '@nestjs/common';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import {
  GrowingUnitDimensionsResponseDto,
  GrowingUnitResponseDto,
  PaginatedGrowingUnitResultDto,
} from '@/core/plant-context/transport/graphql/dtos/responses/growing-unit/growing-unit.response.dto';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Mapper for converting between GrowingUnitViewModel domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (GrowingUnitViewModel) and the
 * GraphQL transport layer (GrowingUnitResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class GrowingUnitGraphQLMapper {
  private readonly logger = new Logger(GrowingUnitGraphQLMapper.name);

  /**
   * Converts a plant view model to a GraphQL response DTO.
   *
   * @param plant - The plant view model to convert
   * @returns The GraphQL response DTO
   */
  private toPlantResponseDto(
    plant: GrowingUnitViewModel['plants'][0],
  ): PlantResponseDto {
    return {
      id: plant.id,
      growingUnitId: plant.growingUnitId,
      name: plant.name,
      species: plant.species,
      plantedDate: plant.plantedDate,
      notes: plant.notes,
      status: plant.status,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    };
  }

  /**
   * Converts dimensions to a GraphQL response DTO.
   *
   * @param dimensions - The dimensions to convert
   * @returns The GraphQL response DTO
   */
  private toDimensionsResponseDto(dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  }): GrowingUnitDimensionsResponseDto {
    return {
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      unit: dimensions.unit,
    };
  }

  /**
   * Converts a growing unit view model to a GraphQL response DTO.
   *
   * @param growingUnit - The growing unit view model to convert
   * @returns The GraphQL response DTO
   */
  toResponseDto(growingUnit: GrowingUnitViewModel): GrowingUnitResponseDto {
    this.logger.log(
      `Mapping growing unit view model to response dto: ${growingUnit.id}`,
    );

    return {
      id: growingUnit.id,
      name: growingUnit.name,
      type: growingUnit.type,
      capacity: growingUnit.capacity,
      dimensions: growingUnit.dimensions
        ? this.toDimensionsResponseDto(growingUnit.dimensions)
        : null,
      plants: growingUnit.plants.map((plant) => this.toPlantResponseDto(plant)),
      numberOfPlants: growingUnit.numberOfPlants,
      remainingCapacity: growingUnit.remainingCapacity,
      volume: growingUnit.volume,
      createdAt: growingUnit.createdAt,
      updatedAt: growingUnit.updatedAt,
    };
  }

  /**
   * Converts a paginated result of growing unit view models to a paginated GraphQL response DTO.
   *
   * @param paginatedResult - The paginated result to convert
   * @returns The paginated GraphQL response DTO
   */
  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<GrowingUnitViewModel>,
  ): PaginatedGrowingUnitResultDto {
    this.logger.log(
      `Mapping paginated growing unit result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((growingUnit) =>
        this.toResponseDto(growingUnit),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
