import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType('PlantChangeStatusRequestDto')
export class PlantChangeStatusRequestDto {
  @Field(() => String, { description: 'The id of the plant' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { description: 'The new status of the plant' })
  @IsEnum(PlantStatusEnum)
  @IsNotEmpty()
  status: PlantStatusEnum;
}
