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

export interface AccessTokenDecode {
  iss: string;
  iat: number;
  exp: number;
  sub: string;
  nbf: number;
  aud: string;
  jti: string;
  authorities: string;
  roles: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileId: number;
  profileSlugUrl: string;
  email: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  isAdmin: boolean;
}

export interface CurrentUserMutationResponse {
  username: string;
  sessionTime: number;
  permissions: string[];
  firstName: string;
  lastName: string;
  profileSlugUrl: string;
}
