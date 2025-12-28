export const AUTH_PROFILE_ME_QUERY = `
  query AuthProfileMe {
    authProfileMe {
      userId
      authId
      email
      emailVerified
      lastLoginAt
      phoneNumber
      provider
      providerId
      twoFactorEnabled
      userName
      name
      lastName
      bio
      avatarUrl
      role
      status
      createdAt
      updatedAt
    }
  }
`;
