import type { TimelineSequenceGroup } from '@/shared/components/molecules/timeline-sequence';
import { useGrowingUnitsFindByCriteria } from 'features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { usePlantFindById } from 'features/plants/hooks/use-plant-find-by-id/use-plant-find-by-id';
import { usePlantTransplant } from 'features/plants/hooks/use-plant-transplant/use-plant-transplant';
import { usePlantUpdate } from 'features/plants/hooks/use-plant-update/use-plant-update';
import type { PlantUpdateFormValues } from 'features/plants/schemas/plant-update/plant-update.schema';
import { usePlantDetailPageStore } from 'features/plants/stores/plant-detail-page-store';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import type { PlantStatus } from '../../api/types';

/**
 * Hook that provides plant detail page functionality
 * Centralizes all logic for the plant detail page
 */
export function usePlantDetailPage(id: string) {
	const t = useTranslations();
	const {
		transplantDialogOpen,
		setTransplantDialogOpen,
		editDetailsDialogOpen,
		setEditDetailsDialogOpen,
	} = usePlantDetailPageStore();

	const { plant, isLoading, error, refetch } = usePlantFindById(id || '');
	const { growingUnits, isLoading: isLoadingGrowingUnits } =
		useGrowingUnitsFindByCriteria();
	const {
		handleTransplant,
		isLoading: isTransplanting,
		error: transplantError,
	} = usePlantTransplant();
	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = usePlantUpdate();

	const handleTransplantSubmit = useCallback(
		async (targetGrowingUnitId: string) => {
			if (!plant || !plant.growingUnit?.id) return;
			await handleTransplant(
				{
					sourceGrowingUnitId: plant.growingUnit.id,
					targetGrowingUnitId,
					plantId: plant.id,
				},
				() => {
					refetch();
					setTransplantDialogOpen(false);
				},
			);
		},
		[plant, handleTransplant, refetch, setTransplantDialogOpen],
	);

	const handleUpdateSubmit = useCallback(
		async (values: PlantUpdateFormValues) => {
			if (!plant) return;
			await handleUpdate(
				{
					id: plant.id,
					name: values.name,
					species: values.species,
					plantedDate: values.plantedDate?.toISOString() || null,
					notes: values.notes,
					status: values.status as PlantStatus | undefined,
					// Note: growingUnitId is not included as it's not part of UpdatePlantInput
					// The backend should obtain it from the existing plant
				},
				() => {
					refetch();
					setEditDetailsDialogOpen(false);
				},
			);
		},
		[plant, handleUpdate, refetch, setEditDetailsDialogOpen],
	);

	const calculateAge = useCallback(() => {
		if (!plant?.plantedDate) return null;
		const plantedDate = new Date(plant.plantedDate);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - plantedDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const years = Math.floor(diffDays / 365);
		const months = Math.floor((diffDays % 365) / 30);

		if (years > 0 && months > 0) {
			return { years, months, type: 'yearsMonths' as const };
		} else if (years > 0) {
			return { years, type: 'years' as const };
		} else if (months > 0) {
			return { months, type: 'months' as const };
		} else {
			return { days: diffDays, type: 'days' as const };
		}
	}, [plant?.plantedDate]);

	const plantAge = calculateAge();

	// Format plant age for display
	const plantAgeText = useMemo(() => {
		if (!plantAge) return null;
		switch (plantAge.type) {
			case 'yearsMonths':
				return t('features.plants.detail.age.yearsMonths', {
					years: plantAge.years,
					months: plantAge.months,
				});
			case 'years':
				return t('features.plants.detail.age.years', { years: plantAge.years });
			case 'months':
				return t('features.plants.detail.age.months', { months: plantAge.months });
			case 'days':
				return t('features.plants.detail.age.days', { days: plantAge.days });
			default:
				return null;
		}
	}, [plantAge, t]);

	// Format planted date for display
	const formattedPlantedDate = useMemo(() => {
		if (!plant?.plantedDate) return null;
		return new Date(plant.plantedDate).toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	}, [plant?.plantedDate]);

	// Prepare upcoming care data for TimelineSequence
	// TODO: This should be fetched from the backend and not hardcoded
	const upcomingCareGroups: TimelineSequenceGroup[] = useMemo(() => {
		return [
			{
				id: 'tomorrow',
				label: t('features.plants.detail.sections.upcomingCare.tomorrow'),
				isActive: true,
				items: [
					{
						id: 'tomorrow-watering',
						title: t('features.plants.detail.sections.upcomingCare.lightWatering'),
						subtitle: '10:00 AM',
					},
				],
			},
			{
				id: 'in5days',
				label: t('features.plants.detail.sections.upcomingCare.in5Days'),
				items: [
					{
						id: 'in5days-cleaning',
						title: t('features.plants.detail.sections.upcomingCare.cleanLeaves'),
						subtitle: t('features.plants.detail.sections.upcomingCare.duringDay'),
					},
				],
			},
			{
				id: 'in2weeks',
				label: t('features.plants.detail.sections.upcomingCare.in2Weeks'),
				items: [
					{
						id: 'in2weeks-fertilization',
						title: t('features.plants.detail.sections.upcomingCare.fertilization'),
						subtitle: t('features.plants.detail.sections.upcomingCare.spring'),
					},
				],
			},
		];
	}, [t]);

	return {
		// Data
		plant,
		sourceGrowingUnit: plant?.growingUnit || null,
		targetGrowingUnits: growingUnits?.items || [],
		plantAge,
		plantAgeText,
		formattedPlantedDate,
		upcomingCareGroups,

		// Loading states
		isLoading,
		isLoadingGrowingUnits,
		isTransplanting,
		isUpdating,
		isLoadingTransplant: isTransplanting || isLoadingGrowingUnits,

		// Errors
		error,
		transplantError,
		updateError,

		// Dialog state
		transplantDialogOpen,
		setTransplantDialogOpen,
		editDetailsDialogOpen,
		setEditDetailsDialogOpen,

		// Handlers
		refetch,
		handleTransplantSubmit,
		handleUpdateSubmit,
	};
}
