import { IPlantSpeciesViewModelDto } from '@/core/plant-species-context/domain/dtos/view-models/plant-species/plant-species-view-model.dto';
import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents a plant species view model for the presentation layer.
 */
export class PlantSpeciesViewModel extends BaseViewModel {
	private _commonName: string;
	private _scientificName: string;
	private _family: string;
	private _description: string;
	private _category: string;
	private _difficulty: string;
	private _growthRate: string;
	private _lightRequirements: string;
	private _waterRequirements: string;
	private _temperatureRange: INumericRange;
	private _humidityRequirements: string;
	private _soilType: string;
	private _phRange: INumericRange;
	private _matureSize: { height: number; width: number };
	private _growthTime: number;
	private _tags: string[];
	private _isVerified: boolean;
	private _contributorId: string | null;

	constructor(props: IPlantSpeciesViewModelDto) {
		super(props);
		this._commonName = props.commonName;
		this._scientificName = props.scientificName;
		this._family = props.family;
		this._description = props.description;
		this._category = props.category;
		this._difficulty = props.difficulty;
		this._growthRate = props.growthRate;
		this._lightRequirements = props.lightRequirements;
		this._waterRequirements = props.waterRequirements;
		this._temperatureRange = props.temperatureRange;
		this._humidityRequirements = props.humidityRequirements;
		this._soilType = props.soilType;
		this._phRange = props.phRange;
		this._matureSize = props.matureSize;
		this._growthTime = props.growthTime;
		this._tags = props.tags;
		this._isVerified = props.isVerified;
		this._contributorId = props.contributorId;
	}

	public get commonName(): string {
		return this._commonName;
	}

	public get scientificName(): string {
		return this._scientificName;
	}

	public get family(): string {
		return this._family;
	}

	public get description(): string {
		return this._description;
	}

	public get category(): string {
		return this._category;
	}

	public get difficulty(): string {
		return this._difficulty;
	}

	public get growthRate(): string {
		return this._growthRate;
	}

	public get lightRequirements(): string {
		return this._lightRequirements;
	}

	public get waterRequirements(): string {
		return this._waterRequirements;
	}

	public get temperatureRange(): INumericRange {
		return this._temperatureRange;
	}

	public get humidityRequirements(): string {
		return this._humidityRequirements;
	}

	public get soilType(): string {
		return this._soilType;
	}

	public get phRange(): INumericRange {
		return this._phRange;
	}

	public get matureSize(): { height: number; width: number } {
		return this._matureSize;
	}

	public get growthTime(): number {
		return this._growthTime;
	}

	public get tags(): string[] {
		return this._tags;
	}

	public get isVerified(): boolean {
		return this._isVerified;
	}

	public get contributorId(): string | null {
		return this._contributorId;
	}

	/**
	 * Updates the plant species view model with new data.
	 */
	public update(updateData: IPlantSpeciesViewModelDto): void {
		this._commonName = updateData.commonName;
		this._scientificName = updateData.scientificName;
		this._family = updateData.family;
		this._description = updateData.description;
		this._category = updateData.category;
		this._difficulty = updateData.difficulty;
		this._growthRate = updateData.growthRate;
		this._lightRequirements = updateData.lightRequirements;
		this._waterRequirements = updateData.waterRequirements;
		this._temperatureRange = updateData.temperatureRange;
		this._humidityRequirements = updateData.humidityRequirements;
		this._soilType = updateData.soilType;
		this._phRange = updateData.phRange;
		this._matureSize = updateData.matureSize;
		this._growthTime = updateData.growthTime;
		this._tags = updateData.tags;
		this._isVerified = updateData.isVerified;
		this._contributorId = updateData.contributorId;

		this._updatedAt = new Date();
	}
}
