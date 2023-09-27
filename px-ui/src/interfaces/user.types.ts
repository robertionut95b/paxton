import RoleType from "@auth/RoleType";

export interface User {
  roles: RoleType[];
  permissions: string[];
  userId: number;
  username: string;
  sessionTime: number;
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
  profileId: number;
  isEmailConfirmed: boolean;
}
