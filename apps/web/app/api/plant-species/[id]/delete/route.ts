import { PLANT_SPECIES_DELETE_MUTATION } from '@/features/plant-species/api/mutations/plant-species-delete.mutation';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/plant-species/[id]/delete
 * Delete a plant species
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: 'Plant species ID is required' },
				{ status: 400 },
			);
		}

		const result = await graphqlClient.request<{
			plantSpeciesDelete: IMutationResponse;
		}>({
			query: PLANT_SPECIES_DELETE_MUTATION,
			variables: { input: { id } },
			useAuth: true,
		});

		return NextResponse.json(result.plantSpeciesDelete);
	} catch (error) {
		console.error('Plant species delete error:', error);

		return NextResponse.json(
			{
				error: 'Failed to delete plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
