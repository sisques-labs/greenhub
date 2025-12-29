import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  PLANT_TRANSPLANT_MUTATION,
  PLANT_UPDATE_MUTATION,
} from '../graphql/mutations/plants.mutations.js';
import { PLANT_FIND_BY_ID_QUERY } from '../graphql/queries/plants.queries.js';
import type {
  PlantFindByIdInput,
  PlantResponse,
  PlantTransplantInput,
  UpdatePlantInput,
} from '../index.js';

export class PlantClient {
  constructor(private client: GraphQLClient) {}

  async findById(input: PlantFindByIdInput): Promise<PlantResponse | null> {
    const result = await this.client.request<{
      plantFindById: PlantResponse | null;
    }>({
      query: PLANT_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.plantFindById;
  }

  async update(input: UpdatePlantInput): Promise<MutationResponse> {
    const result = await this.client.request<{ plantUpdate: MutationResponse }>(
      {
        query: PLANT_UPDATE_MUTATION,
        variables: { input },
      },
    );

    return result.plantUpdate;
  }

  async transplant(input: PlantTransplantInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      plantTransplant: MutationResponse;
    }>({
      query: PLANT_TRANSPLANT_MUTATION,
      variables: { input },
    });

    return result.plantTransplant;
  }
}
