import { useGetMyApplicationForJobListingQuery } from "@gql/generated";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";

export const useGetMyJobListingApplication = (
  jobId?: number,
  isAllowedToCandidate?: boolean,
) =>
  useGetMyApplicationForJobListingQuery(
    graphqlRequestClient,
    {
      JobListingId: jobId as number,
    },
    {
      enabled: !isAllowedToCandidate && !!jobId,
      onError: (err: GraphqlApiResponse) => {
        if (err.response.errors?.[0].message.includes("does not exist")) {
          //pass
        }
      },
    },
  );
