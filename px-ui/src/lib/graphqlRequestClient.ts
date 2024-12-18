import { APP_GQL_ENDPOINT } from "@config/Properties";
import { userManager } from "@features/auth/providers/AppAuthProvider";
import { authStore } from "@features/auth/stores/authStore";
import {
  getUserFromStorage,
  resetAuthStateOnErr,
  setAuthenticationByAccessToken,
  setUserByToken,
} from "@features/auth/utils/authUtils";
import { GraphQLClient, ResponseMiddleware } from "graphql-request";

const responseMiddleware: ResponseMiddleware = async (response) => {
  // @ts-expect-error("types-check")
  if (response?.response?.status === 401) {
    // set a lock mechanism
    if (authStore.getState().userLoading === true) return;
    authStore.setState(() => ({ userLoading: true }));
    // trigger refresh login
    try {
      const user = await userManager.signinSilent();
      if (user) {
        setAuthenticationByAccessToken(user?.access_token);
        setUserByToken(user.access_token);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      resetAuthStateOnErr();
    }
  }
};

const graphqlRequestClient = new GraphQLClient(APP_GQL_ENDPOINT, {
  mode: "cors",
  responseMiddleware,
  headers: {
    // this works whenever we have an auth loader active
    Authorization: "Bearer " + getUserFromStorage()?.access_token,
  },
});

export default graphqlRequestClient;
