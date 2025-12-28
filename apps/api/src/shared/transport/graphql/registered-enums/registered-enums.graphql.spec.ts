import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

// Import the module to trigger enum registration
import './registered-enums.graphql';

describe('registered-enums.graphql', () => {
  it('should be able to import the module without errors', () => {
    // The module is already imported at the top level
    // This test verifies that the import doesn't throw
    expect(true).toBe(true);
  });

  it('should have FilterOperator enum defined', () => {
    expect(FilterOperator).toBeDefined();
    expect(typeof FilterOperator).toBe('object');
  });

  it('should have SortDirection enum defined', () => {
    expect(SortDirection).toBeDefined();
    expect(typeof SortDirection).toBe('object');
  });

  it('should have UserRoleEnum defined', () => {
    expect(UserRoleEnum).toBeDefined();
    expect(typeof UserRoleEnum).toBe('object');
  });

  it('should have UserStatusEnum defined', () => {
    expect(UserStatusEnum).toBeDefined();
    expect(typeof UserStatusEnum).toBe('object');
  });

  it('should export all required enums', () => {
    // Verify that all enums are objects (enum types in TypeScript)
    const enums = [FilterOperator, SortDirection, UserRoleEnum, UserStatusEnum];

    enums.forEach((enumType) => {
      expect(enumType).toBeDefined();
      expect(typeof enumType).toBe('object');
    });
  });
});
