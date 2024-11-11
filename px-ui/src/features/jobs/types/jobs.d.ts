import {
  GetAllJobListingsQuery,
  GetRelatedJobListingsQuery,
} from "@gql/generated";

export type JobsListingsDataProps =
  | NonNullable<
      NonNullable<GetRelatedJobListingsQuery["getRelatedJobListings"]>
    >
  | NonNullable<
      NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
    >;

export type JobsDataPropsItem = NonNullable<
  NonNullable<JobsListingsDataProps>[number]
>;
