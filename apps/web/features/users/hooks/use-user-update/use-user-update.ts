import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSidebarUserStore } from 'shared/stores/sidebar-user-store';
import type { UpdateUserInput, UserRole, UserStatus } from '../../api/types';
import { usersApiClient } from '../../api/users-api.client';
import type { UserUpdateFormValues } from '../../schemas/user-update/user-update.schema';

/**
 * Hook for updating user using TanStack Query
 * Replaces SDK's useUsers().update with API client
 * Updates sidebar user store when profile is updated
 */
export function useUserUpdate() {
	const queryClient = useQueryClient();
	const { updateProfile } = useSidebarUserStore();

	const mutation = useMutation({
		mutationFn: ({ id, ...input }: UpdateUserInput) =>
			usersApiClient.update(id, input),
		onSuccess: (data, variables) => {
			// Invalidate specific user query
			queryClient.invalidateQueries({
				queryKey: ['users', 'detail', variables.id],
			});
			// Also invalidate auth profile query
			queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
		},
	});

	const handleUpdate = async (
		values: UserUpdateFormValues,
		onSuccess?: () => void,
		onError?: (error: Error) => void,
	) => {
		try {
			const input: UpdateUserInput = {
				id: values.id,
				name: values.name,
				lastName: values.lastName,
				userName: values.userName,
				bio: values.bio,
				avatarUrl: values.avatarUrl === '' ? undefined : values.avatarUrl,
				role: values.role as UserRole | undefined,
				status: values.status as UserStatus | undefined,
			};

			const result = await mutation.mutateAsync(input);

			if (result?.success) {
				// Update sidebar user store with new profile data
				updateProfile({
					name: values.name || null,
					lastName: values.lastName || null,
					userName: values.userName || null,
					bio: values.bio || null,
					avatarUrl: values.avatarUrl === '' ? null : values.avatarUrl || null,
					role: values.role as UserRole,
					status: values.status as UserStatus,
				});

				onSuccess?.();
			}
		} catch (error) {
			const updateError =
				error instanceof Error ? error : new Error('User update failed');
			onError?.(updateError);
		}
	};

	return {
		handleUpdate,
		isLoading: mutation.isPending,
		error: mutation.error,
	};
}
