import { z } from 'zod';

/**
 * Schema factory for user update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for user update form validation
 */
export function createUserUpdateSchema(translations: (key: string) => string) {
  return z.object({
    id: z.string().min(1, translations('user.validation.id.required')),
    name: z.string().optional(),
    lastName: z.string().optional(),
    userName: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
  });
}

export type UserUpdateFormValues = z.infer<
  ReturnType<typeof createUserUpdateSchema>
>;
