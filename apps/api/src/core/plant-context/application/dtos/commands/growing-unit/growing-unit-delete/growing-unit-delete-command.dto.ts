/**
 * Data Transfer Object for deleting a growing unit via the command layer.
 *
 * @remarks
 * This DTO is used to encapsulate the information required to delete
 * a growing unit. It is typically used in the command pattern
 * within the application layer.
 *
 * @public
 */
export interface IGrowingUnitDeleteCommandDto {
	/**
	 * The unique identifier of the growing unit to be deleted.
	 */
	id: string;
}
