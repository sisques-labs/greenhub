import { ICalculatePercentageCommandDto } from '@/support/math/application/dtos/commands/calculate-percentage/calculate-percentage-command.dto';

/**
 * Command for calculating percentage.
 *
 * @remarks
 * This command encapsulates the data needed to calculate a percentage
 * from a value and total.
 */
export class CalculatePercentageCommand {
	readonly value: number;
	readonly total: number;
	readonly decimals: number;

	constructor(props: ICalculatePercentageCommandDto) {
		this.value = props.value;
		this.total = props.total;
		this.decimals = props.decimals ?? 2;
	}
}

