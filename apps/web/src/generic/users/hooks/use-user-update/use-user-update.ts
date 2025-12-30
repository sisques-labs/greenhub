import type { UserUpdateFormValues } from '@/generic/users/dtos/schemas/user-update/user-update.schema';
import { useSidebarUserStore } from '@/shared/stores/sidebar-user-store';
import type { UpdateUserInput, UserRole, UserStatus } from '@repo/sdk';
import { useUsers } from '@repo/sdk';

/**
 * Hook that provides user update functionality
 * Uses SDK directly since backend handles all validation
 * Updates sidebar user store when profile is updated
 */
export function useUserUpdate() {
  const { update } = useUsers();
  const { updateProfile } = useSidebarUserStore();

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
        role: values.role as UserRole,
        status: values.status as UserStatus,
      };

      const result = await update.mutate(input);

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
    isLoading: update.loading,
    error: update.error,
  };
}
