import { z } from 'zod';

/**
 * Schema factory for growing unit create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for growing unit create form validation
 */
export function createGrowingUnitCreateSchema(
  translations: (key: string) => string,
) {
  return z.object({
    name: z
      .string()
      .min(1, translations('growingUnit.validation.name.required')),
    type: z.enum(['POT', 'GARDEN_BED', 'HANGING_BASKET', 'WINDOW_BOX'], {
      errorMap: () => ({
        message: translations('growingUnit.validation.type.invalid'),
      }),
    }),
    capacity: z
      .number()
      .min(1, translations('growingUnit.validation.capacity.required')),
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z
      .enum(['MILLIMETER', 'CENTIMETER', 'METER', 'INCH', 'FOOT'])
      .optional(),
  });
}

export type GrowingUnitCreateFormValues = z.infer<
  ReturnType<typeof createGrowingUnitCreateSchema>
>;
