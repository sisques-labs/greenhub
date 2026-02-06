import { NextRequest, NextResponse } from "next/server";
import { graphqlClient } from "@/lib/server/graphql-client";
import { LOCATION_CREATE_MUTATION } from "@/features/locations/api/mutations";
import type { MutationResponse } from "@/features/locations/api/types";

/**
 * POST /api/locations/create
 * Create a new location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      createLocation: MutationResponse;
    }>({
      query: LOCATION_CREATE_MUTATION,
      variables: { input: body },
      useAuth: true,
    });

    if (!result.createLocation.success) {
      return NextResponse.json(
        {
          error: "Failed to create location",
          message: result.createLocation.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.createLocation);
  } catch (error) {
    console.error("Location create error:", error);

    return NextResponse.json(
      {
        error: "Failed to create location",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
