import { SagaInstanceStatusEnum } from '@/generic/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepStatusEnum } from '@/generic/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { registerEnumType } from '@nestjs/graphql';

/**
 * Registers shared GraphQL enums and enums from modules that haven't yet moved to their own registration files.
 *
 * @remarks
 * Each module should register its own enums in its own module file.
 * This file should only contain:
 * - Shared enums (FilterOperator, SortDirection)
 * - Enums from modules that haven't yet been migrated to their own registration files
 *
 * TODO: Move UserRoleEnum and UserStatusEnum to user module
 * TODO: Move SagaInstanceStatusEnum, SagaStepStatusEnum, and SagaLogTypeEnum to their respective saga modules
 */
const registeredEnums = [
  // Shared enums
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
  // User module enums (TODO: Move to user module)
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
  // Saga module enums (TODO: Move to saga modules)
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
