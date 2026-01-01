import type { UpdateGrowingUnitInput } from "@repo/sdk";
import { useGrowingUnits } from "@repo/sdk";
import type { GrowingUnitUpdateFormValues } from "@/core/plant-context/growing-unit/dtos/schemas/growing-unit-update/growing-unit-update.schema";

/**
 * Hook that provides growing unit update functionality
 * Uses SDK directly since backend handles all validation
 */
export function useGrowingUnitUpdate() {
	const { update } = useGrowingUnits();

	const handleUpdate = async (
		values: GrowingUnitUpdateFormValues,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: UpdateGrowingUnitInput = {
				id: values.id,
				locationId: values.locationId,
				name: values.name,
				type: values.type,
				capacity: values.capacity,
				length: values.length,
				width: values.width,
				height: values.height,
				unit: values.unit,
			};

			const result = await update.mutate(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const updateError =
				error instanceof Error
					? error
					: new Error("Growing unit update failed");
			onError?.(updateError);
		}
	};

	return {
		handleUpdate,
		isLoading: update.loading,
		error: update.error,
	};
}
