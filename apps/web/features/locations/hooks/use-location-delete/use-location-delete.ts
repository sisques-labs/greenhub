import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApiClient } from "../../api/locations-api.client";
import type { LocationDeleteInput } from "../../api/types";

/**
 * Hook that provides location delete functionality using TanStack Query
 * Replaces SDK's useLocations().delete with API client
 */
export function useLocationDelete() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: LocationDeleteInput) =>
      locationsApiClient.delete(input),
    onSuccess: (_, variables) => {
      // Invalidate specific location and list
      queryClient.invalidateQueries({
        queryKey: ["locations", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["locations", "list"] });
    },
  });

  const handleDelete = async (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const input: LocationDeleteInput = { id };

      const result = await mutation.mutateAsync(input);

      if (result.success) {
        onSuccess?.();
      } else {
        const deleteError = new Error(result.message || "Location delete failed");
        onError?.(deleteError);
      }
    } catch (error) {
      const deleteError =
        error instanceof Error ? error : new Error("Location delete failed");
      onError?.(deleteError);
    }
  };

  return {
    handleDelete,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
