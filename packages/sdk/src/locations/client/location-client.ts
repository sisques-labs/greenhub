import { GraphQLClient } from "../../shared/client/graphql-client.js";
import {
	LOCATION_FIND_BY_ID_QUERY,
	LOCATIONS_FIND_BY_CRITERIA_QUERY,
} from "../graphql/queries/location.queries.js";
import type {
	LocationFindByCriteriaInput,
	LocationFindByIdInput,
	LocationResponse,
	PaginatedLocationResult,
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
}

