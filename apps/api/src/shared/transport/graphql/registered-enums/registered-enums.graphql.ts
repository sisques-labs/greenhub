import { registerEnumType } from '@nestjs/graphql';
import { SagaInstanceStatusEnum } from '@/generic/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepStatusEnum } from '@/generic/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

// TODO: Move this, each module should register its own enums
const registeredEnums = [
  {
    enum: FilterOperator,
    name: 'FilterOperator',
    description: 'The operator to filter by',
  },
  {
    enum: SortDirection,
    name: 'SortDirection',
    description: 'The direction to sort by',
  },
  {
    enum: UserRoleEnum,
    name: 'UserRoleEnum',
    description: 'The role of the user',
  },
  {
    enum: UserStatusEnum,
    name: 'UserStatusEnum',
    description: 'The status of the user',
  },
  {
    enum: SagaInstanceStatusEnum,
    name: 'SagaInstanceStatusEnum',
    description: 'The status of the saga',
  },
  {
    enum: SagaStepStatusEnum,
    name: 'SagaStepStatusEnum',
    description: 'The status of the saga step',
  },
  {
    enum: SagaLogTypeEnum,
    name: 'SagaLogTypeEnum',
    description: 'The type of the saga log',
  },
];

for (const { enum: enumType, name, description } of registeredEnums) {
  registerEnumType(enumType, { name, description });
}
