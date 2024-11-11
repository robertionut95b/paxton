import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { APP_GQL_ENDPOINT } from "@config/Properties";
import { authStore } from "@features/auth/stores/authStore";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = authStore.getState().accessToken;
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      "Apollo-Require-Preflight": "true",
    },
  });
  return forward(operation);
});

export const graphqlUploadClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(
    authMiddleware,
    createUploadLink({
      uri: APP_GQL_ENDPOINT,
      credentials: "same-origin",
    }),
  ),
});
