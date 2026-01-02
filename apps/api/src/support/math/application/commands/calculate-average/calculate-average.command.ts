import { ICalculateAverageCommandDto } from '@/support/math/application/dtos/commands/calculate-average/calculate-average-command.dto';

/**
 * Command for calculating average.
 *
 * @remarks
 * This command encapsulates the data needed to calculate the arithmetic mean
 * from an array of numbers.
 */
export class CalculateAverageCommand {
	readonly values: readonly number[];
	readonly decimals: number;

	constructor(props: ICalculateAverageCommandDto) {
		this.values = props.values;
		this.decimals = props.decimals ?? 2;
	}
}


