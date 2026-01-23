import { IBuilder } from './builder.interface';

/**
 * Base interface for write builders that construct domain aggregates.
 * Write builders are responsible for creating aggregates with validation
 * and encapsulation of construction logic.
 *
 * @template TEntity - The aggregate type being built
 * @template TPrimitives - The primitive data type used for reconstruction
 *
 * @example
 * ```typescript
 * const userBuilder = new UserAggregateBuilder()
 *   .withId(userId)
 *   .withName(name)
 *   .withEmail(email)
 *   .withRole(role);
 *
 * const user = userBuilder.build();
 * ```
 */
export interface IWriteBuilder<TEntity, TPrimitives = unknown>
	extends IBuilder<TEntity> {
	/**
	 * Initializes the builder from primitive data (usually from database).
	 * This method sets all the builder's properties from the primitive values.
	 *
	 * @param primitives - The primitive data to initialize from
	 * @returns The builder instance for method chaining
	 */
	fromPrimitives(primitives: TPrimitives): this;
}
