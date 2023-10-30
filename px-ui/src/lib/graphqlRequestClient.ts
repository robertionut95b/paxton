import { refreshLogin } from "@auth/authApi";
import { authStore } from "@auth/authStore";
import { resetAuthStateOnErr } from "@auth/authUtils";
import { APP_GQL_ENDPOINT } from "@constants/Properties";
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
