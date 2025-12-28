'use client';

import { ContainerCreateForm } from '@/core/plant-context/containers/presentation/components/organisms/container-create-form/container-create-form';
import {
  createPlantCreateSchema,
  PlantCreateFormValues,
} from '@/core/plant-context/plants/presentation/dtos/schemas/plant-create/plant-create.schema';
import { usePlantCreate } from '@/core/plant-context/plants/presentation/hooks/use-plant-create/use-plant-create';
import { zodResolver } from '@hookform/resolvers/zod';
import { PLANT_STATUS, type ContainerResponse } from '@repo/sdk';
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
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface PlantCreateFormProps {
  containers: ContainerResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  preselectedContainerId?: string;
  onContainerCreated?: () => void;
}

export function PlantCreateForm({
  containers,
  open,
  onOpenChange,
  onSuccess,
  preselectedContainerId,
  onContainerCreated,
}: PlantCreateFormProps) {
  const t = useTranslations();
  const [showContainerForm, setShowContainerForm] = useState(false);
  const { handleCreate: handlePlantCreate, isLoading: isCreatingPlant } =
    usePlantCreate();

  // Create schema with translations
  const createSchema = useMemo(
    () => createPlantCreateSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with default values or preselected container
  const form = useForm<PlantCreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      containerId: preselectedContainerId || '',
      name: '',
      species: '',
      plantedDate: null,
      notes: null,
      status: PLANT_STATUS.PLANTED,
    },
  });

  // Update form when preselectedContainerId changes or dialog opens
  React.useEffect(() => {
    if (open && preselectedContainerId) {
      form.setValue('containerId', preselectedContainerId);
    } else if (open && !preselectedContainerId) {
      form.setValue('containerId', '');
    }
  }, [open, preselectedContainerId, form]);

  const onSubmit = async (values: PlantCreateFormValues) => {
    try {
      await handlePlantCreate(values, () => {
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      });
    } catch (_error) {
      // Error is handled by the hook
    }
  };

  const handleContainerCreated = async (containerId: string) => {
    // Set the newly created container as selected
    form.setValue('containerId', containerId);
    setShowContainerForm(false);
    // Trigger validation to show the selected container
    await form.trigger('containerId');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('plants.actions.create.title')}</DialogTitle>
            <DialogDescription>
              {t('plants.actions.create.description')}
            </DialogDescription>
          </DialogHeader>

          {/* biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control */}
          <Form {...(form as any)}>
            {/* biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="containerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('plants.fields.containerId.label')}
                    </FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCreatingPlant}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'plants.fields.containerId.placeholder',
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {containers.map((container) => (
                            <SelectItem key={container.id} value={container.id}>
                              {container.name} ({container.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContainerForm(true)}
                        disabled={isCreatingPlant}
                      >
                        {t('plants.actions.createContainer')}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plants.fields.name.label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('plants.fields.name.placeholder')}
                        disabled={isCreatingPlant}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plants.fields.species.label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('plants.fields.species.placeholder')}
                        disabled={isCreatingPlant}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="plantedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('plants.fields.plantedDate.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isCreatingPlant}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => {
                          field.onChange(
                            e.target.value ? e.target.value : null,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plants.fields.notes.label')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('plants.fields.notes.placeholder')}
                        disabled={isCreatingPlant}
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value || null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                control={form.control as any}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plants.fields.status.label')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isCreatingPlant}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('plants.fields.status.placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLANTED">
                          {t('plants.status.PLANTED')}
                        </SelectItem>
                        <SelectItem value="GROWING">
                          {t('plants.status.GROWING')}
                        </SelectItem>
                        <SelectItem value="HARVESTED">
                          {t('plants.status.HARVESTED')}
                        </SelectItem>
                        <SelectItem value="DEAD">
                          {t('plants.status.DEAD')}
                        </SelectItem>
                        <SelectItem value="ARCHIVED">
                          {t('plants.status.ARCHIVED')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isCreatingPlant}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isCreatingPlant}>
                  {isCreatingPlant
                    ? t('common.loading')
                    : t('plants.actions.create.submit')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ContainerCreateForm
        open={showContainerForm}
        onOpenChange={setShowContainerForm}
        onSuccess={(containerId) => {
          handleContainerCreated(containerId);
          // Refresh containers list so the new one appears in the selector
          onContainerCreated?.();
        }}
      />
    </>
  );
}
