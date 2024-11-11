import {
  FieldType,
  Operator,
  useApplyToJobListingMutation,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";

export const useApplyToJobListing = (JobListingId?: number) =>
  useApplyToJobListingMutation(graphqlRequestClient, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "GetMyApplicationForJobListing",
        {
          JobListingId: JobListingId,
        },
      ]);
      queryClient.invalidateQueries([
        "GetAllJobListings",
        {
          searchQuery: {
            filters: [
              {
                key: "id",
                fieldType: FieldType.Long,
                operator: Operator.Equal,
                value: JobListingId,
              },
            ],
          },
        },
      ]);
    },
  });
