import { NextRequest, NextResponse } from "next/server";
import { graphqlClient } from "@/lib/server/graphql-client";
import { LOCATION_FIND_BY_ID_QUERY } from "@/features/locations/api/queries";
import type {
  LocationApiResponse,
  LocationResponse,
} from "@/features/locations/api/types";
import { transformLocationResponse } from "@/features/locations/api/types";

/**
 * GET /api/locations/[id]
 * Get location by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      locationFindById: LocationApiResponse | null;
    }>({
      query: LOCATION_FIND_BY_ID_QUERY,
      variables: { input: { id } },
      useAuth: true,
    });

    if (!result.locationFindById) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    // Transform response
    const location: LocationResponse = transformLocationResponse(
      result.locationFindById
    );

    return NextResponse.json(location);
  } catch (error) {
    console.error("Location fetch error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch location",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
