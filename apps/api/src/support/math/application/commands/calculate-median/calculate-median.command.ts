import { ICalculateMedianCommandDto } from "@/support/math/application/dtos/commands/calculate-median/calculate-median-command.dto";

/**
 * Command for calculating median.
 *
 * @remarks
 * This command encapsulates the data needed to calculate the median value
 * from an array of numbers.
 */
export class CalculateMedianCommand {
	readonly values: readonly number[];
	readonly decimals: number;

	constructor(props: ICalculateMedianCommandDto) {
		this.values = props.values;
		this.decimals = props.decimals ?? 2;
	}
}
