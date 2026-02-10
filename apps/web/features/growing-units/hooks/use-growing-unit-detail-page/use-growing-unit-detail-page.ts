import type { GrowingUnitType } from 'features/growing-units/api/types';
import { useGrowingUnitFindById } from 'features/growing-units/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id';
import { useGrowingUnitUpdate } from 'features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update';
import type { GrowingUnitUpdateFormValues } from 'features/growing-units/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitDetailPageStore } from 'features/growing-units/stores/growing-unit-detail-page-store';
import type { PlantStatus } from 'features/plants/api/types';
import { usePlantAdd } from 'features/plants/hooks/use-plant-add/use-plant-add';
import type { PlantCreateFormValues } from 'features/plants/schemas/plant-create/plant-create.schema';
import { useMemo } from 'react';
import { calculateOccupancyPercentage } from 'shared/lib/utils';

type LocationType = 'indoor' | 'outdoor';

/**
 * Determines location type based on growing unit type
 * POT and WINDOW_BOX are considered indoor, others are outdoor
 */
function determineLocation(type: GrowingUnitType): LocationType {
	return type === 'POT' || type === 'WINDOW_BOX' ? 'indoor' : 'outdoor';
}

/**
 * Transforms plant form values to API format
 * Converts Date objects to ISO strings and ensures proper type casting
 */
function transformPlantFormValues(values: PlantCreateFormValues) {
	return {
		growingUnitId: values.growingUnitId,
		name: values.name,
		species: values.species,
		plantedDate: values.plantedDate?.toISOString() || null,
		notes: values.notes,
		status: values.status as PlantStatus | undefined,
	};
}

/**
 * Hook that provides all the logic for the growing unit detail page
 * Centralizes business logic, data transformation, and event handlers
 */
export function useGrowingUnitDetailPage(id: string) {
	const {
		updateDialogOpen,
		setUpdateDialogOpen,
		createPlantDialogOpen,
		setCreatePlantDialogOpen,
	} = useGrowingUnitDetailPageStore();

	const { growingUnit, isLoading, error, refetch } = useGrowingUnitFindById(
		id || '',
	);

	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = useGrowingUnitUpdate();

	const {
		handleCreate: handlePlantCreate,
		isLoading: isCreatingPlant,
		error: createPlantError,
	} = usePlantAdd();

	// Calculate derived state
	const location = useMemo(
		() =>
			growingUnit
				? determineLocation(growingUnit.type as GrowingUnitType)
				: 'outdoor',
		[growingUnit],
	);

	const occupancyPercentage = useMemo(
		() =>
			growingUnit
				? calculateOccupancyPercentage(
						growingUnit.numberOfPlants,
						growingUnit.capacity,
					)
				: 0,
		[growingUnit],
	);

	// Event handlers
	const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
		await handleUpdate(values, () => {
			refetch();
			setUpdateDialogOpen(false);
		});
	};

	const handlePlantCreateSubmit = async (values: PlantCreateFormValues) => {
		const transformedValues = transformPlantFormValues(values);
		await handlePlantCreate(transformedValues, () => {
			refetch();
			setCreatePlantDialogOpen(false);
		});
	};

	const handleAddPlant = () => {
		setCreatePlantDialogOpen(true);
	};

	const handleEditUnit = () => {
		setUpdateDialogOpen(true);
	};

	return {
		// State
		growingUnit,
		isLoading,
		error,
		location,
		occupancyPercentage,

		// Dialog state
		updateDialogOpen,
		setUpdateDialogOpen,
		createPlantDialogOpen,
		setCreatePlantDialogOpen,

		// Update state
		isUpdating,
		updateError,

		// Plant creation state
		isCreatingPlant,
		createPlantError,

		// Actions
		handleUpdateSubmit,
		handlePlantCreateSubmit,
		handleAddPlant,
		handleEditUnit,
		refetch,
	};
}
