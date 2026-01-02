import { GraphQLClient } from "../../shared/client/graphql-client.js";
import type { MutationResponse } from "../../shared/types/index.js";
import {
	LOCATION_CREATE_MUTATION,
	LOCATION_DELETE_MUTATION,
	LOCATION_UPDATE_MUTATION,
} from "../graphql/mutations/location.mutations.js";
import {
	LOCATION_FIND_BY_ID_QUERY,
	LOCATIONS_FIND_BY_CRITERIA_QUERY,
} from "../graphql/queries/location.queries.js";
import type {
	CreateLocationInput,
	DeleteLocationInput,
	LocationFindByCriteriaInput,
	LocationFindByIdInput,
	LocationResponse,
	PaginatedLocationResult,
	UpdateLocationInput,
} from "../index.js";

export class LocationClient {
	constructor(private client: GraphQLClient) {}

	/**
	 * Finds a location by id
	 *
	 * @param input - The input containing the location id
	 * @returns The location if found, null otherwise
	 */
	async findById(input: LocationFindByIdInput): Promise<LocationResponse | null> {
		const result = await this.client.request<{
			locationFindById: LocationResponse | null;
		}>({
			query: LOCATION_FIND_BY_ID_QUERY,
			variables: { input },
		});

		return result.locationFindById;
	}

	/**
	 * Finds locations by criteria with pagination, filters, and sorting
	 *
	 * @param input - Optional input containing filters, sorts, and pagination
	 * @returns Paginated result of locations matching the criteria
	 */
	async findByCriteria(
		input?: LocationFindByCriteriaInput,
	): Promise<PaginatedLocationResult> {
		const result = await this.client.request<{
			locationsFindByCriteria: PaginatedLocationResult;
		}>({
			query: LOCATIONS_FIND_BY_CRITERIA_QUERY,
			variables: { input },
		});

		return result.locationsFindByCriteria;
	}

	/**
	 * Creates a new location
	 *
	 * @param input - The input containing location data
	 * @returns Mutation response with the created location id
	 */
	async create(input: CreateLocationInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			createLocation: MutationResponse;
		}>({
			query: LOCATION_CREATE_MUTATION,
			variables: { input },
		});

		return result.createLocation;
	}

	/**
	 * Updates an existing location
	 *
	 * @param input - The input containing location id and fields to update
	 * @returns Mutation response with the updated location id
	 */
	async update(input: UpdateLocationInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			updateLocation: MutationResponse;
		}>({
			query: LOCATION_UPDATE_MUTATION,
			variables: { input },
		});

		return result.updateLocation;
	}

	/**
	 * Deletes a location
	 *
	 * @param input - The input containing location id
	 * @returns Mutation response
	 */
	async delete(input: DeleteLocationInput): Promise<MutationResponse> {
		const result = await this.client.request<{
			deleteLocation: MutationResponse;
		}>({
			query: LOCATION_DELETE_MUTATION,
			variables: { input },
		});

		return result.deleteLocation;
	}
}

