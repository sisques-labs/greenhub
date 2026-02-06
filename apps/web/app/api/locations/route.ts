import { NextRequest, NextResponse } from "next/server";
import { graphqlClient } from "@/lib/server/graphql-client";
import { LOCATIONS_FIND_BY_CRITERIA_QUERY } from "@/features/locations/api/queries";
import type {
  LocationsPaginatedApiResponse,
  LocationsPaginatedResponse,
} from "@/features/locations/api/types";
import { transformLocationsPaginatedResponse } from "@/features/locations/api/types";

/**
 * GET /api/locations
 * Get locations list with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = searchParams.get("page");
    const perPage = searchParams.get("perPage");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    const input: Record<string, unknown> = {};
    if (page) input.page = Number.parseInt(page);
    if (perPage) input.perPage = Number.parseInt(perPage);
    if (search) input.search = search;
    if (sortBy) input.sortBy = sortBy;
    if (sortOrder) input.sortOrder = sortOrder;

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      locationsFindByCriteria: LocationsPaginatedApiResponse;
    }>({
      query: LOCATIONS_FIND_BY_CRITERIA_QUERY,
      variables: { input },
      useAuth: true,
    });

    if (!result.locationsFindByCriteria) {
      return NextResponse.json(
        { error: "Locations not found" },
        { status: 404 }
      );
    }

    // Transform response
    const locations: LocationsPaginatedResponse =
      transformLocationsPaginatedResponse(result.locationsFindByCriteria);

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Locations fetch error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch locations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
