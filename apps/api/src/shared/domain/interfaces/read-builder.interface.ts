import { IBuilder } from './builder.interface';

/**
 * Base interface for read builders that construct view models.
 * Read builders are responsible for creating view models from
 * aggregates or primitive data for query operations.
 *
 * @template TViewModel - The view model type being built
 * @template TPrimitives - The primitive data type used for reconstruction
 *
 * @example
 * ```typescript
 * const userViewModelBuilder = new UserViewModelBuilder()
 *   .withId(userId)
 *   .withName(name)
 *   .withEmail(email);
 *
 * const userViewModel = userViewModelBuilder.build();
 * ```
 */
export interface IReadBuilder<TViewModel, TPrimitives = unknown>
	extends IBuilder<TViewModel> {
	/**
	 * Initializes the builder from primitive data (usually from MongoDB).
	 * This method sets all the builder's properties from the primitive values.
	 *
	 * @param primitives - The primitive data to initialize from
	 * @returns The builder instance for method chaining
	 */
	fromPrimitives(primitives: TPrimitives): this;
}
