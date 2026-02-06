import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApiClient } from "../../api/locations-api.client";
import type { LocationUpdateInput } from "../../api/types";
import type { LocationUpdateFormValues } from "../../schemas/location-update/location-update.schema";

/**
 * Hook that provides location update functionality using TanStack Query
 * Replaces SDK's useLocations().update with API client
 */
export function useLocationUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: LocationUpdateInput) =>
      locationsApiClient.update(input),
    onSuccess: (_, variables) => {
      // Invalidate specific location and list
      queryClient.invalidateQueries({
        queryKey: ["locations", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["locations", "list"] });
    },
  });

  const handleUpdate = async (
    id: string,
    values: LocationUpdateFormValues,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const input: LocationUpdateInput = {
        id,
        name: values.name,
        type: values.type,
        description: values.description || undefined,
      };

      const result = await mutation.mutateAsync(input);

      if (result.success) {
        onSuccess?.();
      } else {
        const updateError = new Error(result.message || "Location update failed");
        onError?.(updateError);
      }
    } catch (error) {
      const updateError =
        error instanceof Error ? error : new Error("Location update failed");
      onError?.(updateError);
    }
  };

  return {
    handleUpdate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
