/**
 * User GraphQL Mutations
 */

export const USER_UPDATE_MUTATION = `
  mutation UserUpdate($input: UpdateUserInput!) {
    userUpdate(input: $input) {
      success
      message
    }
  }
`;
