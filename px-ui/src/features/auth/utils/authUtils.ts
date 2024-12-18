import { Routes } from "@app/routes";
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
import { OidcStandardClaims, User as OidcUser } from "oidc-client-ts";
import { LoaderFunction, LoaderFunctionArgs, redirect } from "react-router-dom";
import { userManager } from "../providers/AppAuthProvider";

const userDecodeToUser = (
  decodedJwt: OidcStandardClaims & AccessTokenDecode,
): User => {
  return {
    // @ts-expect-error("types")
    userId: decodedJwt.sub ?? "",
    firstName: decodedJwt.given_name ?? "Unknown",
    lastName: decodedJwt.family_name ?? "Unknown",
    roles: decodedJwt.resource_access["px-ui"].roles
      .map((r) => r)
      .map((r) => Roles[r as keyof typeof Roles]),
    profileSlugUrl: decodedJwt.user_profile,
    sessionTime: decodedJwt.exp,
    username: decodedJwt.preferred_username ?? "unknown",
    isEmailConfirmed: decodedJwt.email_verified ?? false,
  };
};

export const setAuthenticationByAccessToken = (accessToken: string) => {
  const bearer = `Bearer ${accessToken}`;
  api.defaults.headers.Authorization = bearer;
  graphqlRequestClient.setHeader("Authorization", bearer);
};

export const setUserByToken = (accessToken: string) => {
  // update user store
  const decodedAccessToken: AccessTokenDecode = jwtDecode(accessToken);
  // set user instance
  const userMeta = userDecodeToUser(decodedAccessToken);
  authStore.getState().setUser(userMeta);
  authStore.getState().setUserLoading(false);
};

export const resetAuthStateOnErr = () =>
  authStore.setState(() => authStoreErrorState);

export const getUserFromStorage = () => {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${import.meta.env.VITE_AUTHORITY}:${import.meta.env.VITE_CLIENT_ID}`,
  );
  if (!oidcStorage) {
    return null;
  }

  return OidcUser.fromStorageString(oidcStorage);
};

export const loaderAuthGuard =
  <T extends LoaderFunction>(load?: T): LoaderFunction<T> =>
  async (args: LoaderFunctionArgs) => {
    const user = getUserFromStorage();
    if (user?.access_token) {
      return load ? await load(args, user) : null;
    } else {
      const auth = await userManager.signinSilent();
      if (!auth?.access_token) throw redirect(Routes.Login.path);
    }
  };
