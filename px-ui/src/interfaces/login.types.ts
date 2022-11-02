export interface LoginUserMutationProps {
  username: string;
  password: string;
}

export interface LoginUserMutationResponse {
  username: string;
  sessionTime: number;
  permissions: string[];
}
