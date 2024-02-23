import ApplicationJobHero from "@components/application/ApplicationJobHero";
import ApplicationRecordCard from "@components/candidates/CandidateRecordCard";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import UnassignedProcessBanner from "@components/process/UnassignedProcessBanner";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import {
  FieldType,
  Operator,
  useGetAllApplicationsQuery,
  useGetAllJobListingsQuery,
  useGetApplicationsForJobIdCountByStepsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import {
  GraphqlApiResponse,
  isGraphqlApiResponse,
} from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Badge, Divider, Paper, Stack, Tabs, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import AccessDenied from "@routes/AccessDenied";
import NotFoundPage from "@routes/NotFoundPage";
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
    return <GenericLoadingSkeleton />;
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
          excludePaths={["/app/organizations/:organizationId/recruitment/"]}
        />
      </Paper>
      <ApplicationJobHero
        jobTitle={title}
        viewUrl={`/app/jobs/view/${jobId}`}
        editUrl={`/app/organizations/${organizationSlug}/jobs/publish-job/form/${jobId}/update`}
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
