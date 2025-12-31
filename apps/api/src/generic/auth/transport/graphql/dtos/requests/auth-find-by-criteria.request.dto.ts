import { InputType } from '@nestjs/graphql';
import { BaseFindByCriteriaInput } from '@/shared/transport/graphql/dtos/requests/base-find-by-criteria/base-find-by-criteria.input';

@InputType('AuthFindByCriteriaRequestDto')
export class AuthFindByCriteriaRequestDto extends BaseFindByCriteriaInput {}
