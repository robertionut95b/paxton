import Roles from "@features/auth/types/roles";

export type User = {
  roles: Roles[];
  permissions: string[];
  userId: number;
  username: string;
  sessionTime: number;
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
  profileId: number;
  isEmailConfirmed: boolean;
};
