import { GraphQLClient } from '../../shared/client/graphql-client.js';
import type { MutationResponse } from '../../shared/types/index.js';
import {
  CONTAINER_CREATE_MUTATION,
  CONTAINER_UPDATE_MUTATION,
  CONTAINER_DELETE_MUTATION,
} from '../graphql/mutations/containers.mutations.js';
import {
  CONTAINER_FIND_BY_CRITERIA_QUERY,
  CONTAINER_FIND_BY_ID_QUERY,
} from '../graphql/queries/containers.queries.js';
import type {
  CreateContainerInput,
  UpdateContainerInput,
  DeleteContainerInput,
  PaginatedContainerResult,
  ContainerFindByCriteriaInput,
  ContainerFindByIdInput,
  ContainerResponse,
} from '../index.js';

export class ContainerClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: ContainerFindByCriteriaInput,
  ): Promise<PaginatedContainerResult> {
    const result = await this.client.request<{
      containersFindByCriteria: PaginatedContainerResult;
    }>({
      query: CONTAINER_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.containersFindByCriteria;
  }

  async findById(input: ContainerFindByIdInput): Promise<ContainerResponse> {
    const result = await this.client.request<{
      containerFindById: ContainerResponse;
    }>({
      query: CONTAINER_FIND_BY_ID_QUERY,
      variables: { input },
    });

    return result.containerFindById;
  }

  async create(input: CreateContainerInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      createContainer: MutationResponse;
    }>({
      query: CONTAINER_CREATE_MUTATION,
      variables: { input },
    });

    return result.createContainer;
  }

  async update(input: UpdateContainerInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      updateContainer: MutationResponse;
    }>({
      query: CONTAINER_UPDATE_MUTATION,
      variables: { input },
    });

    return result.updateContainer;
  }

  async delete(input: DeleteContainerInput): Promise<MutationResponse> {
    const result = await this.client.request<{
      deleteContainer: MutationResponse;
    }>({
      query: CONTAINER_DELETE_MUTATION,
      variables: { input },
    });

    return result.deleteContainer;
  }
}
