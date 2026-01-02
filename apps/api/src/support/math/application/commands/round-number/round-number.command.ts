import { IRoundNumberCommandDto } from '@/support/math/application/dtos/commands/round-number/round-number-command.dto';

/**
 * Command for rounding number.
 *
 * @remarks
 * This command encapsulates the data needed to round a number
 * to specified decimal places.
 */
export class RoundNumberCommand {
	readonly value: number;
	readonly decimals: number;

	constructor(props: IRoundNumberCommandDto) {
		this.value = props.value;
		this.decimals = props.decimals ?? 2;
	}
}


