'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { GrowingUnitResponse } from '@repo/sdk';
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
import { useTranslations } from 'next-intl';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  createGrowingUnitUpdateSchema,
  GrowingUnitUpdateFormValues,
} from '@/core/plant-context/presentation/dtos/schemas/growing-unit-update/growing-unit-update.schema';

interface GrowingUnitUpdateFormProps {
  growingUnit: GrowingUnitResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GrowingUnitUpdateFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function GrowingUnitUpdateForm({
  growingUnit,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
}: GrowingUnitUpdateFormProps) {
  const t = useTranslations();

  // Create schema with translations
  const updateSchema = useMemo(
    () => createGrowingUnitUpdateSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with growing unit values
  const form = useForm<GrowingUnitUpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      id: '',
      name: '',
      type: 'POT',
      capacity: 1,
      length: undefined,
      width: undefined,
      height: undefined,
      unit: 'CENTIMETER',
    },
  });

  // Update form when growing unit changes
  useEffect(() => {
    if (growingUnit) {
      form.reset({
        id: growingUnit.id,
        name: growingUnit.name,
        type: growingUnit.type as
          | 'POT'
          | 'GARDEN_BED'
          | 'HANGING_BASKET'
          | 'WINDOW_BOX',
        capacity: growingUnit.capacity,
        length: growingUnit.dimensions?.length,
        width: growingUnit.dimensions?.width,
        height: growingUnit.dimensions?.height,
        unit: growingUnit.dimensions?.unit as
          | 'MILLIMETER'
          | 'CENTIMETER'
          | 'METER'
          | 'INCH'
          | 'FOOT'
          | undefined,
      });
    }
  }, [growingUnit, form]);

  const handleSubmit = async (values: GrowingUnitUpdateFormValues) => {
    await onSubmit(values);
    if (!error) {
      onOpenChange(false);
    }
  };

  if (!growingUnit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('growingUnit.actions.update.title')}</DialogTitle>
          <DialogDescription>
            {t('growingUnit.actions.update.description')}
          </DialogDescription>
        </DialogHeader>
        {/* biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control */}
        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('growingUnit.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('growingUnit.fields.name.placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
                control={form.control as any}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('growingUnit.fields.type.label')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'growingUnit.fields.type.placeholder',
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="POT">
                          {t('growingUnit.type.POT')}
                        </SelectItem>
                        <SelectItem value="GARDEN_BED">
                          {t('growingUnit.type.GARDEN_BED')}
                        </SelectItem>
                        <SelectItem value="HANGING_BASKET">
                          {t('growingUnit.type.HANGING_BASKET')}
                        </SelectItem>
                        <SelectItem value="WINDOW_BOX">
                          {t('growingUnit.type.WINDOW_BOX')}
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('growingUnit.fields.capacity.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder={t(
                          'growingUnit.fields.capacity.placeholder',
                        )}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
                control={form.control as any}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('growingUnit.fields.length.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t('growingUnit.fields.length.placeholder')}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
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
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('growingUnit.fields.width.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t('growingUnit.fields.width.placeholder')}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
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
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('growingUnit.fields.height.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t('growingUnit.fields.height.placeholder')}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('growingUnit.fields.unit.label')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'growingUnit.fields.unit.placeholder',
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MILLIMETER">
                          {t('growingUnit.unit.MILLIMETER')}
                        </SelectItem>
                        <SelectItem value="CENTIMETER">
                          {t('growingUnit.unit.CENTIMETER')}
                        </SelectItem>
                        <SelectItem value="METER">
                          {t('growingUnit.unit.METER')}
                        </SelectItem>
                        <SelectItem value="INCH">
                          {t('growingUnit.unit.INCH')}
                        </SelectItem>
                        <SelectItem value="FOOT">
                          {t('growingUnit.unit.FOOT')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  ? t('growingUnit.actions.update.loading')
                  : t('growingUnit.actions.update.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
