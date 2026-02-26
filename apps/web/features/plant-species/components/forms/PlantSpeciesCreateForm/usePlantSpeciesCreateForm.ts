'use client';

import {
	createPlantSpeciesCreateSchema,
	type PlantSpeciesCreateFormValues,
} from '@/features/plant-species/schemas/plant-species-create.schema';
import { useMemo, useState } from 'react';

interface UsePlantSpeciesCreateFormProps {
	onSubmit: (values: PlantSpeciesCreateFormValues) => Promise<void>;
	onOpenChange: (open: boolean) => void;
	error: Error | null;
	translations: (key: string) => string;
}

interface UsePlantSpeciesCreateFormReturn {
	// Form state
	commonName: string;
	scientificName: string;
	family: string | null;
	description: string | null;
	category: string;
	difficulty: string;
	growthRate: string;
	lightRequirements: string;
	waterRequirements: string;
	humidityRequirements: string | null;
	soilType: string | null;
	temperatureMin: string;
	temperatureMax: string;
	phMin: string;
	phMax: string;
	matureSizeHeight: string;
	matureSizeWidth: string;
	growthTime: string;
	tags: string[];
	tagInput: string;
	formErrors: Record<string, { message?: string }>;

	// State setters
	setCommonName: (value: string) => void;
	setScientificName: (value: string) => void;
	setFamily: (value: string | null) => void;
	setDescription: (value: string | null) => void;
	setCategory: (value: string) => void;
	setDifficulty: (value: string) => void;
	setGrowthRate: (value: string) => void;
	setLightRequirements: (value: string) => void;
	setWaterRequirements: (value: string) => void;
	setHumidityRequirements: (value: string | null) => void;
	setSoilType: (value: string | null) => void;
	setTemperatureMin: (value: string) => void;
	setTemperatureMax: (value: string) => void;
	setPhMin: (value: string) => void;
	setPhMax: (value: string) => void;
	setMatureSizeHeight: (value: string) => void;
	setMatureSizeWidth: (value: string) => void;
	setGrowthTime: (value: string) => void;
	setTagInput: (value: string) => void;
	addTag: () => void;
	removeTag: (tag: string) => void;

	// Event handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

export function usePlantSpeciesCreateForm({
	onSubmit,
	onOpenChange,
	error,
	translations,
}: UsePlantSpeciesCreateFormProps): UsePlantSpeciesCreateFormReturn {
	const createSchema = useMemo(
		() => createPlantSpeciesCreateSchema(translations),
		[translations],
	);

	const [commonName, setCommonName] = useState('');
	const [scientificName, setScientificName] = useState('');
	const [family, setFamily] = useState<string | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [category, setCategory] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [growthRate, setGrowthRate] = useState('');
	const [lightRequirements, setLightRequirements] = useState('');
	const [waterRequirements, setWaterRequirements] = useState('');
	const [humidityRequirements, setHumidityRequirements] = useState<string | null>(null);
	const [soilType, setSoilType] = useState<string | null>(null);
	const [temperatureMin, setTemperatureMin] = useState('');
	const [temperatureMax, setTemperatureMax] = useState('');
	const [phMin, setPhMin] = useState('');
	const [phMax, setPhMax] = useState('');
	const [matureSizeHeight, setMatureSizeHeight] = useState('');
	const [matureSizeWidth, setMatureSizeWidth] = useState('');
	const [growthTime, setGrowthTime] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [formErrors, setFormErrors] = useState<Record<string, { message?: string }>>({});

	const resetForm = () => {
		setCommonName('');
		setScientificName('');
		setFamily(null);
		setDescription(null);
		setCategory('');
		setDifficulty('');
		setGrowthRate('');
		setLightRequirements('');
		setWaterRequirements('');
		setHumidityRequirements(null);
		setSoilType(null);
		setTemperatureMin('');
		setTemperatureMax('');
		setPhMin('');
		setPhMax('');
		setMatureSizeHeight('');
		setMatureSizeWidth('');
		setGrowthTime('');
		setTags([]);
		setTagInput('');
		setFormErrors({});
	};

	const addTag = () => {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) {
			setTags([...tags, trimmed]);
			setTagInput('');
		}
	};

	const removeTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag));
	};

	const buildFormData = () => {
		const data: Record<string, unknown> = {
			commonName,
			scientificName,
			category,
			difficulty,
			growthRate,
			lightRequirements,
			waterRequirements,
		};

		if (family) data.family = family;
		if (description) data.description = description;
		if (humidityRequirements) data.humidityRequirements = humidityRequirements;
		if (soilType) data.soilType = soilType;
		if (tags.length > 0) data.tags = tags;
		if (growthTime) data.growthTime = parseFloat(growthTime);

		if (temperatureMin && temperatureMax) {
			data.temperatureRange = {
				min: parseFloat(temperatureMin),
				max: parseFloat(temperatureMax),
			};
		}

		if (phMin && phMax) {
			data.phRange = {
				min: parseFloat(phMin),
				max: parseFloat(phMax),
			};
		}

		if (matureSizeHeight && matureSizeWidth) {
			data.matureSize = {
				height: parseFloat(matureSizeHeight),
				width: parseFloat(matureSizeWidth),
			};
		}

		return data;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = buildFormData();
		const result = createSchema.safeParse(data);

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
			resetForm();
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			resetForm();
		}
		onOpenChange(newOpen);
	};

	return {
		commonName,
		scientificName,
		family,
		description,
		category,
		difficulty,
		growthRate,
		lightRequirements,
		waterRequirements,
		humidityRequirements,
		soilType,
		temperatureMin,
		temperatureMax,
		phMin,
		phMax,
		matureSizeHeight,
		matureSizeWidth,
		growthTime,
		tags,
		tagInput,
		formErrors,
		setCommonName,
		setScientificName,
		setFamily,
		setDescription,
		setCategory,
		setDifficulty,
		setGrowthRate,
		setLightRequirements,
		setWaterRequirements,
		setHumidityRequirements,
		setSoilType,
		setTemperatureMin,
		setTemperatureMax,
		setPhMin,
		setPhMax,
		setMatureSizeHeight,
		setMatureSizeWidth,
		setGrowthTime,
		setTagInput,
		addTag,
		removeTag,
		handleSubmit,
		handleOpenChange,
	};
}
