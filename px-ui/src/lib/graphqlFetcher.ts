import { APP_GQL_ENDPOINT } from "@constants/Properties";
import { api } from "./axiosClient";

const graphqlFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  return async () => {
    const result = await api.post(APP_GQL_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
        ...(options ?? {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (result.data) {
      // @ts-expect-error(types-error)
      const message = result.errors
        ? // @ts-expect-error(types-error)
          result.errors[0].message
        : "GraphQL fetching error";
      throw new Error(message);
    }

    return result.data;
  };
};
