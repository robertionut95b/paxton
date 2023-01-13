import RoleType from "@auth/RoleType";

export interface User {
  permissions: string[] | RoleType[];
  userId: string;
  username: string;
  sessionTime: number;
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
  profileId: number;
  isEmailConfirmed: boolean;
}
