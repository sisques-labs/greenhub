import { GraphQLClient } from '../../shared/client/graphql-client.js';
import { OVERVIEW_FIND_QUERY } from '../graphql/queries/overview.queries.js';
import type { OverviewResponse } from '../types/overview-response.type.js';

export class OverviewClient {
  constructor(private client: GraphQLClient) {}

  /**
   * Finds the overview with all system metrics.
   *
   * @returns The overview response with all metrics, or null if not found
   */
  async find(): Promise<OverviewResponse | null> {
    const result = await this.client.request<{
      findOverview: OverviewResponse | null;
    }>({
      query: OVERVIEW_FIND_QUERY,
    });

    return result.findOverview;
  }
}
