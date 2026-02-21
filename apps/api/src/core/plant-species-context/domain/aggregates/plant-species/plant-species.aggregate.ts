import { PlantSpeciesDeletedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-deleted/plant-species-deleted.event';
import { PlantSpeciesUpdatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-updated/plant-species-updated.event';
import { IPlantSpeciesDto } from '@/core/plant-species-context/domain/dtos/entities/plant-species/plant-species.dto';
import { PlantSpeciesCategoryChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-category-changed/plant-species-category-changed.event';
import { PlantSpeciesCommonNameChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-common-name-changed/plant-species-common-name-changed.event';
import { PlantSpeciesDescriptionChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-description-changed/plant-species-description-changed.event';
import { PlantSpeciesDifficultyChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-difficulty-changed/plant-species-difficulty-changed.event';
import { PlantSpeciesFamilyChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-family-changed/plant-species-family-changed.event';
import { PlantSpeciesGrowthRateChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-growth-rate-changed/plant-species-growth-rate-changed.event';
import { PlantSpeciesGrowthTimeChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-growth-time-changed/plant-species-growth-time-changed.event';
import { PlantSpeciesHumidityRequirementsChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-humidity-requirements-changed/plant-species-humidity-requirements-changed.event';
import { PlantSpeciesIsVerifiedChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-is-verified-changed/plant-species-is-verified-changed.event';
import { PlantSpeciesLightRequirementsChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-light-requirements-changed/plant-species-light-requirements-changed.event';
import { PlantSpeciesMatureSizeChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-mature-size-changed/plant-species-mature-size-changed.event';
import { PlantSpeciesPhRangeChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-ph-range-changed/plant-species-ph-range-changed.event';
import { PlantSpeciesScientificNameChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-scientific-name-changed/plant-species-scientific-name-changed.event';
import { PlantSpeciesSoilTypeChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-soil-type-changed/plant-species-soil-type-changed.event';
import { PlantSpeciesTagsChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-tags-changed/plant-species-tags-changed.event';
import { PlantSpeciesTemperatureRangeChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-temperature-range-changed/plant-species-temperature-range-changed.event';
import { PlantSpeciesWaterRequirementsChangedEvent } from '@/core/plant-species-context/domain/events/plant-species/field-changed/plant-species-water-requirements-changed/plant-species-water-requirements-changed.event';
import { PlantSpeciesPrimitives } from '@/core/plant-species-context/domain/primitives/plant-species/plant-species.primitives';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesDescriptionValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-description/plant-species-description.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesFamilyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-family/plant-species-family.vo';
import { PlantSpeciesGrowthRateValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-rate/plant-species-growth-rate.vo';
import { PlantSpeciesGrowthTimeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-growth-time/plant-species-growth-time.vo';
import { PlantSpeciesHumidityRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.vo';
import { PlantSpeciesLightRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-light-requirements/plant-species-light-requirements.vo';
import { PlantSpeciesMatureSizeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-mature-size/plant-species-mature-size.vo';
import { PlantSpeciesPhRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-ph-range/plant-species-ph-range.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesSoilTypeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-soil-type/plant-species-soil-type.vo';
import { PlantSpeciesTagsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-tags/plant-species-tags.vo';
import { PlantSpeciesTemperatureRangeValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-temperature-range/plant-species-temperature-range.vo';
import { PlantSpeciesWaterRequirementsValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-water-requirements/plant-species-water-requirements.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

/**
 * Aggregate root representing a plant species with its care requirements and growth information.
 */
export class PlantSpeciesAggregate extends AggregateRoot {
	/**
	 * The unique identifier of this plant species.
	 */
	private readonly _id: PlantSpeciesUuidValueObject;

	/**
	 * The common name of the plant species.
	 */
	private _commonName: PlantSpeciesCommonNameValueObject;

	/**
	 * The scientific name of the plant species.
	 */
	private _scientificName: PlantSpeciesScientificNameValueObject;

	/**
	 * The botanical family of the plant species.
	 */
	private _family: PlantSpeciesFamilyValueObject;

	/**
	 * The description of the plant species.
	 */
	private _description: PlantSpeciesDescriptionValueObject;

	/**
	 * The category of the plant species.
	 */
	private _category: PlantSpeciesCategoryValueObject;

	/**
	 * The care difficulty level of the plant species.
	 */
	private _difficulty: PlantSpeciesDifficultyValueObject;

	/**
	 * The growth rate of the plant species.
	 */
	private _growthRate: PlantSpeciesGrowthRateValueObject;

	/**
	 * The light requirements of the plant species.
	 */
	private _lightRequirements: PlantSpeciesLightRequirementsValueObject;

	/**
	 * The water requirements of the plant species.
	 */
	private _waterRequirements: PlantSpeciesWaterRequirementsValueObject;

	/**
	 * The temperature range (min/max °C) suitable for the plant species.
	 */
	private _temperatureRange: PlantSpeciesTemperatureRangeValueObject;

	/**
	 * The humidity requirements of the plant species.
	 */
	private _humidityRequirements: PlantSpeciesHumidityRequirementsValueObject;

	/**
	 * The preferred soil type for the plant species.
	 */
	private _soilType: PlantSpeciesSoilTypeValueObject;

	/**
	 * The ideal pH range for the plant species.
	 */
	private _phRange: PlantSpeciesPhRangeValueObject;

	/**
	 * The mature size (height/width in cm) of the plant species.
	 */
	private _matureSize: PlantSpeciesMatureSizeValueObject;

	/**
	 * The growth time (days to maturity) of the plant species.
	 */
	private _growthTime: PlantSpeciesGrowthTimeValueObject;

	/**
	 * The tags associated with the plant species.
	 */
	private _tags: PlantSpeciesTagsValueObject;

	/**
	 * Whether the plant species has been verified by a curator.
	 */
	private _isVerified: BooleanValueObject;

	/**
	 * The ID of the user who contributed this plant species entry.
	 */
	private _contributorId: UserUuidValueObject | null;

	/**
	 * The date and time when the plant species was created.
	 */
	private readonly _createdAt: Date;

	/**
	 * The date and time when the plant species was last updated.
	 */
	private _updatedAt: Date;

	/**
	 * The date and time when the plant species was soft-deleted, or null if not deleted.
	 */
	private _deletedAt: Date | null;

	/**
	 * Creates a new PlantSpeciesAggregate.
	 *
	 * @param props - The properties to initialize the plant species with.
	 */
	constructor(props: IPlantSpeciesDto) {
		super();

		this._id = props.id;
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
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
		this._deletedAt = props.deletedAt;
	}

	/**
	 * Changes the common name of the plant species.
	 * @param commonName - The new common name value object.
	 */
	public changeCommonName(commonName: PlantSpeciesCommonNameValueObject): void {
		const oldValue = this._commonName.value;
		this._commonName = commonName;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesCommonNameChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesCommonNameChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._commonName.value },
			),
		);
	}

	/**
	 * Changes the scientific name of the plant species.
	 * @param scientificName - The new scientific name value object.
	 */
	public changeScientificName(
		scientificName: PlantSpeciesScientificNameValueObject,
	): void {
		const oldValue = this._scientificName.value;
		this._scientificName = scientificName;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesScientificNameChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesScientificNameChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._scientificName.value,
				},
			),
		);
	}

	/**
	 * Changes the family of the plant species.
	 * @param family - The new family value object.
	 */
	public changeFamily(family: PlantSpeciesFamilyValueObject): void {
		const oldValue = this._family.value;
		this._family = family;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesFamilyChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesFamilyChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._family.value },
			),
		);
	}

	/**
	 * Changes the description of the plant species.
	 * @param description - The new description value object.
	 */
	public changeDescription(
		description: PlantSpeciesDescriptionValueObject,
	): void {
		const oldValue = this._description.value;
		this._description = description;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesDescriptionChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesDescriptionChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._description.value,
				},
			),
		);
	}

	/**
	 * Changes the category of the plant species.
	 * @param category - The new category value object.
	 */
	public changeCategory(category: PlantSpeciesCategoryValueObject): void {
		const oldValue = this._category.value;
		this._category = category;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesCategoryChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesCategoryChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._category.value },
			),
		);
	}

	/**
	 * Changes the difficulty of the plant species.
	 * @param difficulty - The new difficulty value object.
	 */
	public changeDifficulty(difficulty: PlantSpeciesDifficultyValueObject): void {
		const oldValue = this._difficulty.value;
		this._difficulty = difficulty;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesDifficultyChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesDifficultyChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._difficulty.value },
			),
		);
	}

	/**
	 * Changes the growth rate of the plant species.
	 * @param growthRate - The new growth rate value object.
	 */
	public changeGrowthRate(growthRate: PlantSpeciesGrowthRateValueObject): void {
		const oldValue = this._growthRate.value;
		this._growthRate = growthRate;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesGrowthRateChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesGrowthRateChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._growthRate.value },
			),
		);
	}

	/**
	 * Changes the light requirements of the plant species.
	 * @param lightRequirements - The new light requirements value object.
	 */
	public changeLightRequirements(
		lightRequirements: PlantSpeciesLightRequirementsValueObject,
	): void {
		const oldValue = this._lightRequirements.value;
		this._lightRequirements = lightRequirements;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesLightRequirementsChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesLightRequirementsChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._lightRequirements.value,
				},
			),
		);
	}

	/**
	 * Changes the water requirements of the plant species.
	 * @param waterRequirements - The new water requirements value object.
	 */
	public changeWaterRequirements(
		waterRequirements: PlantSpeciesWaterRequirementsValueObject,
	): void {
		const oldValue = this._waterRequirements.value;
		this._waterRequirements = waterRequirements;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesWaterRequirementsChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesWaterRequirementsChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._waterRequirements.value,
				},
			),
		);
	}

	/**
	 * Changes the temperature range of the plant species.
	 * @param temperatureRange - The new temperature range value object.
	 */
	public changeTemperatureRange(
		temperatureRange: PlantSpeciesTemperatureRangeValueObject,
	): void {
		const oldValue = this._temperatureRange.toPrimitives();
		this._temperatureRange = temperatureRange;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesTemperatureRangeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesTemperatureRangeChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._temperatureRange.toPrimitives(),
				},
			),
		);
	}

	/**
	 * Changes the humidity requirements of the plant species.
	 * @param humidityRequirements - The new humidity requirements value object.
	 */
	public changeHumidityRequirements(
		humidityRequirements: PlantSpeciesHumidityRequirementsValueObject,
	): void {
		const oldValue = this._humidityRequirements.value;
		this._humidityRequirements = humidityRequirements;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesHumidityRequirementsChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesHumidityRequirementsChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._humidityRequirements.value,
				},
			),
		);
	}

	/**
	 * Changes the soil type of the plant species.
	 * @param soilType - The new soil type value object.
	 */
	public changeSoilType(soilType: PlantSpeciesSoilTypeValueObject): void {
		const oldValue = this._soilType.value;
		this._soilType = soilType;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesSoilTypeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesSoilTypeChangedEvent.name,
				},
				{ id: this._id.value, oldValue, newValue: this._soilType.value },
			),
		);
	}

	/**
	 * Changes the pH range of the plant species.
	 * @param phRange - The new pH range value object.
	 */
	public changePhRange(phRange: PlantSpeciesPhRangeValueObject): void {
		const oldValue = this._phRange.toPrimitives();
		this._phRange = phRange;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesPhRangeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesPhRangeChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._phRange.toPrimitives(),
				},
			),
		);
	}

	/**
	 * Changes the mature size of the plant species.
	 * @param matureSize - The new mature size value object.
	 */
	public changeMatureSize(matureSize: PlantSpeciesMatureSizeValueObject): void {
		const oldValue = this._matureSize.toPrimitives();
		this._matureSize = matureSize;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesMatureSizeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesMatureSizeChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._matureSize.toPrimitives(),
				},
			),
		);
	}

	/**
	 * Changes the growth time of the plant species.
	 * @param growthTime - The new growth time value object.
	 */
	public changeGrowthTime(growthTime: PlantSpeciesGrowthTimeValueObject): void {
		const oldValue = this._growthTime.value;
		this._growthTime = growthTime;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesGrowthTimeChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesGrowthTimeChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._growthTime.value,
				},
			),
		);
	}

	/**
	 * Changes the tags of the plant species.
	 * @param tags - The new tags value object.
	 */
	public changeTags(tags: PlantSpeciesTagsValueObject): void {
		const oldValue = this._tags.toPrimitives();
		this._tags = tags;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesTagsChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesTagsChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._tags.toPrimitives(),
				},
			),
		);
	}

	/**
	 * Changes the verification status of the plant species.
	 * @param isVerified - The new verification status value object.
	 */
	public changeIsVerified(isVerified: BooleanValueObject): void {
		const oldValue = this._isVerified.value;
		this._isVerified = isVerified;
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesIsVerifiedChangedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesIsVerifiedChangedEvent.name,
				},
				{
					id: this._id.value,
					oldValue,
					newValue: this._isVerified.value,
				},
			),
		);
	}

	/**
	 * Updates the plant species with the provided fields, calling the corresponding
	 * change methods internally, and emits a {@link PlantSpeciesUpdatedEvent} at the end.
	 *
	 * @param props - The fields to update (all optional).
	 */
	public update(props: Partial<IPlantSpeciesDto>): void {
		if (props.commonName !== undefined) {
			this.changeCommonName(props.commonName);
		}

		if (props.scientificName !== undefined) {
			this.changeScientificName(props.scientificName);
		}

		if (props.family !== undefined) {
			this.changeFamily(props.family);
		}

		if (props.description !== undefined) {
			this.changeDescription(props.description);
		}

		if (props.category !== undefined) {
			this.changeCategory(props.category);
		}

		if (props.difficulty !== undefined) {
			this.changeDifficulty(props.difficulty);
		}

		if (props.growthRate !== undefined) {
			this.changeGrowthRate(props.growthRate);
		}

		if (props.lightRequirements !== undefined) {
			this.changeLightRequirements(props.lightRequirements);
		}

		if (props.waterRequirements !== undefined) {
			this.changeWaterRequirements(props.waterRequirements);
		}

		if (props.temperatureRange !== undefined) {
			this.changeTemperatureRange(props.temperatureRange);
		}

		if (props.humidityRequirements !== undefined) {
			this.changeHumidityRequirements(props.humidityRequirements);
		}

		if (props.soilType !== undefined) {
			this.changeSoilType(props.soilType);
		}

		if (props.phRange !== undefined) {
			this.changePhRange(props.phRange);
		}

		if (props.matureSize !== undefined) {
			this.changeMatureSize(props.matureSize);
		}

		if (props.growthTime !== undefined) {
			this.changeGrowthTime(props.growthTime);
		}

		if (props.tags !== undefined) {
			this.changeTags(props.tags);
		}

		this.apply(
			new PlantSpeciesUpdatedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesUpdatedEvent.name,
				},
				{ ...this.toPrimitives() },
			),
		);
	}

	/**
	 * Marks this plant species as deleted (soft-delete).
	 */
	public delete(): void {
		this._deletedAt = new Date();
		this._updatedAt = new Date();

		this.apply(
			new PlantSpeciesDeletedEvent(
				{
					aggregateRootId: this._id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: this._id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesDeletedEvent.name,
				},
				{ ...this.toPrimitives() },
			),
		);
	}

	/**
	 * Checks if the plant species has been deleted.
	 * @returns True if deleted, false otherwise.
	 */
	public isDeleted(): boolean {
		return this._deletedAt !== null;
	}

	/**
	 * The unique identifier of this plant species.
	 */
	public get id(): PlantSpeciesUuidValueObject {
		return this._id;
	}

	/**
	 * The common name of this plant species.
	 */
	public get commonName(): PlantSpeciesCommonNameValueObject {
		return this._commonName;
	}

	/**
	 * The scientific name of this plant species.
	 */
	public get scientificName(): PlantSpeciesScientificNameValueObject {
		return this._scientificName;
	}

	/**
	 * The botanical family of this plant species.
	 */
	public get family(): PlantSpeciesFamilyValueObject {
		return this._family;
	}

	/**
	 * The description of this plant species.
	 */
	public get description(): PlantSpeciesDescriptionValueObject {
		return this._description;
	}

	/**
	 * The category of this plant species.
	 */
	public get category(): PlantSpeciesCategoryValueObject {
		return this._category;
	}

	/**
	 * The care difficulty level of this plant species.
	 */
	public get difficulty(): PlantSpeciesDifficultyValueObject {
		return this._difficulty;
	}

	/**
	 * The growth rate of this plant species.
	 */
	public get growthRate(): PlantSpeciesGrowthRateValueObject {
		return this._growthRate;
	}

	/**
	 * The light requirements of this plant species.
	 */
	public get lightRequirements(): PlantSpeciesLightRequirementsValueObject {
		return this._lightRequirements;
	}

	/**
	 * The water requirements of this plant species.
	 */
	public get waterRequirements(): PlantSpeciesWaterRequirementsValueObject {
		return this._waterRequirements;
	}

	/**
	 * The temperature range suitable for this plant species.
	 */
	public get temperatureRange(): PlantSpeciesTemperatureRangeValueObject {
		return this._temperatureRange;
	}

	/**
	 * The humidity requirements of this plant species.
	 */
	public get humidityRequirements(): PlantSpeciesHumidityRequirementsValueObject {
		return this._humidityRequirements;
	}

	/**
	 * The preferred soil type for this plant species.
	 */
	public get soilType(): PlantSpeciesSoilTypeValueObject {
		return this._soilType;
	}

	/**
	 * The ideal pH range for this plant species.
	 */
	public get phRange(): PlantSpeciesPhRangeValueObject {
		return this._phRange;
	}

	/**
	 * The mature size of this plant species.
	 */
	public get matureSize(): PlantSpeciesMatureSizeValueObject {
		return this._matureSize;
	}

	/**
	 * The growth time (days to maturity) of this plant species.
	 */
	public get growthTime(): PlantSpeciesGrowthTimeValueObject {
		return this._growthTime;
	}

	/**
	 * The tags associated with this plant species.
	 */
	public get tags(): PlantSpeciesTagsValueObject {
		return this._tags;
	}

	/**
	 * Whether this plant species has been verified.
	 */
	public get isVerified(): BooleanValueObject {
		return this._isVerified;
	}

	/**
	 * The ID of the contributor who submitted this plant species.
	 */
	public get contributorId(): UserUuidValueObject | null {
		return this._contributorId;
	}

	/**
	 * The creation timestamp.
	 */
	public get createdAt(): Date {
		return this._createdAt;
	}

	/**
	 * The last update timestamp.
	 */
	public get updatedAt(): Date {
		return this._updatedAt;
	}

	/**
	 * The deletion timestamp, or null if not deleted.
	 */
	public get deletedAt(): Date | null {
		return this._deletedAt;
	}

	/**
	 * Converts the plant species to its primitive representation for serialization.
	 * @returns Primitives representing the plant species.
	 */
	public toPrimitives(): PlantSpeciesPrimitives {
		return {
			id: this._id.value,
			commonName: this._commonName.value,
			scientificName: this._scientificName.value,
			family: this._family.value,
			description: this._description.value,
			category: this._category.value,
			difficulty: this._difficulty.value,
			growthRate: this._growthRate.value,
			lightRequirements: this._lightRequirements.value,
			waterRequirements: this._waterRequirements.value,
			temperatureRange: this._temperatureRange.toPrimitives(),
			humidityRequirements: this._humidityRequirements.value,
			soilType: this._soilType.value,
			phRange: this._phRange.toPrimitives(),
			matureSize: this._matureSize.toPrimitives(),
			growthTime: this._growthTime.value,
			tags: this._tags.toPrimitives(),
			isVerified: this._isVerified.value,
			contributorId: this._contributorId?.value ?? null,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
			deletedAt: this._deletedAt,
		};
	}
}
