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
