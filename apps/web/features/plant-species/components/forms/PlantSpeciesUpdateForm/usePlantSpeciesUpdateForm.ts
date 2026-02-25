'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import {
	createPlantSpeciesUpdateSchema,
	type PlantSpeciesUpdateFormValues,
} from '@/features/plant-species/schemas/plant-species-update.schema';
import { useEffect, useMemo, useState } from 'react';

interface UsePlantSpeciesUpdateFormProps {
	plantSpecies: PlantSpeciesResponse | null;
	onSubmit: (values: PlantSpeciesUpdateFormValues) => Promise<void>;
	onOpenChange: (open: boolean) => void;
	error: Error | null;
	translations: (key: string) => string;
}

interface UsePlantSpeciesUpdateFormReturn {
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

export function usePlantSpeciesUpdateForm({
	plantSpecies,
	onSubmit,
	onOpenChange,
	error,
	translations,
}: UsePlantSpeciesUpdateFormProps): UsePlantSpeciesUpdateFormReturn {
	const updateSchema = useMemo(
		() => createPlantSpeciesUpdateSchema(translations),
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

	useEffect(() => {
		if (plantSpecies) {
			setCommonName(plantSpecies.commonName);
			setScientificName(plantSpecies.scientificName);
			setFamily(plantSpecies.family || null);
			setDescription(plantSpecies.description || null);
			setCategory(plantSpecies.category);
			setDifficulty(plantSpecies.difficulty);
			setGrowthRate(plantSpecies.growthRate);
			setLightRequirements(plantSpecies.lightRequirements);
			setWaterRequirements(plantSpecies.waterRequirements);
			setHumidityRequirements(plantSpecies.humidityRequirements || null);
			setSoilType(plantSpecies.soilType || null);
			setTemperatureMin(plantSpecies.temperatureRange?.min?.toString() ?? '');
			setTemperatureMax(plantSpecies.temperatureRange?.max?.toString() ?? '');
			setPhMin(plantSpecies.phRange?.min?.toString() ?? '');
			setPhMax(plantSpecies.phRange?.max?.toString() ?? '');
			setMatureSizeHeight(plantSpecies.matureSize?.height?.toString() ?? '');
			setMatureSizeWidth(plantSpecies.matureSize?.width?.toString() ?? '');
			setGrowthTime(plantSpecies.growthTime?.toString() ?? '');
			setTags(plantSpecies.tags ?? []);
			setFormErrors({});
		}
	}, [plantSpecies]);

	const syncFromPlantSpecies = () => {
		if (plantSpecies) {
			setCommonName(plantSpecies.commonName);
			setScientificName(plantSpecies.scientificName);
			setFamily(plantSpecies.family || null);
			setDescription(plantSpecies.description || null);
			setCategory(plantSpecies.category);
			setDifficulty(plantSpecies.difficulty);
			setGrowthRate(plantSpecies.growthRate);
			setLightRequirements(plantSpecies.lightRequirements);
			setWaterRequirements(plantSpecies.waterRequirements);
			setHumidityRequirements(plantSpecies.humidityRequirements || null);
			setSoilType(plantSpecies.soilType || null);
			setTemperatureMin(plantSpecies.temperatureRange?.min?.toString() ?? '');
			setTemperatureMax(plantSpecies.temperatureRange?.max?.toString() ?? '');
			setPhMin(plantSpecies.phRange?.min?.toString() ?? '');
			setPhMax(plantSpecies.phRange?.max?.toString() ?? '');
			setMatureSizeHeight(plantSpecies.matureSize?.height?.toString() ?? '');
			setMatureSizeWidth(plantSpecies.matureSize?.width?.toString() ?? '');
			setGrowthTime(plantSpecies.growthTime?.toString() ?? '');
			setTags(plantSpecies.tags ?? []);
		}
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
			family: family || null,
			description: description || null,
			category,
			difficulty,
			growthRate,
			lightRequirements,
			waterRequirements,
			humidityRequirements: humidityRequirements || null,
			soilType: soilType || null,
			tags: tags.length > 0 ? tags : null,
		};

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

		if (!plantSpecies) return;

		const data = buildFormData();
		const result = updateSchema.safeParse(data);

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
			syncFromPlantSpecies();
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
