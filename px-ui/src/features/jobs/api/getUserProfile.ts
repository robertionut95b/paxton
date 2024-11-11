import { useGetUserProfileQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";

export const useGetUserProfile = (profileSlugUrl: string) =>
  useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl,
    },
    {
      suspense: true,
    },
  );
