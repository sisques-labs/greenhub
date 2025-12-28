import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  PLANT_CREATE_MUTATION,
  PLANT_UPDATE_MUTATION,
  PLANT_DELETE_MUTATION,
  PLANT_CHANGE_STATUS_MUTATION,
} from '../graphql/mutations/plants.mutations.js';
import {
  PLANT_FIND_BY_CRITERIA_QUERY,
  PLANT_FIND_BY_ID_QUERY,
} from '../graphql/queries/plants.queries.js';
import type {
  CreatePlantInput,
  UpdatePlantInput,
  DeletePlantInput,
  ChangePlantStatusInput,
  PaginatedPlantResult,
  PlantFindByCriteriaInput,
  PlantFindByIdInput,
  PlantResponse,
} from '../index.js';

export class PlantClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: PlantFindByCriteriaInput,
  ): Promise<PaginatedPlantResult> {
    const result = await this.client.request<{
      plantsFindByCriteria: PaginatedPlantResult;
    }>({
      query: PLANT_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.plantsFindByCriteria;
  }

  async findById(input: PlantFindByIdInput): Promise<PlantResponse> {
    const result = await this.client.request<{ plantFindById: PlantResponse }>({
      query: PLANT_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.plantFindById;
  }

  async create(input: CreatePlantInput): Promise<MutationResponse> {
    const result = await this.client.request<{ createPlant: MutationResponse }>(
      {
        query: PLANT_CREATE_MUTATION,
        variables: { input },
      },
    );

    return result.createPlant;
  }

  async update(input: UpdatePlantInput): Promise<MutationResponse> {
    const result = await this.client.request<{ updatePlant: MutationResponse }>(
      {
        query: PLANT_UPDATE_MUTATION,
        variables: { input },
      },
    );

    return result.updatePlant;
  }

  async delete(input: DeletePlantInput): Promise<MutationResponse> {
    const result = await this.client.request<{ deletePlant: MutationResponse }>(
      {
        query: PLANT_DELETE_MUTATION,
        variables: { input },
      },
    );

    return result.deletePlant;
  }

  async changeStatus(input: ChangePlantStatusInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      changePlantStatus: MutationResponse;
    }>({
      query: PLANT_CHANGE_STATUS_MUTATION,
      variables: { input },
    });

    return result.changePlantStatus;
  }
}
