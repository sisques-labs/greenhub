import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CalculatePercentageCommand } from '@/support/math/application/commands/calculate-percentage/calculate-percentage.command';
import { CalculatePercentageService } from '@/support/math/application/services/calculate-percentage/calculate-percentage.service';

/**
 * Command handler for calculating percentage.
 *
 * @remarks
 * This handler executes the percentage calculation using the CalculatePercentageService.
 */
@CommandHandler(CalculatePercentageCommand)
export class CalculatePercentageCommandHandler
	implements ICommandHandler<CalculatePercentageCommand>
{
	private readonly logger = new Logger(CalculatePercentageCommandHandler.name);

	constructor(
		private readonly calculatePercentageService: CalculatePercentageService,
	) {}

	/**
	 * Executes the calculate percentage command
	 *
	 * @param command - The command to execute
	 * @returns The calculated percentage
	 */
	async execute(command: CalculatePercentageCommand): Promise<number> {
		this.logger.log(
			`Executing calculate percentage command: ${command.value} / ${command.total}`,
		);

		// 01: Calculate the percentage
		return this.calculatePercentageService.execute(
			command.value,
			command.total,
			command.decimals,
		);
	}
}

