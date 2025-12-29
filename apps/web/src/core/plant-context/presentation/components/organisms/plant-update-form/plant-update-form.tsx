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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/presentation/components/ui/select';
import { Textarea } from '@repo/shared/presentation/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  createPlantUpdateSchema,
  PlantUpdateFormValues,
} from '@/core/plant-context/presentation/dtos/schemas/plant-update/plant-update.schema';

interface PlantUpdateFormProps {
  plant: PlantResponse;
  onSubmit: (values: PlantUpdateFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function PlantUpdateForm({
  plant,
  onSubmit,
  isLoading,
  error,
}: PlantUpdateFormProps) {
  const t = useTranslations();

  // Create schema with translations
  const updateSchema = useMemo(
    () => createPlantUpdateSchema((key: string) => t(key)),
    [t],
  );

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date?: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Form - initialized with plant values
  const form = useForm<PlantUpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      id: plant.id,
      name: plant.name || '',
      species: plant.species || '',
      plantedDate: formatDateForInput(plant.plantedDate),
      notes: plant.notes || '',
      status: plant.status,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plant.fields.name.label')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('plant.fields.name.placeholder')}
                  disabled={isLoading}
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
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plant.fields.species.label')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('plant.fields.species.placeholder')}
                  disabled={isLoading}
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
          name="plantedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plant.fields.plantedDate.label')}</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isLoading}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
          control={form.control as any}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plant.fields.status.label')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('plant.fields.status.placeholder')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PLANTED">
                    {t('plant.status.PLANTED')}
                  </SelectItem>
                  <SelectItem value="GROWING">
                    {t('plant.status.GROWING')}
                  </SelectItem>
                  <SelectItem value="HARVESTED">
                    {t('plant.status.HARVESTED')}
                  </SelectItem>
                  <SelectItem value="DEAD">{t('plant.status.DEAD')}</SelectItem>
                  <SelectItem value="ARCHIVED">
                    {t('plant.status.ARCHIVED')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
          control={form.control as any}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('plant.fields.notes.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('plant.fields.notes.placeholder')}
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
              ? t('plant.actions.update.loading')
              : t('plant.actions.update.label')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
