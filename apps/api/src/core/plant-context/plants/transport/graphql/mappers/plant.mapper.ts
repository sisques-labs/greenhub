import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import {
  PaginatedPlantResultDto,
  PlantResponseDto,
} from '@/core/plant-context/plants/transport/graphql/dtos/responses/plant.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between PlantViewModel domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantViewModel) and the
 * GraphQL transport layer (PlantResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class PlantGraphQLMapper {
  private readonly logger = new Logger(PlantGraphQLMapper.name);

  /**
   * Converts a plant view model to a GraphQL response DTO.
   *
   * @param plant - The plant view model to convert
   * @returns The GraphQL response DTO
   */
  toResponseDto(plant: PlantViewModel): PlantResponseDto {
    this.logger.log(`Mapping plant view model to response dto: ${plant.id}`);

    return {
      id: plant.id,
      containerId: plant.containerId,
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
   * Converts a paginated result of plant view models to a paginated GraphQL response DTO.
   *
   * @param paginatedResult - The paginated result to convert
   * @returns The paginated GraphQL response DTO
   */
  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<PlantViewModel>,
  ): PaginatedPlantResultDto {
    this.logger.log(
      `Mapping paginated plant result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((plant) => this.toResponseDto(plant)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
