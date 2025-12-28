import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import {
  ContainerPlantResponseDto,
  ContainerResponseDto,
  PaginatedContainerResultDto,
} from '@/core/plant-context/containers/transport/graphql/dtos/responses/container.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between ContainerViewModel domain entities and GraphQL DTOs.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (ContainerViewModel) and the
 * GraphQL transport layer (ContainerResponseDto), ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class ContainerGraphQLMapper {
  private readonly logger = new Logger(ContainerGraphQLMapper.name);

  /**
   * Converts a container plant view model to a GraphQL response DTO.
   *
   * @param plant - The container plant view model to convert
   * @returns The GraphQL response DTO
   */
  private toPlantResponseDto(
    plant: ContainerViewModel['plants'][0],
  ): ContainerPlantResponseDto {
    return {
      id: plant.id,
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
   * Converts a container view model to a GraphQL response DTO.
   *
   * @param container - The container view model to convert
   * @returns The GraphQL response DTO
   */
  toResponseDto(container: ContainerViewModel): ContainerResponseDto {
    this.logger.log(
      `Mapping container view model to response dto: ${container.id}`,
    );

    return {
      id: container.id,
      name: container.name,
      type: container.type,
      plants: container.plants.map((plant) => this.toPlantResponseDto(plant)),
      numberOfPlants: container.numberOfPlants,
      createdAt: container.createdAt,
      updatedAt: container.updatedAt,
    };
  }

  /**
   * Converts a paginated result of container view models to a paginated GraphQL response DTO.
   *
   * @param paginatedResult - The paginated result to convert
   * @returns The paginated GraphQL response DTO
   */
  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<ContainerViewModel>,
  ): PaginatedContainerResultDto {
    this.logger.log(
      `Mapping paginated container result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((container) =>
        this.toResponseDto(container),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
