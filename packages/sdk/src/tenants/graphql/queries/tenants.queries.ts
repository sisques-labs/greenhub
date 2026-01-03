export const TENANT_FIND_BY_CRITERIA_QUERY = `
  query TenantsFindByCriteria($input: TenantFindByCriteriaRequestDto) {
    tenantsFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        clerkId
        name
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const TENANT_FIND_BY_ID_QUERY = `
  query TenantFindById($input: TenantFindByIdRequestDto!) {
    tenantFindById(input: $input) {
      id
      clerkId
      name
      status
      createdAt
      updatedAt
    }
  }
`;

