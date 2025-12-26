import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeleteContainerRequestDto')
export class DeleteContainerRequestDto {
  @Field(() => String, { description: 'The id of the container to delete' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
