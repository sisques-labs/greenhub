'use client';

import type { GrowingUnitResponse } from '@/features/growing-units/api/types';
import {
	createGrowingUnitUpdateSchema,
	GrowingUnitUpdateFormValues,
} from '@/features/growing-units/schemas/growing-unit-update/growing-unit-update.schema';
import { useLocationsList } from '@/features/locations/hooks/use-locations-list/use-locations-list';
import { useEffect, useMemo, useState } from 'react';
import type { LengthUnit } from '@/shared/constants/length-unit';
import type { GrowingUnitType } from '@/features/growing-units/constants/growing-unit-type';

interface UseGrowingUnitUpdateFormProps {
	growingUnit: GrowingUnitResponse | null;
	onSubmit: (values: GrowingUnitUpdateFormValues) => Promise<void>;
	error: Error | null;
	onOpenChange: (open: boolean) => void;
	translations: (key: string) => string;
}

interface UseGrowingUnitUpdateFormReturn {
	// Form state
	id: string;
	setId: (value: string) => void;
	locationId: string;
	setLocationId: (value: string) => void;
	name: string;
	setName: (value: string) => void;
	type: GrowingUnitUpdateFormValues['type'];
	setType: (value: GrowingUnitUpdateFormValues['type']) => void;
	capacity: number | undefined;
	setCapacity: (value: number | undefined) => void;
	length: number | undefined;
	setLength: (value: number | undefined) => void;
	width: number | undefined;
	setWidth: (value: number | undefined) => void;
	height: number | undefined;
	setHeight: (value: number | undefined) => void;
	unit: GrowingUnitUpdateFormValues['unit'];
	setUnit: (value: GrowingUnitUpdateFormValues['unit']) => void;
	formErrors: Record<string, { message?: string }>;

	// Locations data
	locations: ReturnType<typeof useLocationsList>['locations'];
	isLoadingLocations: boolean;

	// Handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;

	// Schema
	updateSchema: ReturnType<typeof createGrowingUnitUpdateSchema>;
}

export function useGrowingUnitUpdateForm({
	growingUnit,
	onSubmit,
	error,
	onOpenChange,
	translations,
}: UseGrowingUnitUpdateFormProps): UseGrowingUnitUpdateFormReturn {
	// Integrate locations list
	const { locations, isLoading: isLoadingLocations } = useLocationsList();

	// Create schema with translations
	const updateSchema = useMemo(
		() => createGrowingUnitUpdateSchema(translations),
		[translations],
	);

	// Form state - initialize with empty/default values
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

	// Update form when growing unit changes (synchronization logic)
	useEffect(() => {
		if (growingUnit) {
			setId(growingUnit.id);
			setLocationId(growingUnit.location.id);
			setName(growingUnit.name);
			setType(growingUnit.type as GrowingUnitType);
			setCapacity(growingUnit.capacity);
			// Dimension conversion logic
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

	return {
		// Form state
		id,
		setId,
		locationId,
		setLocationId,
		name,
		setName,
		type,
		setType,
		capacity,
		setCapacity,
		length,
		setLength,
		width,
		setWidth,
		height,
		setHeight,
		unit,
		setUnit,
		formErrors,

		// Locations data
		locations,
		isLoadingLocations,

		// Handlers
		handleSubmit,
		handleOpenChange,

		// Schema
		updateSchema,
	};
}
