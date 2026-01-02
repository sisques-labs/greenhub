import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CalculateMedianCommand } from '@/support/math/application/commands/calculate-median/calculate-median.command';
import { CalculateMedianService } from '@/support/math/application/services/calculate-median/calculate-median.service';

/**
 * Command handler for calculating median.
 *
 * @remarks
 * This handler executes the median calculation using the CalculateMedianService.
 */
@CommandHandler(CalculateMedianCommand)
export class CalculateMedianCommandHandler
	implements ICommandHandler<CalculateMedianCommand>
{
	private readonly logger = new Logger(CalculateMedianCommandHandler.name);

	constructor(
		private readonly calculateMedianService: CalculateMedianService,
	) {}

	/**
	 * Executes the calculate median command
	 *
	 * @param command - The command to execute
	 * @returns The calculated median
	 */
	async execute(command: CalculateMedianCommand): Promise<number> {
		this.logger.log(
			`Executing calculate median command for ${command.values.length} values`,
		);

		// 01: Calculate the median
		return this.calculateMedianService.execute(
			[...command.values],
			command.decimals,
		);
	}
}


