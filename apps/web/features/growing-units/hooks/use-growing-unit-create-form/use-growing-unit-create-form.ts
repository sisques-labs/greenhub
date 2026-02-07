'use client';

import {
	createGrowingUnitCreateSchema,
	type GrowingUnitCreateFormValues,
} from '@/features/growing-units/schemas/growing-unit-create/growing-unit-create.schema';
import { useLocationsList } from '@/features/locations/hooks/use-locations-list/use-locations-list';
import { useMemo, useState } from 'react';

interface UseGrowingUnitCreateFormProps {
	onSubmit: (values: GrowingUnitCreateFormValues) => Promise<void>;
	error: Error | null;
	onOpenChange: (open: boolean) => void;
	translations: (key: string) => string;
}

interface UseGrowingUnitCreateFormReturn {
	// Form state
	locationId: string;
	setLocationId: (value: string) => void;
	name: string;
	setName: (value: string) => void;
	type: GrowingUnitCreateFormValues['type'];
	setType: (value: GrowingUnitCreateFormValues['type']) => void;
	capacity: number;
	setCapacity: (value: number) => void;
	length: number | undefined;
	setLength: (value: number | undefined) => void;
	width: number | undefined;
	setWidth: (value: number | undefined) => void;
	height: number | undefined;
	setHeight: (value: number | undefined) => void;
	unit: GrowingUnitCreateFormValues['unit'];
	setUnit: (value: GrowingUnitCreateFormValues['unit']) => void;
	formErrors: Record<string, { message?: string }>;

	// Locations data
	locations: ReturnType<typeof useLocationsList>['locations'];
	isLoadingLocations: boolean;

	// Handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

export function useGrowingUnitCreateForm({
	onSubmit,
	error,
	onOpenChange,
	translations,
}: UseGrowingUnitCreateFormProps): UseGrowingUnitCreateFormReturn {
	// Integrate useLocationsList
	const { locations, isLoading: isLoadingLocations } = useLocationsList();

	// Create schema with translations
	const createSchema = useMemo(
		() => createGrowingUnitCreateSchema(translations),
		[translations],
	);

	// Form state - 9 useState calls
	const [locationId, setLocationId] = useState<string>('');
	const [name, setName] = useState('');
	const [type, setType] = useState<GrowingUnitCreateFormValues['type']>('POT');
	const [capacity, setCapacity] = useState(1);
	const [length, setLength] = useState<number | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [height, setHeight] = useState<number | undefined>(undefined);
	const [unit, setUnit] =
		useState<GrowingUnitCreateFormValues['unit']>('CENTIMETER');
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = createSchema.safeParse({
			locationId,
			name,
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
			// Reset form
			setLocationId('');
			setName('');
			setType('POT');
			setCapacity(1);
			setLength(undefined);
			setWidth(undefined);
			setHeight(undefined);
			setUnit('CENTIMETER');
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			setLocationId('');
			setName('');
			setType('POT');
			setCapacity(1);
			setLength(undefined);
			setWidth(undefined);
			setHeight(undefined);
			setUnit('CENTIMETER');
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return {
		// Form state
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
	};
}
