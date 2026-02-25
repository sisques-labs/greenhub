import { PLANT_SPECIES_UPDATE_MUTATION } from '@/features/plant-species/api/mutations/plant-species-update.mutation';
import type { PlantSpeciesUpdateInput } from '@/features/plant-species/api/types/plant-species-request.types';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/plant-species/[id]/update
 * Update an existing plant species
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = (await request.json()) as Omit<PlantSpeciesUpdateInput, 'id'>;

		if (!id) {
			return NextResponse.json(
				{ error: 'Plant species ID is required' },
				{ status: 400 },
			);
		}

		const input: PlantSpeciesUpdateInput = {
			id,
			...body,
		};

		const result = await graphqlClient.request<{
			plantSpeciesUpdate: IMutationResponse;
		}>({
			query: PLANT_SPECIES_UPDATE_MUTATION,
			variables: { input },
			useAuth: true,
		});

		return NextResponse.json(result.plantSpeciesUpdate);
	} catch (error) {
		console.error('Plant species update error:', error);

		return NextResponse.json(
			{
				error: 'Failed to update plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
