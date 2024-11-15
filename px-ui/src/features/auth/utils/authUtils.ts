import {
  authStore,
  authStoreErrorState,
} from "@features/auth/stores/authStore";
import { AccessTokenDecode } from "@features/auth/types/auth";
import Roles from "@features/auth/types/roles";
import type { User } from "@interfaces/user";
import { api } from "@lib/axiosClient";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import jwtDecode from "jwt-decode";

const userDecodeToUser = (userDecode: AccessTokenDecode): User => {
  return {
    userId: userDecode.userId,
    firstName: userDecode.firstName,
    lastName: userDecode.lastName,
    permissions: userDecode.authorities.split(","),
    roles: userDecode.roles
      .split(",")
      .map((r) => Roles[r as keyof typeof Roles]),
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
  authStore.getState().setIsRefreshing(false);
};

export const resetAuthStateOnErr = () =>
  authStore.setState(() => authStoreErrorState);
