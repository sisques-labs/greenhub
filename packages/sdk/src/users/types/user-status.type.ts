export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'BLOCKED'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];
