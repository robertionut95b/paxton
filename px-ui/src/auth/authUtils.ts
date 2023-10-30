import { AccessTokenDecode } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { api } from "@lib/axiosClient";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import jwtDecode from "jwt-decode";
import RoleType from "./RoleType";
import { authStore } from "./authStore";

export const userDecodeToUser = (userDecode: AccessTokenDecode): User => {
  return {
    userId: userDecode.userId,
    firstName: userDecode.firstName,
    lastName: userDecode.lastName,
    permissions: userDecode.authorities.split(","),
    roles: userDecode.roles
      .split(",")
      .map((r) => RoleType[r as keyof typeof RoleType]),
    profileSlugUrl: userDecode.profileSlugUrl,
    sessionTime: userDecode.exp,
    username: userDecode.sub,
    profileId: userDecode.profileId,
    isEmailConfirmed: userDecode.isEmailConfirmed,
  };
};

export const setAuthenticationByAccessToken = (accessToken: string) => {
  const bearer = `Bearer ${accessToken}`;
  api.defaults.headers.Authorization = bearer;
  graphqlRequestClient.setHeader("Authorization", bearer);
  authStore.getState().setAccessToken(accessToken);
};

export const setUserByToken = (accessToken: string) => {
  // update user store
  const decodedAccessToken: AccessTokenDecode = jwtDecode(accessToken);
  // set user instance
  const userMeta = userDecodeToUser(decodedAccessToken);
  authStore.getState().setUser(userMeta);
  const expiry = decodedAccessToken.exp * 1000 - new Date().getTime() - 1000;
  authStore.getState().setTokenExpiry(expiry);
  authStore.setState(() => ({ isRefreshing: false }));
};

export const resetAuthStateOnErr = () => {
  authStore.setState(() => ({
    isRefreshing: false,
    user: null,
    userLoading: false,
    accessToken: null,
    tokenExpiry: null,
  }));
};
