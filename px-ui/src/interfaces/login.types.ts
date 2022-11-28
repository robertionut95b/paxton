export interface LoginUserMutationProps {
  username: string;
  password: string;
}

export interface LoginUserMutationResponseP {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface CurrentUserMutationResponse {
  username: string;
  sessionTime: number;
  permissions: string[];
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
}
