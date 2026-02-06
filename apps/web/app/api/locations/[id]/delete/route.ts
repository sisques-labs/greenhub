import { NextRequest, NextResponse } from "next/server";
import { graphqlClient } from "@/lib/server/graphql-client";
import { LOCATION_DELETE_MUTATION } from "@/features/locations/api/mutations";
import type { MutationResponse } from "@/features/locations/api/types";

/**
 * DELETE /api/locations/[id]/delete
 * Delete a location
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      deleteLocation: MutationResponse;
    }>({
      query: LOCATION_DELETE_MUTATION,
      variables: { input: { id } },
      useAuth: true,
    });

    if (!result.deleteLocation.success) {
      return NextResponse.json(
        {
          error: "Failed to delete location",
          message: result.deleteLocation.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.deleteLocation);
  } catch (error) {
    console.error("Location delete error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete location",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
