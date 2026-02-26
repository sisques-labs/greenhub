import { PLANT_SPECIES_FIND_BY_ID_QUERY } from '@/features/plant-species/api/queries/plant-species-find-by-id.query';
import type { PlantSpeciesApiResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { PlantSpeciesDetailPage } from 'features/plant-species/components/pages/PlantSpeciesDetailPage/PlantSpeciesDetailPage';
import type { Metadata } from 'next';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	try {
		const { id } = await params;
		const result = await graphqlClient.request<{
			plantSpeciesFindById: PlantSpeciesApiResponse | null;
		}>({
			query: PLANT_SPECIES_FIND_BY_ID_QUERY,
			variables: { input: { id } },
			useAuth: true,
		});

		const species = result.plantSpeciesFindById;
		if (!species) {
			return { title: 'Species Not Found | GreenHub' };
		}

		return {
			title: `${species.commonName} (${species.scientificName}) | GreenHub`,
			description:
				species.description ||
				`Learn about ${species.commonName} care requirements`,
		};
	} catch {
		return { title: 'Species Library | GreenHub' };
	}
}

const Page = () => {
	return <PlantSpeciesDetailPage />;
};

export default Page;
