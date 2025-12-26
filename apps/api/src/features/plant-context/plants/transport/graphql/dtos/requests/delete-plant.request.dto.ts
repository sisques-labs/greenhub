import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeletePlantRequestDto')
export class DeletePlantRequestDto {
  @Field(() => String, { description: 'The id of the plant' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
