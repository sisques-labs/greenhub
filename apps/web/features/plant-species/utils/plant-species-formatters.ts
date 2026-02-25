import {
	PlantSpeciesMatureSize,
	PlantSpeciesNumericRange,
} from '@/features/plant-species/api/types/plant-species.types';

export function formatTemperatureRange(
	range?: PlantSpeciesNumericRange,
): string {
	if (!range) return 'N/A';
	return `${range.min}°C - ${range.max}°C`;
}

export function formatPhRange(range?: PlantSpeciesNumericRange): string {
	if (!range) return 'N/A';
	return `${range.min} - ${range.max}`;
}

export function formatGrowthTime(days?: number): string {
	if (!days) return 'N/A';
	if (days < 30) return `${days} days`;
	const months = Math.floor(days / 30);
	const remainingDays = days % 30;
	if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
	return `${months}m ${remainingDays}d`;
}

export function formatMatureSize(size?: PlantSpeciesMatureSize): string {
	if (!size) return 'N/A';
	return `H: ${size.height}cm × W: ${size.width}cm`;
}
