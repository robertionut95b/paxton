export interface User {
  permissions: string[];
  username: string;
  sessionTime: number;
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
  profileId: number;
  isEmailConfirmed: boolean;
}
