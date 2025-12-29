/**
 * Represents a command DTO that encapsulates the change of a field value.
 *
 * @template T - The type of the value that has changed.
 */
export interface IBaseFieldChangedCommandDto<T> {
  /**
   * The unique identifier of the entity or field being changed.
   */
  id: string;
  /**
   * The previous value of the field before the change.
   */
  oldValue: T;
  /**
   * The new value of the field after the change.
   */
  newValue: T;
}
