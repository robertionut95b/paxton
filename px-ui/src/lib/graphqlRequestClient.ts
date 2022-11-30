import { APP_GQL_ENDPOINT } from "@constants/Properties";
import { GraphQLClient } from "graphql-request";

const graphqlRequestClient = new GraphQLClient(APP_GQL_ENDPOINT, {
  mode: "cors",
});

export default graphqlRequestClient;
