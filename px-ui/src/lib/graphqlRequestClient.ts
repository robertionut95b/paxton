import { refreshLogin } from "@auth/authApi";
import { APP_GQL_ENDPOINT } from "@constants/Properties";
import { GraphQLClient } from "graphql-request";
import { Response } from "graphql-request/dist/types";

const unauthenticatedMiddleware = (response: Response<unknown> | Error) => {
  console.log("middleware");
  if (response instanceof Error) {
    console.error(response);
  } else {
    if (response.errors) {
      refreshLogin();
    }
  }
};

const graphqlRequestClient = new GraphQLClient(APP_GQL_ENDPOINT, {
  mode: "cors",
  responseMiddleware: unauthenticatedMiddleware,
});

export default graphqlRequestClient;
