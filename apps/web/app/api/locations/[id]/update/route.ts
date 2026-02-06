import { NextRequest, NextResponse } from "next/server";
import { graphqlClient } from "@/lib/server/graphql-client";
import { LOCATION_UPDATE_MUTATION } from "@/features/locations/api/mutations";
import type { MutationResponse } from "@/features/locations/api/types";

/**
 * PUT /api/locations/[id]/update
 * Update an existing location
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      updateLocation: MutationResponse;
    }>({
      query: LOCATION_UPDATE_MUTATION,
      variables: { input: { id, ...body } },
      useAuth: true,
    });

    if (!result.updateLocation.success) {
      return NextResponse.json(
        {
          error: "Failed to update location",
          message: result.updateLocation.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.updateLocation);
  } catch (error) {
    console.error("Location update error:", error);

    return NextResponse.json(
      {
        error: "Failed to update location",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
