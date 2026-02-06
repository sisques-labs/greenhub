'use client';

import { PLANT_STATUS } from '@/features/plants/constants/plant-status';
import { usePlantCreateForm } from '@/features/plants/hooks/use-plant-create-form/use-plant-create-form';
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
import { PlantCreateFormValues } from 'features/plants/schemas/plant-create/plant-create.schema';
import { useTranslations } from 'next-intl';

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

	const {
		selectedGrowingUnitId,
		name,
		species,
		plantedDate,
		notes,
		status,
		formErrors,
		setSelectedGrowingUnitId,
		setName,
		setSpecies,
		setPlantedDate,
		setNotes,
		setStatus,
		handleSubmit,
		handleOpenChange,
	} = usePlantCreateForm({
		initialGrowingUnitId,
		onSubmit,
		onOpenChange,
		error,
		translations: (key: string) => t(key),
	});

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
