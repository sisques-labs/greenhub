import type { DeleteGrowingUnitInput } from '@repo/sdk';
import { useGrowingUnits } from '@repo/sdk';

/**
 * Hook that provides growing unit delete functionality
 * Uses SDK directly since backend handles all validation
 */
export function useGrowingUnitDelete() {
	const { delete: remove } = useGrowingUnits();

	const handleDelete = async (
		id: string,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: DeleteGrowingUnitInput = { id };

			const result = await remove.mutate(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const deleteError =
				error instanceof Error
					? error
					: new Error('Growing unit delete failed');
			onError?.(deleteError);
		}
	};

	return {
		handleDelete,
		isLoading: remove.loading,
		error: remove.error,
	};
}
