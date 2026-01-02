import type {
	CreateGrowingUnitInput,
	GrowingUnitType,
	LengthUnit,
} from "@repo/sdk";
import { useGrowingUnits } from "@repo/sdk";
import type { GrowingUnitCreateFormValues } from "@/core/plant-context/growing-unit/dtos/schemas/growing-unit-create/growing-unit-create.schema";

/**
 * Hook that provides growing unit create functionality
 * Uses SDK directly since backend handles all validation
 */
export function useGrowingUnitCreate() {
	const { create } = useGrowingUnits();

	const handleCreate = async (
		values: GrowingUnitCreateFormValues,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: CreateGrowingUnitInput = {
				locationId: values.locationId,
				name: values.name,
				type: values.type as GrowingUnitType,
				capacity: values.capacity,
				length: values.length,
				width: values.width,
				height: values.height,
				unit: values.unit as LengthUnit,
			};

			const result = await create.mutate(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const createError =
				error instanceof Error
					? error
					: new Error("Growing unit create failed");
			onError?.(createError);
		}
	};

	return {
		handleCreate,
		isLoading: create.loading,
		error: create.error,
	};
}
