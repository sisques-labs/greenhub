import type { DeleteLocationInput } from '@repo/sdk';
import { useLocations } from '@repo/sdk';

/**
 * Hook that provides location delete functionality
 * Uses SDK directly since backend handles all validation
 */
export function useLocationDelete() {
	const { delete: remove } = useLocations();

	const handleDelete = async (
		id: string,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: DeleteLocationInput = { id };

			const result = await remove.mutate(input);

			if (result?.success) {
				onSuccess?.();
			} else {
				const deleteError = new Error(
					result?.message || 'Location delete failed',
				);
				onError?.(deleteError);
			}
		} catch (error) {
			const deleteError =
				error instanceof Error ? error : new Error('Location delete failed');
			onError?.(deleteError);
		}
	};

	return {
		handleDelete,
		isLoading: remove.loading,
		error: remove.error,
	};
}
