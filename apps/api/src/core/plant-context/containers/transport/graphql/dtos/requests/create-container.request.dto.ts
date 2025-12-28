import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateContainerRequestDto')
export class CreateContainerRequestDto {
  @Field(() => String, { description: 'The name of the container' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { description: 'The type of the container' })
  @IsEnum(ContainerTypeEnum)
  @IsNotEmpty()
  type: ContainerTypeEnum;
}
