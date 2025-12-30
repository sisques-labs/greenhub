import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CalculateAverageCommand } from '@/support/math/application/commands/calculate-average/calculate-average.command';
import { CalculateAverageService } from '@/support/math/application/services/calculate-average/calculate-average.service';
import { Logger } from '@nestjs/common';

/**
 * Command handler for calculating average.
 *
 * @remarks
 * This handler executes the average calculation using the CalculateAverageService.
 */
@CommandHandler(CalculateAverageCommand)
export class CalculateAverageCommandHandler
  implements ICommandHandler<CalculateAverageCommand>
{
  private readonly logger = new Logger(CalculateAverageCommandHandler.name);

  constructor(
    private readonly calculateAverageService: CalculateAverageService,
  ) {}

  /**
   * Executes the calculate average command
   *
   * @param command - The command to execute
   * @returns The calculated average
   */
  async execute(command: CalculateAverageCommand): Promise<number> {
    this.logger.log(
      `Executing calculate average command for ${command.values.length} values`,
    );

    // 01: Calculate the average
    return this.calculateAverageService.execute(
      [...command.values],
      command.decimals,
    );
  }
}
