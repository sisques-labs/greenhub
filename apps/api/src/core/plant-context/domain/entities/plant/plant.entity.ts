import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { PlantPlantedDateMissingException } from '@/core/plant-context/domain/exceptions/growing-unit-plant-planted-date-missing.exception';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Represents the Plant entity, encapsulating its properties, behaviors and state transitions.
 * This domain entity serves as an aggregate root for plant-related operations and mutations.
 *
 * Mainly, this class is used to manipulate plant objects with strict value objects, manage allowed
 * property changes, and provide methods to represent the aggregate as primitives.
 *
 * @remarks
 * - The constructor expects domain value objects rather than plain types.
 * - Mutating methods (changeStatus, changeName, etc) update specific properties.
 * - Query methods (getAge, toPrimitives, etc) provide value-oriented or presentation data.
 */
export class PlantEntity {
  /**
   * Plant unique identifier (value object).
   */
  private readonly _id: PlantUuidValueObject;

  /**
   * Foreign key: UUID of the growing unit where the plant is located.
   */
  private _growingUnitId: GrowingUnitUuidValueObject;

  /**
   * Name of the plant.
   */
  private _name: PlantNameValueObject;

  /**
   * Species of the plant.
   */
  private _species: PlantSpeciesValueObject;

  /**
   * The date this plant was planted, if known.
   */
  private _plantedDate: PlantPlantedDateValueObject | null;

  /**
   * Additional notes about the plant (free text).
   */
  private _notes: PlantNotesValueObject;

  /**
   * Current lifecycle status (active, dead, dormant, etc).
   */
  private _status: PlantStatusValueObject;

  /**
   * Instantiate a new PlantEntity from its value objects.
   * @param props - Plant entity properties as defined by `IPlantDto`.
   */
  constructor(props: IPlantDto) {
    this._id = props.id;
    this._growingUnitId = props.growingUnitId;
    this._name = props.name;
    this._species = props.species;
    this._plantedDate = props.plantedDate;
    this._notes = props.notes;
    this._status = props.status;
  }

  /**
   * Change the current plant status.
   * @param status - New status value object.
   */
  public changeStatus(status: PlantStatusValueObject): void {
    this._status = status;
  }

  /**
   * Change the growing unit to which this plant belongs.
   * @param newGrowingUnitId - The new growing unit's value object.
   */
  public changeGrowingUnit(newGrowingUnitId: GrowingUnitUuidValueObject): void {
    this._growingUnitId = newGrowingUnitId;
  }

  /**
   * Change the plant's name.
   * @param newName - New name as a value object.
   */
  public changeName(newName: PlantNameValueObject): void {
    this._name = newName;
  }

  /**
   * Change the plant's species.
   * @param newSpecies - New species as a value object.
   */
  public changeSpecies(newSpecies: PlantSpeciesValueObject): void {
    this._species = newSpecies;
  }

  /**
   * Change the date when the plant was planted.
   * @param newPlantedDate - New planted date as value object.
   */
  public changePlantedDate(newPlantedDate: PlantPlantedDateValueObject): void {
    this._plantedDate = newPlantedDate;
  }

  /**
   * Change the plant's notes field.
   * @param newNotes - New notes as value object.
   */
  public changeNotes(newNotes: PlantNotesValueObject): void {
    this._notes = newNotes;
  }

  /**
   * Get the duration since the plant was planted, in milliseconds.
   * Throws if no planted date is set.
   *
   * @returns Number of milliseconds since planted.
   * @throws {@link PlantPlantedDateMissingException}
   */
  public getAge(): number {
    if (!this._plantedDate) {
      throw new PlantPlantedDateMissingException(this._id.value);
    }
    return new Date().getTime() - this._plantedDate.value.getTime();
  }

  /**
   * Gets the plant's unique identifier.
   */
  public get id(): PlantUuidValueObject {
    return this._id;
  }

  /**
   * Gets the identifier of the plant's growing unit.
   */
  public get growingUnitId(): GrowingUnitUuidValueObject {
    return this._growingUnitId;
  }

  /**
   * Gets the plant's name value object.
   */
  public get name(): PlantNameValueObject {
    return this._name;
  }

  /**
   * Gets the plant's species value object.
   */
  public get species(): PlantSpeciesValueObject {
    return this._species;
  }

  /**
   * Gets the plant's planted date value object or null.
   */
  public get plantedDate(): PlantPlantedDateValueObject | null {
    return this._plantedDate;
  }

  /**
   * Gets the plant's notes value object.
   */
  public get notes(): PlantNotesValueObject {
    return this._notes;
  }

  /**
   * Gets the plant's current status value object.
   */
  public get status(): PlantStatusValueObject {
    return this._status;
  }

  /**
   * Convert the entity to a plain primitive object structure.
   *
   * @returns An object containing all primitive properties of the plant.
   */
  public toPrimitives(): PlantPrimitives {
    return {
      id: this._id.value,
      growingUnitId: this._growingUnitId.value,
      name: this._name.value,
      species: this._species.value,
      plantedDate: this._plantedDate?.value ?? null,
      notes: this._notes.value,
      status: this._status.value,
    };
  }
}
