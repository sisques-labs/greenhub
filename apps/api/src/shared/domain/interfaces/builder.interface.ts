/**
 * Base interface for builders that construct domain entities step by step.
 * Builders provide a fluent API for creating complex objects with optional parameters.
 *
 * @template TEntity - The type of entity being built
 *
 * @example
 * ```typescript
 * const location = new LocationBuilder()
 *   .withId(locationId)
 *   .withName(name)
 *   .withType(type)
 *   .build();
 * ```
 */
export interface IBuilder<TEntity> {
	/**
	 * Builds and returns the final entity.
	 * This method should validate that all required fields are set
	 * before constructing the entity.
	 *
	 * @returns The built entity
	 * @throws {Error} If required fields are missing
	 */
	build(): TEntity;

	/**
	 * Resets the builder to its initial state.
	 * Useful for reusing the same builder instance.
	 *
	 * @returns The builder instance for method chaining
	 */
	reset(): this;
}
