import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('UpdateContainerRequestDto')
export class UpdateContainerRequestDto {
  @Field(() => String, { description: 'The id of the container' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the container',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The type of the container',
    nullable: true,
  })
  @IsEnum(ContainerTypeEnum)
  @IsOptional()
  type?: ContainerTypeEnum;
}
