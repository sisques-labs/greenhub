'use client';

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
import {
  createContainerCreateSchema,
  ContainerCreateFormValues,
} from '@/core/plant-context/containers/presentation/dtos/schemas/container-create/container-create.schema';
import { useContainerCreate } from '@/core/plant-context/containers/presentation/hooks/use-container-create/use-container-create';

interface ContainerCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (containerId: string) => void;
}

export function ContainerCreateForm({
  open,
  onOpenChange,
  onSuccess,
}: ContainerCreateFormProps) {
  const t = useTranslations();
  const { handleCreate, isLoading } = useContainerCreate();

  // Create schema with translations
  const createSchema = useMemo(
    () => createContainerCreateSchema((key: string) => t(key)),
    [t],
  );

  // Form - initialized with default values
  const form = useForm<ContainerCreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      type: 'POT',
    },
  });

  const onSubmit = async (values: ContainerCreateFormValues) => {
    try {
      await handleCreate(
        values,
        (containerId) => {
          form.reset();
          onOpenChange(false);
          onSuccess?.(containerId);
        },
        (error) => {
          // Error is handled by the hook
          console.error('Container create error:', error);
        },
      );
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('containers.actions.create.title')}</DialogTitle>
          <DialogDescription>
            {t('containers.actions.create.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('containers.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('containers.fields.name.placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('containers.fields.type.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('containers.fields.type.placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="POT">
                        {t('containers.type.POT')}
                      </SelectItem>
                      <SelectItem value="GARDEN_BED">
                        {t('containers.type.GARDEN_BED')}
                      </SelectItem>
                      <SelectItem value="HANGING_BASKET">
                        {t('containers.type.HANGING_BASKET')}
                      </SelectItem>
                      <SelectItem value="WINDOW_BOX">
                        {t('containers.type.WINDOW_BOX')}
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
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('common.loading')
                  : t('containers.actions.create.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
