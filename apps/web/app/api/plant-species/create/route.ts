import { PLANT_SPECIES_CREATE_MUTATION } from '@/features/plant-species/api/mutations/plant-species-create.mutation';
import type { PlantSpeciesCreateInput } from '@/features/plant-species/api/types/plant-species-request.types';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/plant-species/create
 * Create a new plant species
 */
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as PlantSpeciesCreateInput;

		if (!body.commonName || !body.scientificName || !body.category || !body.difficulty) {
			return NextResponse.json(
				{
					error: 'Common name, scientific name, category, and difficulty are required',
				},
				{ status: 400 },
			);
		}

		const result = await graphqlClient.request<{
			plantSpeciesCreate: IMutationResponse;
		}>({
			query: PLANT_SPECIES_CREATE_MUTATION,
			variables: { input: body },
			useAuth: true,
		});

		return NextResponse.json(result.plantSpeciesCreate);
	} catch (error) {
		console.error('Plant species create error:', error);

		return NextResponse.json(
			{
				error: 'Failed to create plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
