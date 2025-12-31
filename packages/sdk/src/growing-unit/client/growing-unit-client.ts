import { GraphQLClient } from "../../shared/client/graphql-client.js";
import type { MutationResponse } from "../../shared/types/index.js";
import {
	GROWING_UNIT_CREATE_MUTATION,
	GROWING_UNIT_DELETE_MUTATION,
	GROWING_UNIT_UPDATE_MUTATION,
	PLANT_ADD_MUTATION,
	PLANT_REMOVE_MUTATION,
} from "../graphql/mutations/growing-unit.mutations.js";
import {
	GROWING_UNIT_FIND_BY_ID_QUERY,
	GROWING_UNITS_FIND_BY_CRITERIA_QUERY,
} from "../graphql/queries/growing-unit.queries.js";
import type {
	CreateGrowingUnitInput,
	DeleteGrowingUnitInput,
	GrowingUnitFindByCriteriaInput,
	GrowingUnitFindByIdInput,
	GrowingUnitResponse,
	PaginatedGrowingUnitResult,
	PlantAddInput,
	PlantRemoveInput,
	UpdateGrowingUnitInput,
} from "../index.js";

export class GrowingUnitClient {
	constructor(private client: GraphQLClient) {}

	async findById(
		input: GrowingUnitFindByIdInput,
	): Promise<GrowingUnitResponse | null> {
		const result = await this.client.request<{
			growingUnitFindById: GrowingUnitResponse | null;
		}>({
			query: GROWING_UNIT_FIND_BY_ID_QUERY,
			variables: { input },
		});

		return result.growingUnitFindById;
	}

	async findByCriteria(
		input?: GrowingUnitFindByCriteriaInput,
	): Promise<PaginatedGrowingUnitResult> {
		const result = await this.client.request<{
			growingUnitsFindByCriteria: PaginatedGrowingUnitResult;
		}>({
			query: GROWING_UNITS_FIND_BY_CRITERIA_QUERY,
			variables: { input },
		});

		return result.growingUnitsFindByCriteria;
	}

	async create(input: CreateGrowingUnitInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			growingUnitCreate: MutationResponse;
		}>({
			query: GROWING_UNIT_CREATE_MUTATION,
			variables: { input },
		});

		return result.growingUnitCreate;
	}

	async update(input: UpdateGrowingUnitInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			growingUnitUpdate: MutationResponse;
		}>({
			query: GROWING_UNIT_UPDATE_MUTATION,
			variables: { input },
		});

		return result.growingUnitUpdate;
	}

	async delete(input: DeleteGrowingUnitInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			growingUnitDelete: MutationResponse;
		}>({
			query: GROWING_UNIT_DELETE_MUTATION,
			variables: { input },
		});

		return result.growingUnitDelete;
	}

	async plantAdd(input: PlantAddInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			plantAdd: MutationResponse;
		}>({
			query: PLANT_ADD_MUTATION,
			variables: { input },
		});

		return result.plantAdd;
	}

	async plantRemove(input: PlantRemoveInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			plantRemove: MutationResponse;
		}>({
			query: PLANT_REMOVE_MUTATION,
			variables: { input },
		});

		return result.plantRemove;
	}
}
