import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { APP_GQL_ENDPOINT, APP_GQL_WS_ENDPOINT } from "@constants/Properties";
import { createClient } from "graphql-ws";

const webSocketLink = new GraphQLWsLink(
  createClient({
    url: APP_GQL_WS_ENDPOINT,
    lazy: true,
  }),
);

const httpLink = createHttpLink({
  uri: APP_GQL_ENDPOINT,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  webSocketLink,
  httpLink,
);

const apolloGqlClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default apolloGqlClient;
