/**
 * User GraphQL Queries
 */

export const USER_FIND_BY_ID_QUERY = `
  query UserFindById($input: UserFindByIdInput!) {
    userFindById(input: $input) {
      userId
      name
      lastName
      userName
      bio
      email
      role
      status
      avatarUrl
      phoneNumber
      phoneNumberVerified
      emailVerified
      twoFactorEnabled
      lastLogin
      createdAt
      updatedAt
    }
  }
`;
