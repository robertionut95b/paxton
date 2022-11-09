export interface LoginUserMutationProps {
  username: string;
  password: string;
}

export interface LoginUserMutationResponse {
  username: string;
  sessionTime: number;
  permissions: string[];
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
}
