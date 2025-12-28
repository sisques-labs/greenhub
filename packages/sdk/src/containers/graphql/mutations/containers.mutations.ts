export const CONTAINER_CREATE_MUTATION = `
  mutation CreateContainer($input: CreateContainerRequestDto!) {
    createContainer(input: $input) {
      success
      message
      id
    }
  }
`;

export const CONTAINER_UPDATE_MUTATION = `
  mutation UpdateContainer($input: UpdateContainerRequestDto!) {
    updateContainer(input: $input) {
      success
      message
      id
    }
  }
`;

export const CONTAINER_DELETE_MUTATION = `
  mutation DeleteContainer($input: DeleteContainerRequestDto!) {
    deleteContainer(input: $input) {
      success
      message
      id
    }
  }
`;
