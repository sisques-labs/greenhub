import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";

@InputType("PlantTransplantRequestDto")
export class PlantTransplantRequestDto {
	@Field(() => String, {
		description:
			"The id of the growing unit from which the plant will be transplanted",
	})
	@IsUUID()
	@IsNotEmpty()
	sourceGrowingUnitId: string;

	@Field(() => String, {
		description:
			"The id of the growing unit to which the plant will be transplanted",
	})
	@IsUUID()
	@IsNotEmpty()
	targetGrowingUnitId: string;

	@Field(() => String, {
		description: "The id of the plant to be transplanted",
	})
	@IsUUID()
	@IsNotEmpty()
	plantId: string;
}
