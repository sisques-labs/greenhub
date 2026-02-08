import type {
	LocationResponse,
	PlantResponse,
} from '@/features/plants/api/types';
import type { Criteria } from '@/shared/dtos/criteria.dto';
import type { PaginatedResult } from '@/shared/dtos/paginated-result.entity';

export type GrowingUnitType =
	| 'POT'
	| 'GARDEN_BED'
	| 'HANGING_BASKET'
	| 'WINDOW_BOX';

export type LengthUnit =
	| 'MILLIMETER'
	| 'CENTIMETER'
	| 'METER'
	| 'INCH'
	| 'FOOT';

// Growing Unit specific types

export interface GrowingUnitDimensions {
	length: number;
	width: number;
	height: number;
	unit: LengthUnit;
}

// Raw API response (dates as strings from GraphQL)
export interface GrowingUnitApiResponse {
	id: string;
	location: LocationResponse;
	name: string;
	type: string;
	capacity: number;
	dimensions?: GrowingUnitDimensions | null;
	plants: PlantResponse[];
	numberOfPlants: number;
	remainingCapacity: number;
	volume: number;
	createdAt: string;
	updatedAt: string;
}

// Transformed GrowingUnit with Date objects
export interface GrowingUnitResponse {
	id: string;
	location: LocationResponse;
	name: string;
	type: string;
	capacity: number;
	dimensions?: GrowingUnitDimensions | null;
	plants: PlantResponse[];
	numberOfPlants: number;
	remainingCapacity: number;
	volume: number;
	createdAt: Date;
	updatedAt: Date;
}

export type PaginatedGrowingUnitResult = PaginatedResult<GrowingUnitResponse>;

// Input types

export type GrowingUnitFindByCriteriaInput = Criteria;

export interface GrowingUnitFindByIdInput {
	id: string;
}

export interface CreateGrowingUnitInput {
	locationId: string;
	name: string;
	type: GrowingUnitType;
	capacity: number;
	length?: number;
	width?: number;
	height?: number;
	unit?: LengthUnit;
}

export interface UpdateGrowingUnitInput {
	id: string;
	locationId?: string;
	name?: string;
	type?: GrowingUnitType;
	capacity?: number;
	length?: number;
	width?: number;
	height?: number;
	unit?: LengthUnit;
}

export interface DeleteGrowingUnitInput {
	id: string;
}

// Helper to transform API response to GrowingUnitResponse
export function transformGrowingUnitResponse(
	apiResponse: GrowingUnitApiResponse,
): GrowingUnitResponse {
	return {
		...apiResponse,
		createdAt: new Date(apiResponse.createdAt),
		updatedAt: new Date(apiResponse.updatedAt),
	};
}
