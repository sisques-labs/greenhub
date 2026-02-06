import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApiClient } from "../../api/locations-api.client";
import type { LocationCreateInput } from "../../api/types";
import type { LocationCreateFormValues } from "../../schemas/location-create/location-create.schema";

/**
 * Hook that provides location create functionality using TanStack Query
 * Replaces SDK's useLocations().create with API client
 */
export function useLocationCreate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: LocationCreateInput) =>
      locationsApiClient.create(input),
    onSuccess: () => {
      // Invalidate locations list to refetch
      queryClient.invalidateQueries({ queryKey: ["locations", "list"] });
    },
  });

  const handleCreate = async (
    values: LocationCreateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const input: LocationCreateInput = {
        name: values.name,
        type: values.type,
        description: values.description || undefined,
      };

      const result = await mutation.mutateAsync(input);

      if (result.success) {
        onSuccess?.();
      } else {
        const createError = new Error(result.message || "Location create failed");
        onError?.(createError);
      }
    } catch (error) {
      const createError =
        error instanceof Error ? error : new Error("Location create failed");
      onError?.(createError);
    }
  };

  return {
    handleCreate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
