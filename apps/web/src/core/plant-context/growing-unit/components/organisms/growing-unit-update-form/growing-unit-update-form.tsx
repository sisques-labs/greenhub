'use client';

import { useLocationsList } from '@/core/location-context/location/hooks/use-locations-list/use-locations-list';
import {
	createGrowingUnitUpdateSchema,
	GrowingUnitUpdateFormValues,
} from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import type {
	GrowingUnitResponse,
	GrowingUnitType,
	LengthUnit,
} from '@repo/sdk';
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
import { useEffect, useMemo, useState } from 'react';

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
	const { locations, isLoading: isLoadingLocations } = useLocationsList();

	// Create schema with translations
	const updateSchema = useMemo(
		() => createGrowingUnitUpdateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [id, setId] = useState('');
	const [locationId, setLocationId] = useState<string>('');
	const [name, setName] = useState('');
	const [type, setType] = useState<GrowingUnitUpdateFormValues['type']>('POT');
	const [capacity, setCapacity] = useState<number | undefined>(undefined);
	const [length, setLength] = useState<number | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [height, setHeight] = useState<number | undefined>(undefined);
	const [unit, setUnit] =
		useState<GrowingUnitUpdateFormValues['unit']>(undefined);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Update form when growing unit changes
	useEffect(() => {
		if (growingUnit) {
			setId(growingUnit.id);
			setLocationId(growingUnit.location.id);
			setName(growingUnit.name);
			setType(growingUnit.type as GrowingUnitType);
			setCapacity(growingUnit.capacity);
			setLength(growingUnit.dimensions?.length);
			setWidth(growingUnit.dimensions?.width);
			setHeight(growingUnit.dimensions?.height);
			setUnit(growingUnit.dimensions?.unit as LengthUnit);
			setFormErrors({});
		}
	}, [growingUnit]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = updateSchema.safeParse({
			id,
			locationId: locationId || undefined,
			name: name || undefined,
			type,
			capacity,
			length,
			width,
			height,
			unit,
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
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	if (!growingUnit) return null;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t('pages.growingUnits.detail.actions.update.title')}
					</DialogTitle>
					<DialogDescription>
						{t('pages.growingUnits.detail.actions.update.description')}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormItem>
							<FormLabel>{t('shared.fields.locationId.label')}</FormLabel>
							<Select
								onValueChange={(value) => setLocationId(value)}
								value={locationId}
								disabled={isLoading || isLoadingLocations}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={t('shared.fields.locationId.placeholder')}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{locations.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											{location.name} ({location.type})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage fieldName="locationId" />
						</FormItem>

						<FormItem>
							<FormLabel>{t('shared.fields.name.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										'pages.growingUnits.detail.fields.name.placeholder',
									)}
									disabled={isLoading}
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="name" />
						</FormItem>

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t('shared.fields.type.label')}</FormLabel>
								<Select
									onValueChange={(value) =>
										setType(value as GrowingUnitUpdateFormValues['type'])
									}
									value={type}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.type.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="POT">
											{t('shared.types.growingUnit.POT')}
										</SelectItem>
										<SelectItem value="GARDEN_BED">
											{t('shared.types.growingUnit.GARDEN_BED')}
										</SelectItem>
										<SelectItem value="HANGING_BASKET">
											{t('shared.types.growingUnit.HANGING_BASKET')}
										</SelectItem>
										<SelectItem value="WINDOW_BOX">
											{t('shared.types.growingUnit.WINDOW_BOX')}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="type" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.capacity.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										min="1"
										placeholder={t('shared.fields.capacity.placeholder')}
										disabled={isLoading}
										value={capacity || ''}
										onChange={(e) =>
											setCapacity(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="capacity" />
							</FormItem>
						</div>

						<div className="grid grid-cols-4 gap-4">
							<FormItem>
								<FormLabel>{t('shared.fields.length.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t('shared.fields.length.placeholder')}
										disabled={isLoading}
										value={length || ''}
										onChange={(e) =>
											setLength(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="length" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.width.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t('shared.fields.width.placeholder')}
										disabled={isLoading}
										value={width || ''}
										onChange={(e) =>
											setWidth(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="width" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.height.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t('shared.fields.height.placeholder')}
										disabled={isLoading}
										value={height || ''}
										onChange={(e) =>
											setHeight(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="height" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.unit.label')}</FormLabel>
								<Select
									onValueChange={(value) =>
										setUnit(value as GrowingUnitUpdateFormValues['unit'])
									}
									value={unit || ''}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.unit.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="MILLIMETER">
											{t('shared.units.length.MILLIMETER')}
										</SelectItem>
										<SelectItem value="CENTIMETER">
											{t('shared.units.length.CENTIMETER')}
										</SelectItem>
										<SelectItem value="METER">
											{t('shared.units.length.METER')}
										</SelectItem>
										<SelectItem value="INCH">
											{t('shared.units.length.INCH')}
										</SelectItem>
										<SelectItem value="FOOT">
											{t('shared.units.length.FOOT')}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="unit" />
							</FormItem>
						</div>

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
									? t('pages.growingUnits.detail.actions.update.loading')
									: t('pages.growingUnits.detail.actions.update.submit')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
