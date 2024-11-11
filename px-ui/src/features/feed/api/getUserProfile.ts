import { useGetUserProfileQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";

export const useGetUserProfile = (profileSlug: string) =>
  useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: profileSlug,
    },
    {
      enabled: !!profileSlug,
      suspense: true,
    },
  );
