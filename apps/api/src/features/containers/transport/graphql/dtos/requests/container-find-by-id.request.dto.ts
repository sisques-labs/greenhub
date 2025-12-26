import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('ContainerFindByIdRequestDto')
export class ContainerFindByIdRequestDto {
  @Field(() => String, { description: 'The id of the container to find' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
