import { API_PAGINATION_SIZE } from "@config/Properties";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetRelatedJobListingsQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";
import { formatISO } from "date-fns/formatISO";

const todayIsoFmt = formatISO(new Date());

export const useGetJobListings = (cityId?: string) =>
  useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
        filters: [
          {
            key: "availableTo",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.GreaterThan,
          },
          {
            key: "availableFrom",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.LessThanEqual,
          },
          ...(cityId
            ? [
                {
                  key: "city.id",
                  fieldType: FieldType.Long,
                  value: cityId,
                  operator: Operator.Equal,
                },
              ]
            : []),
        ],
        sorts: [
          {
            direction: SortDirection.Desc,
            key: "createdAt",
          },
        ],
      },
    },
    {
      keepPreviousData: true,
      staleTime: 1000 * 60,
      onSuccess: (data) => {
        if (data) {
          data.getAllJobListings?.list?.forEach((jl) =>
            queryClient.setQueryData(
              [
                "GetAllJobListings",
                {
                  searchQuery: {
                    filters: [
                      {
                        key: "id",
                        fieldType: FieldType.Long,
                        operator: Operator.Equal,
                        value: jl?.id.toString() as string,
                      },
                    ],
                  },
                },
              ],
              {
                getAllJobListings: {
                  list: [jl],
                },
                page: 0,
                totalElements: 1,
                totalPages: 1,
              },
            ),
          );
        }
      },
      suspense: true,
    },
  );

export const useGetJobListingById = (jobListingId: string) =>
  useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            key: "id",
            fieldType: FieldType.Long,
            operator: Operator.Equal,
            value: jobListingId,
          },
        ],
      },
    },
    { suspense: true },
  );

export const useGetRelatedJobListingsToJobName = (
  jobName?: string,
  currentJobId?: number,
) =>
  useGetRelatedJobListingsQuery(
    graphqlRequestClient,
    {
      jobName: jobName ?? "",
    },
    {
      enabled: !!jobName && !!currentJobId,
      select: (data) =>
        data.getRelatedJobListings?.filter((j) => j?.id !== currentJobId),
      suspense: true,
    },
  );
