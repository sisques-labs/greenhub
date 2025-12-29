/**
 * Generic interface for representing a field change event data.
 * The field being changed is indicated by the event name.
 *
 * @template T - The type of the field value
 */
export interface IFieldChangedEventData<T> {
  id: string;
  oldValue: T;
  newValue: T;
}
