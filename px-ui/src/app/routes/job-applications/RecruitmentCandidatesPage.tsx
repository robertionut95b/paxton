import { Routes } from "@app/routes";
import NotFoundPage from "@app/routes/NotFoundPage";
import AccessDenied from "@components/errors/AccessDenied";
import Breadcrumbs from "@components/ui/navigation/Breadcrumbs";
import BlocksLoadingSkeleton from "@components/ui/spinners/BlocksLoadingSkeleton";
import ApplicationJobHero from "@features/job-applications/components/ApplicationJobHero";
import ApplicationRecordCard from "@features/job-applications/components/CandidateRecordCard";
import UnassignedProcessBanner from "@features/recruitment-process/components/UnassignedProcessBanner";
import {
  FieldType,
  Operator,
  useGetAllApplicationsQuery,
  useGetAllJobListingsQuery,
  useGetApplicationsForJobIdCountByStepsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { GraphqlApiResponse, isGraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Badge, Divider, Paper, Stack, Tabs, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Else, If, Then, When } from "react-if";
import { useParams } from "react-router-dom";

const RecruitmentCandidatesPage = () => {
  const { organizationSlug, jobId } = useParams();
  const [tabValue, setTabValue] = useState<string | null>("all");
  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      },
    );
  const {
    data: applicationsData,
    isLoading: isApplicationLoading,
    isError: isApplicationError,
    error,
  } = useGetAllApplicationsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "jobListing.id",
            operator: Operator.Equal,
            value: jobId as string,
          },
        ],
      },
    },
    {
      enabled: !!jobId,
      onError: (error: GraphqlApiResponse) => {
        if (
          error.response.errors?.[0].message
            .toLowerCase()
            .includes("access is denied")
        ) {
          showNotification({
            title: "Unauthorized access",
            message: "Access is denied to this resource",
            autoClose: 5000,
            icon: <ShieldExclamationIcon width={20} />,
          });
        }
      },
    },
  );
  const { data: jobListingData, isLoading: isJobListingLoading } =
    useGetAllJobListingsQuery(graphqlRequestClient, {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "id",
            operator: Operator.Equal,
            value: jobId as string,
          },
        ],
      },
    });
  const {
    data: applicationsByStepCountData,
    isInitialLoading: isApplicationsByStepCountLoading,
  } = useGetApplicationsForJobIdCountByStepsQuery(graphqlRequestClient, {
    jobId: Number(jobId),
  });
  const {
    data: applicationByStepTitleData,
    isInitialLoading: isApplicationByStepTitleLoading,
  } = useGetAllApplicationsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "jobListing.id",
            operator: Operator.Equal,
            value: jobId as string,
          },
          {
            fieldType: FieldType.String,
            key: "currentStep.step.title",
            operator: Operator.Equal,
            value: tabValue as string,
          },
        ],
      },
    },
    {
      enabled: tabValue !== "all",
    },
  );

  if (
    isLoadingOrganization ||
    isApplicationLoading ||
    isJobListingLoading ||
    isApplicationsByStepCountLoading ||
    isApplicationByStepTitleLoading
  )
    return <BlocksLoadingSkeleton />;
  if (!organization?.getOrganizationBySlugName) return <NotFoundPage />;
  if (
    !jobListingData?.getAllJobListings ||
    !jobListingData.getAllJobListings.list ||
    jobListingData.getAllJobListings.list.length === 0
  )
    return <NotFoundPage />;
  if (!jobListingData.getAllJobListings.list?.[0]) return <NotFoundPage />;

  const { title, contractType, availableFrom, isActive, availableTo } =
    jobListingData.getAllJobListings.list[0];

  if (isApplicationError) {
    if (
      isGraphqlApiResponse(error) &&
      error.response.errors?.[0].message
        .toLowerCase()
        .includes("access is denied")
    ) {
      return <AccessDenied />;
    }
  }

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={[Routes.Organizations.Details.Recruitment.path]}
        />
      </Paper>
      <ApplicationJobHero
        jobTitle={title}
        viewUrl={Routes.Jobs.View.Details.buildPath({
          jobId: Number(jobId),
        })}
        editUrl={Routes.Organizations.Details.Jobs.Update.buildPath({
          organizationSlug: organizationSlug as string,
          jobListingId: jobId as string,
        })}
        jobIsActive={isActive ?? false}
        contractType={contractType}
        availableFrom={availableFrom}
        availableTo={availableTo}
      />
      <When
        condition={!organization.getOrganizationBySlugName.recruitmentProcess}
      >
        <UnassignedProcessBanner />
      </When>
      <Paper shadow={"xs"} p="md" className="px-candidates">
        <Title mb="xs" order={4}>
          Candidates
        </Title>
        <Tabs defaultValue="all" value={tabValue} onTabChange={setTabValue}>
          <Tabs.List>
            <Tabs.Tab
              value="all"
              rightSection={
                <Badge
                  sx={{ width: 16, height: 16, pointerEvents: "none" }}
                  variant="light"
                  size="xs"
                  p={0}
                >
                  {applicationsData?.getAllApplications?.totalElements}
                </Badge>
              }
            >
              All
            </Tabs.Tab>
            {(
              applicationsByStepCountData?.getApplicationsForJobIdCountBySteps ??
              []
            ).map(
              (ap) =>
                ap && (
                  <Tabs.Tab
                    key={ap.stepTitle}
                    value={ap.stepTitle}
                    rightSection={
                      <Badge
                        sx={{ width: 16, height: 16, pointerEvents: "none" }}
                        variant="light"
                        size="xs"
                        p={0}
                      >
                        {ap.applicationsCount}
                      </Badge>
                    }
                  >
                    {ap.stepTitle}
                  </Tabs.Tab>
                ),
            )}
          </Tabs.List>
          <Tabs.Panel value="all">
            <If
              condition={
                (applicationsData?.getAllApplications?.list?.length ?? 0) > 0
              }
            >
              <Then>
                {applicationsData?.getAllApplications?.list?.map(
                  (a, idx) =>
                    a && (
                      <div key={a.id} className="mt-4">
                        <ApplicationRecordCard application={a} />
                        {idx !==
                          (applicationsData.getAllApplications?.list?.length ??
                            1) -
                            1 && <Divider mt="sm" />}
                      </div>
                    ),
                )}
              </Then>
              <Else>
                <Text mt="xs">No candidates yet</Text>
              </Else>
            </If>
          </Tabs.Panel>
          {(
            applicationsByStepCountData?.getApplicationsForJobIdCountBySteps ??
            []
          ).map(
            (ap) =>
              ap && (
                <Tabs.Panel key={ap.stepTitle} value={ap.stepTitle}>
                  <If
                    condition={
                      (applicationsData?.getAllApplications?.list?.length ??
                        0) > 0
                    }
                  >
                    <Then>
                      {applicationByStepTitleData?.getAllApplications?.list?.map(
                        (a, idx) =>
                          a && (
                            <div key={a.id} className="mt-4">
                              <ApplicationRecordCard application={a} />
                              {idx !==
                                (applicationByStepTitleData.getAllApplications
                                  ?.list?.length ?? 1) -
                                  1 && <Divider mt="sm" />}
                            </div>
                          ),
                      )}
                    </Then>
                    <Else>
                      <Text mt="xs">No candidates yet</Text>
                    </Else>
                  </If>
                </Tabs.Panel>
              ),
          )}
        </Tabs>
      </Paper>
    </Stack>
  );
};

export default RecruitmentCandidatesPage;
