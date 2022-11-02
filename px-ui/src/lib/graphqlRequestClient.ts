import { GraphQLClient } from "graphql-request";
import Cookies from "js-cookie";

const GRAPHQL_ENDPOINT = "http://localhost:8080/graphql";

const graphqlRequestClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
  mode: "cors",
  headers: () => ({ "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "" }),
});

export default graphqlRequestClient;
