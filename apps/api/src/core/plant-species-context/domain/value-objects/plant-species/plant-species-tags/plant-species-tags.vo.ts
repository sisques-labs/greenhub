/**
 * Value object representing an array of tags for a plant species.
 */
export class PlantSpeciesTagsValueObject {
	private readonly _value: string[];

	constructor(tags: string[]) {
		this._value = [...tags];
	}

	public get value(): string[] {
		return [...this._value];
	}

	public has(tag: string): boolean {
		return this._value.includes(tag);
	}

	public isEmpty(): boolean {
		return this._value.length === 0;
	}

	public count(): number {
		return this._value.length;
	}

	public toPrimitives(): string[] {
		return [...this._value];
	}

	public equals(other: PlantSpeciesTagsValueObject): boolean {
		if (this._value.length !== other._value.length) {
			return false;
		}
		return this._value.every((tag) => other._value.includes(tag));
	}
}
