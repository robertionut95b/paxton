export interface LoginUserMutationResponseP {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface AccessTokenDecode {
  userId: number;
  exp: number;
  resource_access: {
    "px-ui": {
      roles: string[];
    };
  };
  user_profile: string;
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
