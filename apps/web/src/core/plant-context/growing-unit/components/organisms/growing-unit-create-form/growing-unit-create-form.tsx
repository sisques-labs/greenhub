'use client';

import {
  createGrowingUnitCreateSchema,
  GrowingUnitCreateFormValues,
} from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-create/growing-unit-create.schema';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface GrowingUnitCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GrowingUnitCreateFormValues) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function GrowingUnitCreateForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
}: GrowingUnitCreateFormProps) {
  const t = useTranslations();

  // Create schema with translations
  const createSchema = useMemo(
    () => createGrowingUnitCreateSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with empty values
  const form = useForm<GrowingUnitCreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      type: 'POT',
      capacity: 1,
      length: undefined,
      width: undefined,
      height: undefined,
      unit: 'CENTIMETER',
    },
  });

  const handleSubmit = async (values: GrowingUnitCreateFormValues) => {
    await onSubmit(values);
    if (!error) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('growingUnit.actions.create.title')}</DialogTitle>
          <DialogDescription>
            {t('growingUnit.actions.create.description')}
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
                      defaultValue={field.value}
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
                      defaultValue={field.value}
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
                  ? t('growingUnit.actions.create.loading')
                  : t('growingUnit.actions.create.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
