import type { UpdatePlantInput } from "@repo/sdk";
import { usePlants } from "@repo/sdk";

/**
 * Hook that provides plant update functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantUpdate() {
	const { update } = usePlants();

	const handleUpdate = async (
		input: UpdatePlantInput,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const result = await update.mutate(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const updateError =
				error instanceof Error ? error : new Error("Plant update failed");
			onError?.(updateError);
		}
	};

	return {
		handleUpdate,
		isLoading: update.loading,
		error: update.error,
	};
}


