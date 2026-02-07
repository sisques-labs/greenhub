'use client';

import { Button } from '@/shared/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import type { GrowingUnitResponse } from 'features/growing-units/api/types';
import { usePlantTransplantForm } from 'features/plants/hooks/use-plant-transplant-form/use-plant-transplant-form';
import { useTranslations } from 'next-intl';
import type {
	PlantGrowingUnitReference,
	PlantResponse,
} from '../../../api/types';

interface PlantTransplantModalProps {
	plant: PlantResponse;
	sourceGrowingUnit: PlantGrowingUnitReference | null;
	targetGrowingUnits: GrowingUnitResponse[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (targetGrowingUnitId: string) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function PlantTransplantModal({
	sourceGrowingUnit,
	targetGrowingUnits,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: PlantTransplantModalProps) {
	const t = useTranslations();

	const {
		targetGrowingUnitId,
		formErrors,
		availableTargetGrowingUnits,
		setTargetGrowingUnitId,
		handleSubmit,
		handleOpenChange,
	} = usePlantTransplantForm({
		sourceGrowingUnit,
		targetGrowingUnits,
		onSubmit,
		onOpenChange,
		error,
		translations: (key: string) => t(key),
	});

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('pages.plants.detail.modals.transplant.title')}
					</DialogTitle>
					<DialogDescription>
						{t('pages.plants.detail.modals.transplant.description')}
					</DialogDescription>
				</DialogHeader>

				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Source Growing Unit (read-only) */}
						<FormItem>
							<FormLabel>
								{t(
									'pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.label',
								)}
							</FormLabel>
							<Input
								value={
									sourceGrowingUnit?.name ||
									t(
										'pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.unknown',
									)
								}
								disabled
								className="bg-muted"
							/>
							<p className="text-xs text-muted-foreground">
								{t(
									'pages.plants.detail.modals.transplant.fields.sourceGrowingUnit.helper',
								)}
							</p>
						</FormItem>

						{/* Target Growing Unit (select) */}
						<FormItem>
							<FormLabel>
								{t(
									'pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.label',
								)}
							</FormLabel>
							<Select
								onValueChange={setTargetGrowingUnitId}
								value={targetGrowingUnitId}
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
											{growingUnit.name} ({growingUnit.remainingCapacity}/
											{growingUnit.capacity}{' '}
											{t(
												'pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.capacityAvailable',
											)}
											)
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage fieldName="targetGrowingUnitId" />
						</FormItem>

						{error && (
							<div className="text-sm text-destructive">{error.message}</div>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isLoading}
							>
								{t('common.cancel')}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? t(
											'pages.plants.detail.modals.transplant.actions.submit.loading',
										)
									: t(
											'pages.plants.detail.modals.transplant.actions.submit.label',
										)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
