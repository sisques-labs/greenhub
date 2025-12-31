import type { PlantTransplantInput } from '@repo/sdk';
import { usePlants } from '@repo/sdk';

/**
 * Hook that provides plant transplant functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantTransplant() {
	const { transplant } = usePlants();

	const handleTransplant = async (
		input: PlantTransplantInput,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const result = await transplant.mutate(input);

			if (result?.success) {
				onSuccess?.();
			}
		} catch (error) {
			const transplantError =
				error instanceof Error
					? error
					: new Error('Plant transplant failed');
			onError?.(transplantError);
		}
	};

	return {
		handleTransplant,
		isLoading: transplant.loading,
		error: transplant.error,
	};
}

