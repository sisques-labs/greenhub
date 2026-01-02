import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RoundNumberCommand } from '@/support/math/application/commands/round-number/round-number.command';
import { RoundNumberService } from '@/support/math/application/services/round-number/round-number.service';

/**
 * Command handler for rounding number.
 *
 * @remarks
 * This handler executes the number rounding using the RoundNumberService.
 */
@CommandHandler(RoundNumberCommand)
export class RoundNumberCommandHandler
	implements ICommandHandler<RoundNumberCommand>
{
	private readonly logger = new Logger(RoundNumberCommandHandler.name);

	constructor(private readonly roundNumberService: RoundNumberService) {}

	/**
	 * Executes the round number command
	 *
	 * @param command - The command to execute
	 * @returns The rounded number
	 */
	async execute(command: RoundNumberCommand): Promise<number> {
		this.logger.log(
			`Executing round number command: ${command.value} to ${command.decimals} decimals`,
		);

		// 01: Round the number
		return this.roundNumberService.execute(command.value, command.decimals);
	}
}


