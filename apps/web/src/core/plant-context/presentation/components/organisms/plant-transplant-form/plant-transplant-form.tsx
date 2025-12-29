'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { PlantResponse } from '@repo/sdk';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/shared/presentation/components/ui/form';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  createPlantTransplantSchema,
  PlantTransplantFormValues,
} from '@/core/plant-context/presentation/dtos/schemas/plant-transplant/plant-transplant.schema';

interface PlantTransplantFormProps {
  plant: PlantResponse;
  onSubmit: (values: PlantTransplantFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function PlantTransplantForm({
  plant,
  onSubmit,
  isLoading,
  error,
}: PlantTransplantFormProps) {
  const t = useTranslations();

  // Create schema with translations
  const transplantSchema = useMemo(
    () => createPlantTransplantSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with plant values
  const form = useForm<PlantTransplantFormValues>({
    resolver: zodResolver(transplantSchema),
    defaultValues: {
      plantId: plant.id,
      sourceGrowingUnitId: plant.growingUnitId,
      targetGrowingUnitId: '',
    },
  });

  // Check if form has been modified
  const isDirty = form.formState.isDirty;
  const isSubmitting = isLoading;

  return (
    // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
          control={form.control as any}
          name="sourceGrowingUnitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('plant.fields.sourceGrowingUnitId.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'plant.fields.sourceGrowingUnitId.placeholder',
                  )}
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
          control={form.control as any}
          name="targetGrowingUnitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('plant.fields.targetGrowingUnitId.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'plant.fields.targetGrowingUnitId.placeholder',
                  )}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-destructive">{error.message}</div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting
              ? t('plant.actions.transplant.loading')
              : t('plant.actions.transplant.label')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
