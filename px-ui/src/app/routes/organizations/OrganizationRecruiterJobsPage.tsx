import PaginationToolbar from "@components/ui/pagination/PaginationToolbar";
import { API_PAGINATION_SIZE } from "@config/Properties";
import JobListingsList from "@features/jobs/components/JobListingsList";
import { FieldType, Operator, useGetAllJobListingsQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Center, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

const OrganizationRecruiterJobsPage = () => {
  const { recruiterId } = useParams();
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(API_PAGINATION_SIZE ?? 5);

  const { data: jobsData, isLoading: jobsIsLoading } =
    useGetAllJobListingsQuery(graphqlRequestClient, {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
        filters: [
          {
            fieldType: FieldType.Long,
            key: "recruiter.id",
            operator: Operator.Equal,
            value: recruiterId as string,
          },
        ],
      },
    });

  if (jobsIsLoading)
    return (
      <Paper p="md" shadow="xs">
        <Center>
          <Loader size="sm" />
        </Center>
      </Paper>
    );

  if (
    !jobsData?.getAllJobListings ||
    jobsData?.getAllJobListings?.totalElements === 0
  )
    return (
      <Paper p="md" shadow="xs">
        <Title order={5}>Jobs by recruiter</Title>
        <Text mt="sm" size="sm">
          Nothing found here
        </Text>
      </Paper>
    );

  const jobs = jobsData?.getAllJobListings?.list ?? [];
  const totalElements = jobsData?.getAllJobListings?.totalElements ?? 0;
  const totalPages = jobsData?.getAllJobListings?.totalPages ?? 0;

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Title order={5}>Jobs by recruiter</Title>
      </Stack>
      <JobListingsList jobs={jobs} />
      <Paper className="px-jobs-pagination">
        <PaginationToolbar
          page={p}
          setPage={setP}
          pageSize={ps}
          setPageSize={setPs}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </Paper>
    </Paper>
  );
};

export default OrganizationRecruiterJobsPage;
