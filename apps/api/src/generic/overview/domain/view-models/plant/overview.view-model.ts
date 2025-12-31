import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents an overview view model for the presentation layer.
 *
 * @remarks
 * This class provides a structured, immutable interface for overview statistics and metrics
 * from the plant context (core). It exposes aggregated data as read-only fields and provides
 * a method to update the model instance with new data.
 *
 * @example
 * ```typescript
 * const model = new OverviewViewModel({
 *   id: 'overview-1',
 *   totalPlants: 150,
 *   totalGrowingUnits: 25,
 *   averagePlantsPerGrowingUnit: 6,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class OverviewViewModel extends BaseViewModel {
	// Plants metrics
	private _totalPlants: number;
	private _totalActivePlants: number;
	private _averagePlantsPerGrowingUnit: number;

	// Plants by status
	private _plantsPlanted: number;
	private _plantsGrowing: number;
	private _plantsHarvested: number;
	private _plantsDead: number;
	private _plantsArchived: number;

	// Additional plant metrics
	private _plantsWithoutPlantedDate: number;
	private _plantsWithNotes: number;
	private _recentPlants: number;

	// Growing units metrics
	private _totalGrowingUnits: number;
	private _activeGrowingUnits: number;
	private _emptyGrowingUnits: number;

	// Growing units by type
	private _growingUnitsPot: number;
	private _growingUnitsGardenBed: number;
	private _growingUnitsHangingBasket: number;
	private _growingUnitsWindowBox: number;

	// Capacity metrics
	private _totalCapacity: number;
	private _totalCapacityUsed: number;
	private _averageOccupancy: number;
	private _growingUnitsAtLimit: number;
	private _growingUnitsFull: number;
	private _totalRemainingCapacity: number;

	// Dimensions metrics
	private _growingUnitsWithDimensions: number;
	private _totalVolume: number;
	private _averageVolume: number;

	// Aggregated metrics
	private _minPlantsPerGrowingUnit: number;
	private _maxPlantsPerGrowingUnit: number;
	private _medianPlantsPerGrowingUnit: number;

	/**
	 * Creates a new OverviewViewModel instance.
	 *
	 * @param props - The overview view model data used for initialization
	 */
	constructor(props: IOverviewViewModelDto) {
		super(props);

		// Plants metrics
		this._totalPlants = props.totalPlants;
		this._totalActivePlants = props.totalActivePlants;
		this._averagePlantsPerGrowingUnit = props.averagePlantsPerGrowingUnit;

		// Plants by status
		this._plantsPlanted = props.plantsPlanted;
		this._plantsGrowing = props.plantsGrowing;
		this._plantsHarvested = props.plantsHarvested;
		this._plantsDead = props.plantsDead;
		this._plantsArchived = props.plantsArchived;

		// Additional plant metrics
		this._plantsWithoutPlantedDate = props.plantsWithoutPlantedDate;
		this._plantsWithNotes = props.plantsWithNotes;
		this._recentPlants = props.recentPlants;

		// Growing units metrics
		this._totalGrowingUnits = props.totalGrowingUnits;
		this._activeGrowingUnits = props.activeGrowingUnits;
		this._emptyGrowingUnits = props.emptyGrowingUnits;

		// Growing units by type
		this._growingUnitsPot = props.growingUnitsPot;
		this._growingUnitsGardenBed = props.growingUnitsGardenBed;
		this._growingUnitsHangingBasket = props.growingUnitsHangingBasket;
		this._growingUnitsWindowBox = props.growingUnitsWindowBox;

		// Capacity metrics
		this._totalCapacity = props.totalCapacity;
		this._totalCapacityUsed = props.totalCapacityUsed;
		this._averageOccupancy = props.averageOccupancy;
		this._growingUnitsAtLimit = props.growingUnitsAtLimit;
		this._growingUnitsFull = props.growingUnitsFull;
		this._totalRemainingCapacity = props.totalRemainingCapacity;

		// Dimensions metrics
		this._growingUnitsWithDimensions = props.growingUnitsWithDimensions;
		this._totalVolume = props.totalVolume;
		this._averageVolume = props.averageVolume;

		// Aggregated metrics
		this._minPlantsPerGrowingUnit = props.minPlantsPerGrowingUnit;
		this._maxPlantsPerGrowingUnit = props.maxPlantsPerGrowingUnit;
		this._medianPlantsPerGrowingUnit = props.medianPlantsPerGrowingUnit;
	}

	// Plants metrics getters
	public get totalPlants(): number {
		return this._totalPlants;
	}

	public get totalActivePlants(): number {
		return this._totalActivePlants;
	}

	public get averagePlantsPerGrowingUnit(): number {
		return this._averagePlantsPerGrowingUnit;
	}

	// Plants by status getters
	public get plantsPlanted(): number {
		return this._plantsPlanted;
	}

	public get plantsGrowing(): number {
		return this._plantsGrowing;
	}

	public get plantsHarvested(): number {
		return this._plantsHarvested;
	}

	public get plantsDead(): number {
		return this._plantsDead;
	}

	public get plantsArchived(): number {
		return this._plantsArchived;
	}

	// Additional plant metrics getters
	public get plantsWithoutPlantedDate(): number {
		return this._plantsWithoutPlantedDate;
	}

	public get plantsWithNotes(): number {
		return this._plantsWithNotes;
	}

	public get recentPlants(): number {
		return this._recentPlants;
	}

	// Growing units metrics getters
	public get totalGrowingUnits(): number {
		return this._totalGrowingUnits;
	}

	public get activeGrowingUnits(): number {
		return this._activeGrowingUnits;
	}

	public get emptyGrowingUnits(): number {
		return this._emptyGrowingUnits;
	}

	// Growing units by type getters
	public get growingUnitsPot(): number {
		return this._growingUnitsPot;
	}

	public get growingUnitsGardenBed(): number {
		return this._growingUnitsGardenBed;
	}

	public get growingUnitsHangingBasket(): number {
		return this._growingUnitsHangingBasket;
	}

	public get growingUnitsWindowBox(): number {
		return this._growingUnitsWindowBox;
	}

	// Capacity metrics getters
	public get totalCapacity(): number {
		return this._totalCapacity;
	}

	public get totalCapacityUsed(): number {
		return this._totalCapacityUsed;
	}

	public get averageOccupancy(): number {
		return this._averageOccupancy;
	}

	public get growingUnitsAtLimit(): number {
		return this._growingUnitsAtLimit;
	}

	public get growingUnitsFull(): number {
		return this._growingUnitsFull;
	}

	public get totalRemainingCapacity(): number {
		return this._totalRemainingCapacity;
	}

	// Dimensions metrics getters
	public get growingUnitsWithDimensions(): number {
		return this._growingUnitsWithDimensions;
	}

	public get totalVolume(): number {
		return this._totalVolume;
	}

	public get averageVolume(): number {
		return this._averageVolume;
	}

	// Aggregated metrics getters
	public get minPlantsPerGrowingUnit(): number {
		return this._minPlantsPerGrowingUnit;
	}

	public get maxPlantsPerGrowingUnit(): number {
		return this._maxPlantsPerGrowingUnit;
	}

	public get medianPlantsPerGrowingUnit(): number {
		return this._medianPlantsPerGrowingUnit;
	}

	/**
	 * Updates the overview view model with new data.
	 *
	 * @param updateData - The partial update view model data for the overview
	 * @returns void
	 */
	public update(updateData: IOverviewViewModelDto): void {
		// Plants metrics
		this._totalPlants = updateData.totalPlants;
		this._totalActivePlants = updateData.totalActivePlants;
		this._averagePlantsPerGrowingUnit = updateData.averagePlantsPerGrowingUnit;

		// Plants by status
		this._plantsPlanted = updateData.plantsPlanted;
		this._plantsGrowing = updateData.plantsGrowing;
		this._plantsHarvested = updateData.plantsHarvested;
		this._plantsDead = updateData.plantsDead;
		this._plantsArchived = updateData.plantsArchived;

		// Additional plant metrics
		this._plantsWithoutPlantedDate = updateData.plantsWithoutPlantedDate;
		this._plantsWithNotes = updateData.plantsWithNotes;
		this._recentPlants = updateData.recentPlants;

		// Growing units metrics
		this._totalGrowingUnits = updateData.totalGrowingUnits;
		this._activeGrowingUnits = updateData.activeGrowingUnits;
		this._emptyGrowingUnits = updateData.emptyGrowingUnits;

		// Growing units by type
		this._growingUnitsPot = updateData.growingUnitsPot;
		this._growingUnitsGardenBed = updateData.growingUnitsGardenBed;
		this._growingUnitsHangingBasket = updateData.growingUnitsHangingBasket;
		this._growingUnitsWindowBox = updateData.growingUnitsWindowBox;

		// Capacity metrics
		this._totalCapacity = updateData.totalCapacity;
		this._totalCapacityUsed = updateData.totalCapacityUsed;
		this._averageOccupancy = updateData.averageOccupancy;
		this._growingUnitsAtLimit = updateData.growingUnitsAtLimit;
		this._growingUnitsFull = updateData.growingUnitsFull;
		this._totalRemainingCapacity = updateData.totalRemainingCapacity;

		// Dimensions metrics
		this._growingUnitsWithDimensions = updateData.growingUnitsWithDimensions;
		this._totalVolume = updateData.totalVolume;
		this._averageVolume = updateData.averageVolume;

		// Aggregated metrics
		this._minPlantsPerGrowingUnit = updateData.minPlantsPerGrowingUnit;
		this._maxPlantsPerGrowingUnit = updateData.maxPlantsPerGrowingUnit;
		this._medianPlantsPerGrowingUnit = updateData.medianPlantsPerGrowingUnit;

		this._updatedAt = new Date();
	}
}
