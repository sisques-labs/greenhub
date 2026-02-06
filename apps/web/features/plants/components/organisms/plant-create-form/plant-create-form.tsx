'use client';

import { PLANT_STATUS } from '@/features/plants/constants/plant-status';
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
import { Textarea } from '@/shared/components/ui/textarea';
import {
	createPlantCreateSchema,
	PlantCreateFormValues,
} from 'features/plants/schemas/plant-create/plant-create.schema';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface PlantCreateFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: PlantCreateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
	growingUnitId?: string;
	growingUnits?: Array<{ id: string; name: string }>;
}

export function PlantCreateForm({
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
	growingUnitId: initialGrowingUnitId,
	growingUnits = [],
}: PlantCreateFormProps) {
	const t = useTranslations();

	// Create schema with translations
	const createSchema = useMemo(
		() => createPlantCreateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [selectedGrowingUnitId, setSelectedGrowingUnitId] = useState<string>(
		initialGrowingUnitId || '',
	);
	const [name, setName] = useState('');
	const [species, setSpecies] = useState('');
	const [plantedDate, setPlantedDate] = useState<Date>(new Date());
	const [notes, setNotes] = useState('');
	const [status, setStatus] = useState<PlantCreateFormValues['status']>(
		PLANT_STATUS.PLANTED,
	);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Use selected growing unit ID or the provided one
		const finalGrowingUnitId =
			selectedGrowingUnitId || initialGrowingUnitId || '';

		// Validate form
		const result = createSchema.safeParse({
			name,
			species,
			plantedDate,
			notes: notes || undefined,
			status,
			growingUnitId: finalGrowingUnitId,
		});

		if (!result.success) {
			const errors: Record<string, { message?: string }> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = { message: err.message };
				}
			});
			setFormErrors(errors);
			return;
		}

		setFormErrors({});
		await onSubmit(result.data);
		if (!error) {
			// Reset form
			setSelectedGrowingUnitId(initialGrowingUnitId || '');
			setName('');
			setSpecies('');
			setPlantedDate(new Date());
			setNotes('');
			setStatus(PLANT_STATUS.PLANTED);
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			setSelectedGrowingUnitId(initialGrowingUnitId || '');
			setName('');
			setSpecies('');
			setPlantedDate(new Date());
			setNotes('');
			setStatus(PLANT_STATUS.PLANTED);
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('plants.actions.create.title')}</DialogTitle>
					<DialogDescription>
						{t('plants.actions.create.description')}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						{!initialGrowingUnitId && growingUnits.length > 0 && (
							<FormItem>
								<FormLabel>{t('shared.fields.growingUnitId.label')}</FormLabel>
								<Select
									onValueChange={(value: string) =>
										setSelectedGrowingUnitId(value)
									}
									value={selectedGrowingUnitId}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													'pages.plants.detail.fields.growingUnitId.placeholder',
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{growingUnits.map((unit) => (
											<SelectItem key={unit.id} value={unit.id}>
												{unit.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="growingUnitId" />
							</FormItem>
						)}

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t('pages.plants.detail.fields.name.label')}
								</FormLabel>
								<FormControl>
									<Input
										placeholder={t(
											'pages.plants.detail.fields.name.placeholder',
										)}
										disabled={isLoading}
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="name" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.species.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('shared.fields.species.placeholder')}
										disabled={isLoading}
										value={species}
										onChange={(e) => setSpecies(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="species" />
							</FormItem>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t('plant.fields.plantedDate.label')}</FormLabel>
								<FormControl>
									<Input
										type="date"
										disabled={isLoading}
										value={
											plantedDate
												? new Date(plantedDate).toISOString().split('T')[0]
												: ''
										}
										onChange={(e) =>
											setPlantedDate(
												e.target.value ? new Date(e.target.value) : new Date(),
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="plantedDate" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.status.label')}</FormLabel>
								<Select
									onValueChange={(value: string) =>
										setStatus(value as PlantCreateFormValues['status'])
									}
									value={status}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.status.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={PLANT_STATUS.PLANTED}>
											{t('shared.status.plant.PLANTED')}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.GROWING}>
											{t('shared.status.plant.GROWING')}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.HARVESTED}>
											{t('shared.status.plant.HARVESTED')}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.DEAD}>
											{t('shared.status.plant.DEAD')}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.ARCHIVED}>
											{t('shared.status.plant.ARCHIVED')}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="status" />
							</FormItem>
						</div>

						<FormItem>
							<FormLabel>{t('shared.fields.notes.label')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('shared.fields.notes.placeholder')}
									disabled={isLoading}
									rows={4}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="notes" />
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
									? t('pages.plants.list.actions.create.loading')
									: t('pages.plants.list.actions.create.submit')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
