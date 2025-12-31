import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CalculateAverageCommandHandler } from "@/support/math/application/commands/calculate-average/calculate-average.command-handler";
import { CalculateMedianCommandHandler } from "@/support/math/application/commands/calculate-median/calculate-median.command-handler";
import { CalculatePercentageCommandHandler } from "@/support/math/application/commands/calculate-percentage/calculate-percentage.command-handler";
import { RoundNumberCommandHandler } from "@/support/math/application/commands/round-number/round-number.command-handler";
import { CalculateAverageService } from "@/support/math/application/services/calculate-average/calculate-average.service";
import { CalculateMedianService } from "@/support/math/application/services/calculate-median/calculate-median.service";
import { CalculatePercentageService } from "@/support/math/application/services/calculate-percentage/calculate-percentage.service";
import { RoundNumberService } from "@/support/math/application/services/round-number/round-number.service";

const SERVICES = [
	CalculatePercentageService,
	CalculateAverageService,
	CalculateMedianService,
	RoundNumberService,
];

const COMMAND_HANDLERS = [
	CalculatePercentageCommandHandler,
	CalculateAverageCommandHandler,
	CalculateMedianCommandHandler,
	RoundNumberCommandHandler,
];

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...SERVICES, ...COMMAND_HANDLERS],
	exports: [...SERVICES, ...COMMAND_HANDLERS],
})
export class MathModule {}
