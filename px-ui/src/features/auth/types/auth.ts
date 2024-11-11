export interface LoginUserMutationProps {
  username: string;
  password: string;
}

export interface LoginUserByTokenMutationProps {
  token: string;
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
  userId: number;
  firstName: string;
  lastName: string;
  profileId: number;
  profileSlugUrl: string;
  email: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  isAdmin: boolean;
}

export interface ResetPasswordRequestProps {
  email: string;
}

export interface ResetPasswordProps {
  body: {
    newPassword: string;
    confirmPassword: string;
  };
  token: string;
}

export interface SignupUserMutationProps {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
