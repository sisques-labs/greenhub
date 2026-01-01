import type { LocationUpdateFormValues } from '@/core/location-context/location/dtos/schemas/location-update/location-update.schema';
import type { UpdateLocationInput } from '@repo/sdk';
import { useLocations } from '@repo/sdk';

/**
 * Hook that provides location update functionality
 * Uses SDK directly since backend handles all validation
 */
export function useLocationUpdate() {
	const { update } = useLocations();

	const handleUpdate = async (
		values: LocationUpdateFormValues,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: UpdateLocationInput = {
				id: values.id,
				name: values.name,
				type: values.type,
				description: values.description || null,
			};

			const result = await update.mutate(input);

			if (result?.success) {
				onSuccess?.();
			} else {
				const updateError = new Error(
					result?.message || 'Location update failed',
				);
				onError?.(updateError);
			}
		} catch (error) {
			const updateError =
				error instanceof Error ? error : new Error('Location update failed');
			onError?.(updateError);
		}
	};

	return {
		handleUpdate,
		isLoading: update.loading,
		error: update.error,
	};
}
