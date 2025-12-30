'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PLANT_STATUS } from '@repo/sdk';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/shared/presentation/components/ui/dialog';
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
  createPlantCreateSchema,
  PlantCreateFormValues,
} from '@/core/plant-context/plant/dtos/schemas/plant-create/plant-create.schema';

interface PlantCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlantCreateFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  growingUnitId: string;
}

export function PlantCreateForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
  growingUnitId,
}: PlantCreateFormProps) {
  const t = useTranslations();

  // Create schema with translations
  const createSchema = useMemo(
    () => createPlantCreateSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with empty values
  const form = useForm<PlantCreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      species: '',
      plantedDate: new Date(),
      notes: '',
      status: PLANT_STATUS.PLANTED,
      growingUnitId: growingUnitId,
    },
  });

  const handleSubmit = async (values: PlantCreateFormValues) => {
    await onSubmit(values);
    if (!error) {
      form.reset({
        name: '',
        species: '',
        plantedDate: new Date(),
        notes: '',
        status: PLANT_STATUS.PLANTED,
        growingUnitId: growingUnitId,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('plants.actions.create.title')}</DialogTitle>
          <DialogDescription>
            {t('plants.actions.create.description')}
          </DialogDescription>
        </DialogHeader>
        {/* biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control */}
        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          )
                        }
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
                        <SelectItem value={PLANT_STATUS.PLANTED}>
                          {t('plant.status.PLANTED')}
                        </SelectItem>
                        <SelectItem value={PLANT_STATUS.GROWING}>
                          {t('plant.status.GROWING')}
                        </SelectItem>
                        <SelectItem value={PLANT_STATUS.HARVESTED}>
                          {t('plant.status.HARVESTED')}
                        </SelectItem>
                        <SelectItem value={PLANT_STATUS.DEAD}>
                          {t('plant.status.DEAD')}
                        </SelectItem>
                        <SelectItem value={PLANT_STATUS.ARCHIVED}>
                          {t('plant.status.ARCHIVED')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      rows={4}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('plants.actions.create.loading')
                  : t('plants.actions.create.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
