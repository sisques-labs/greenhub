'use client';

import type { GrowingUnitResponse, PlantResponse } from '@repo/sdk';
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
import { z } from 'zod';

const createPlantTransplantSchema = (translations: (key: string) => string) =>
	z.object({
		targetGrowingUnitId: z.string().min(1, {
			message: translations('pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.required'),
		}),
	});

export type PlantTransplantFormValues = z.infer<
	ReturnType<typeof createPlantTransplantSchema>
>;

interface PlantTransplantModalProps {
	plant: PlantResponse;
	sourceGrowingUnit: GrowingUnitResponse | null;
	targetGrowingUnits: GrowingUnitResponse[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (targetGrowingUnitId: string) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function PlantTransplantModal({
	plant,
	sourceGrowingUnit,
	targetGrowingUnits,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: PlantTransplantModalProps) {
	const t = useTranslations();

	// Create schema with translations
	const transplantSchema = useMemo(
		() => createPlantTransplantSchema((key: string) => t(key)),
		[t],
	);

	// Form - initialized with empty values
	const form = useForm<PlantTransplantFormValues>({
		resolver: zodResolver(transplantSchema),
		defaultValues: {
			targetGrowingUnitId: '',
		},
	});

	const handleSubmit = async (values: PlantTransplantFormValues) => {
		await onSubmit(values.targetGrowingUnitId);
		if (!error) {
			form.reset({
				targetGrowingUnitId: '',
			});
			onOpenChange(false);
		}
	};

	// Filter out the source growing unit from target options
	const availableTargetGrowingUnits = useMemo(() => {
		if (!sourceGrowingUnit) return targetGrowingUnits;
		return targetGrowingUnits.filter(
			(gu) => gu.id !== sourceGrowingUnit.id,
		);
	}, [targetGrowingUnits, sourceGrowingUnit]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
			<DialogHeader>
				<DialogTitle>{t('pages.plants.detail.modals.transplant.title')}</DialogTitle>
				<DialogDescription>
					{t('pages.plants.detail.modals.transplant.description')}
				</DialogDescription>
			</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					{/* Source Growing Unit (read-only) */}
					<FormItem>
						<FormLabel>{t('pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.label')}</FormLabel>
						<Input
							value={sourceGrowingUnit?.name || t('pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.unknown')}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							{t('pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.helper')}
						</p>
					</FormItem>

					{/* Target Growing Unit (select) */}
					<FormField
						// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
						control={form.control as any}
						name="targetGrowingUnitId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t('pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.label')}
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													'pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.placeholder',
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{availableTargetGrowingUnits.map((growingUnit) => (
											<SelectItem key={growingUnit.id} value={growingUnit.id}>
												{growingUnit.name} ({growingUnit.remainingCapacity}/{growingUnit.capacity} {t('pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.capacityAvailable')})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									? t('pages.plants.detail.modals.transplant.actions.submit.loading')
									: t('pages.plants.detail.modals.transplant.actions.submit.label')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

