import { Logger } from '@nestjs/common';
import { AggregateRoot, EventBus } from '@nestjs/cqrs';

import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';

/**
 * Abstract base class for update command handlers.
 *
 * Provides a common implementation for extracting update data from commands
 * by filtering out undefined values and optional exclusion of specific fields.
 * Extends BaseCommandHandler to provide event publishing functionality.
 *
 * @template TCommand - The command type
 * @template TUpdateDto - The DTO type for the update operation
 * @template TAggregate - The aggregate type (must extend AggregateRoot)
 */
export abstract class BaseUpdateCommandHandler<
	TCommand,
	TUpdateDto,
	TAggregate extends AggregateRoot = AggregateRoot,
> extends BaseCommandHandler<TCommand, TAggregate> {
	protected readonly logger = new Logger(BaseUpdateCommandHandler.name);

	constructor(eventBus: EventBus) {
		super(eventBus);
	}

	/**
	 * Extracts update data from a command, filtering out undefined values.
	 *
	 * @param command - The command containing the update data
	 * @param excludeFields - Optional array of field names to exclude from the update data
	 * @returns The extracted update data as TUpdateDto
	 *
	 * @example
	 * ```typescript
	 * const updateData = this.extractUpdateData(command, ['id']);
	 * ```
	 */
	protected extractUpdateData(
		command: TCommand,
		excludeFields: string[] = [],
	): TUpdateDto {
		this.logger.debug(
			`Extracting update data from command: ${JSON.stringify(command)}`,
		);

		return Object.fromEntries(
			Object.entries(command).filter(
				([key, value]) => value !== undefined && !excludeFields.includes(key),
			),
		) as TUpdateDto;
	}

	/**
	 * Extracts update data from a command with additional transformations.
	 *
	 * Allows custom mapping and filtering logic for complex update scenarios.
	 *
	 * @param command - The command containing the update data
	 * @param transformer - Optional function to transform the extracted data
	 * @param excludeFields - Optional array of field names to exclude
	 * @returns The transformed update data as TUpdateDto
	 *
	 * @example
	 * ```typescript
	 * const updateData = this.extractUpdateDataWithTransform(
	 *   command,
	 *   (data) => ({ ...data, timestamp: Date.now() }),
	 *   ['id']
	 * );
	 * ```
	 */
	protected extractUpdateDataWithTransform(
		command: TCommand,
		transformer?: (data: Partial<TUpdateDto>) => Partial<TUpdateDto>,
		excludeFields: string[] = [],
	): TUpdateDto {
		this.logger.debug(
			`Extracting update data with transform from command: ${JSON.stringify(command)}`,
		);

		const extracted = this.extractUpdateData(command, excludeFields);

		if (transformer) {
			return transformer(extracted) as TUpdateDto;
		}

		return extracted;
	}
}
