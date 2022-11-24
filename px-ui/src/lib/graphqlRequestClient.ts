import { APP_GQL_ENDPOINT } from "@constants/Properties";
import { GraphQLClient } from "graphql-request";
import Cookies from "js-cookie";

const graphqlRequestClient = new GraphQLClient(APP_GQL_ENDPOINT, {
  credentials: "include",
  mode: "cors",
  headers: () => ({ "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "" }),
});

export default graphqlRequestClient;
