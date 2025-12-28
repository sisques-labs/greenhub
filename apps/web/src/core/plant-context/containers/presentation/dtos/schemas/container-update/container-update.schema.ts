import { z } from 'zod';

/**
 * Schema factory for container update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for container update form validation
 */
export function createContainerUpdateSchema(
  translations: (key: string) => string,
) {
  return z.object({
    id: z.string().min(1, translations('container.validation.id.required')),
    name: z.string().optional(),
    type: z
      .enum(['POT', 'GARDEN_BED', 'HANGING_BASKET', 'WINDOW_BOX'], {
        errorMap: () => ({
          message: translations('container.validation.type.invalid'),
        }),
      })
      .optional(),
  });
}

export type ContainerUpdateFormValues = z.infer<
  ReturnType<typeof createContainerUpdateSchema>
>;
