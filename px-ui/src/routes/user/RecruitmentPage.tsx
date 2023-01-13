import ApplicationRecordCard from "@components/candidates/CandidateRecordCard";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import OrganizationToolbar from "@components/organization/OrganizationToolbar";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  JobListing,
  Operator,
  useGetAllApplicationsQuery,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Divider, Grid, Paper, Text, Title } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import OrganizationJobsTab from "@routes/organization/OrganizationJobsTab";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function RecruitmentPage() {
  const { organizationId } = useParams();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationByIdQuery(
      graphqlRequestClient,
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );
  const { data: applicationsData } = useGetAllApplicationsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "jobListing",
            operator: Operator.Equal,
            value: selectedJobId ?? "",
          },
        ],
      },
    },
    {
      enabled: !!selectedJobId,
    }
  );

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationById) return <NotFoundPage />;

  const onItemClick = (jl: JobListing) => {
    setSelectedJobId(jl.id);
    return undefined;
  };

  return (
    <Grid>
      <Grid.Col span={12}>
        <Paper shadow={"xs"} p="xs">
          <Breadcrumbs />
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <OrganizationToolbar organization={organization.getOrganizationById} />
      </Grid.Col>
      <Grid.Col sm={5} span={12}>
        <Paper shadow={"xs"} p="md" className="px-organization-jobs">
          <Title mb={8} order={4}>
            Jobs in company
          </Title>
          <OrganizationJobsTab
            filters={[
              {
                key: "organization",
                fieldType: FieldType.Long,
                value: organizationId?.toString() ?? "0",
                operator: Operator.Equal,
              },
            ]}
            compactItems
            itemClickCb={(jl) => onItemClick(jl)}
          />
        </Paper>
      </Grid.Col>
      <Grid.Col sm={7} span={12}>
        <Paper shadow={"xs"} p="md" className="px-candidates">
          <Title mb={"md"} order={4}>
            Candidates
          </Title>
          <ShowIfElse
            if={!selectedJobId}
            else={
              applicationsData && (
                <>
                  {applicationsData.getAllApplications?.list?.map(
                    (a, idx) =>
                      a && (
                        <div key={a.id} className="mt-4">
                          <ApplicationRecordCard
                            candidate={a}
                            organizationId={organizationId ?? ""}
                          />
                          {idx !==
                            (applicationsData.getAllApplications?.list
                              ?.length ?? 1) -
                              1 && <Divider mt="sm" />}
                        </div>
                      )
                  )}
                </>
              )
            }
          >
            <Text size="sm">Select a job to show applicants</Text>
          </ShowIfElse>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
