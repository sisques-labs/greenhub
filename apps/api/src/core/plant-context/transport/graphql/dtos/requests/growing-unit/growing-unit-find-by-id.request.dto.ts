import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('GrowingUnitFindByIdRequestDto')
export class GrowingUnitFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the growing unit to find',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
