import { PlantSpeciesListPage } from 'features/plant-species/components/pages/PlantSpeciesListPage/PlantSpeciesListPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Species Library | GreenHub',
	description: 'Browse and discover plant species with detailed care information',
};

const Page = () => {
	return <PlantSpeciesListPage />;
};

export default Page;
