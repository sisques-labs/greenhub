import type { CreateLocationInput } from "@repo/sdk";
import { useLocations } from "@repo/sdk";
import type { LocationCreateFormValues } from "@/core/location-context/location/dtos/schemas/location-create/location-create.schema";

/**
 * Hook that provides location create functionality
 * Uses SDK directly since backend handles all validation
 */
export function useLocationCreate() {
	const { create } = useLocations();

	const handleCreate = async (
		values: LocationCreateFormValues,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: CreateLocationInput = {
				name: values.name,
				type: values.type,
				description: values.description || null,
			};

			const result = await create.mutate(input);

			if (result?.success) {
				onSuccess?.();
			} else {
				const createError = new Error(
					result?.message || "Location create failed",
				);
				onError?.(createError);
			}
		} catch (error) {
			const createError =
				error instanceof Error
					? error
					: new Error("Location create failed");
			onError?.(createError);
		}
	};

	return {
		handleCreate,
		isLoading: create.loading,
		error: create.error,
	};
}

