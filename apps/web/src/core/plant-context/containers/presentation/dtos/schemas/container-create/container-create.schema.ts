import { z } from 'zod';

/**
 * Schema factory for container create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for container create form validation
 */
export function createContainerCreateSchema(
  translations: (key: string) => string,
) {
  return z.object({
    name: z.string().min(1, translations('container.validation.name.required')),
    type: z.enum(['POT', 'GARDEN_BED', 'HANGING_BASKET', 'WINDOW_BOX'], {
      errorMap: () => ({
        message: translations('container.validation.type.invalid'),
      }),
    }),
  });
}

export type ContainerCreateFormValues = z.infer<
  ReturnType<typeof createContainerCreateSchema>
>;
