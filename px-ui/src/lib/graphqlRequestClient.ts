import { APP_GQL_ENDPOINT } from "@config/Properties";
import { refreshLogin } from "@features/auth/api/authApi";
import { authStore } from "@features/auth/stores/authStore";
import { resetAuthStateOnErr } from "@features/auth/utils/authUtils";
import { GraphQLClient, ResponseMiddleware } from "graphql-request";

const responseMiddleware: ResponseMiddleware = async (response) => {
  // @ts-expect-error("types-check")
  if (response?.response?.status === 401) {
    // set a lock mechanism
    if (authStore.getState().isRefreshing === true) return;
    authStore.setState(() => ({ isRefreshing: true }));
    // trigger refresh login
    try {
      await refreshLogin();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      resetAuthStateOnErr();
    }
  }
};

const graphqlRequestClient = new GraphQLClient(APP_GQL_ENDPOINT, {
  mode: "cors",
  responseMiddleware,
});

export default graphqlRequestClient;
