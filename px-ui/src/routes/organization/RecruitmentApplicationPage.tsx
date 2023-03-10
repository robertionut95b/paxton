import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import CandidateApplicationHero from "@components/candidates/CandidateApplicationHero";
import CandidateInformationSection from "@components/candidates/CandidateInformationSection";
import ApplicationCandidatureTimeline from "@components/jobs/job-page/ApplicationCandidatureTimeline";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import AttachmentItem from "@components/upload/AttachmentItem";
import AttachmentUpload from "@components/upload/AttachmentUpload";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  APP_API_BASE_URL,
  APP_API_PATH,
  APP_APPLICATION_DOCS_PATH,
  APP_IMAGES_API_PATH,
} from "@constants/Properties";
import {
  ApplicationStatus,
  FieldType,
  Operator,
  Status,
  useGetAllJobListingsQuery,
  useGetAllProcessesQuery,
  useGetApplicationForJobListingRecruitmentQuery,
  useGetOrganizationBySlugNameQuery,
  useGetUserProfileQuery,
  useUpdateApplicationMutation,
} from "@gql/generated";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Button,
  Grid,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import NotFoundPage from "@routes/NotFoundPage";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const RecruitmentApplicationPage = () => {
  const { user, isAuthorized, accessToken } = useAuth();
  const { jobId, organizationSlug } = useParams();
  const queryClient = useQueryClient();
  const { data: applicationData, isLoading } =
    useGetApplicationForJobListingRecruitmentQuery(
      graphqlRequestClient,
      {
        JobListingId: jobId ?? "",
      },
      {
        enabled: !!jobId,
      }
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
  const { data: currentUserProfile, isLoading: isLoadingCurrentProfile } =
    useGetUserProfileQuery(graphqlRequestClient, {
      profileSlugUrl: user?.profileSlugUrl ?? "",
    });
  const { data: organizationData, isLoading: isOrganizationLoading } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName:
          organizationSlug ??
          jobListingData?.getAllJobListings?.list?.[0]?.organization.slugName ??
          "",
      },
      {
        enabled:
          !!organizationSlug ||
          !!jobListingData?.getAllJobListings?.list?.[0]?.organization.slugName,
      }
    );
  const { data: processData, isInitialLoading: isProcessLoading } =
    useGetAllProcessesQuery(
      graphqlRequestClient,
      {
        searchQuery: {
          filters: [
            {
              fieldType: FieldType.Long,
              key: "id",
              operator: Operator.Equal,
              value:
                organizationData?.getOrganizationBySlugName?.recruitmentProcess
                  .id ?? "",
            },
          ],
        },
      },
      {
        enabled: !!organizationData && isAuthorized([RoleType.ROLE_RECRUITER]),
      }
    );
  const { mutate: updateApplication } = useUpdateApplicationMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Application update",
          message: "Successfully updated application status",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        queryClient.invalidateQueries(
          useGetApplicationForJobListingRecruitmentQuery.getKey({
            JobListingId: jobId ?? "",
          })
        );
      },
    }
  );

  if (
    isLoading ||
    isJobListingLoading ||
    isLoadingCurrentProfile ||
    isProcessLoading ||
    isOrganizationLoading
  )
    return <GenericLoadingSkeleton />;
  if (
    !applicationData?.getApplicationForJobListing ||
    !jobListingData?.getAllJobListings ||
    jobListingData.getAllJobListings.totalElements === 0
  )
    return <NotFoundPage />;
  if (
    !applicationData.getApplicationForJobListing ||
    !jobListingData.getAllJobListings.list?.[0]
  )
    return <NotFoundPage />;

  const candidate = applicationData.getApplicationForJobListing.candidate;
  const userProfile =
    applicationData.getApplicationForJobListing.applicantProfile;
  const jobListing = jobListingData.getAllJobListings.list[0];
  const currentStepProcesses =
    applicationData.getApplicationForJobListing.processSteps;
  const currentStepProcess =
    currentStepProcesses?.[currentStepProcesses.length - 1 ?? 0];
  const nextStepProcess = processData?.getAllProcesses?.list?.[0]?.processSteps;
  const nextStep = nextStepProcess?.find(
    (sp) =>
      sp?.order ===
        (currentStepProcess?.processStep?.order ?? Number.NEGATIVE_INFINITY) +
          1 && sp.status === Status.Active
  );

  const submitApplication = () =>
    updateApplication({
      ApplicationInput: {
        applicantProfileId: userProfile.id,
        jobListingId: jobId ?? "",
        userId:
          applicationData.getApplicationForJobListing?.candidate.user.id ?? "",
        id: applicationData?.getApplicationForJobListing?.id,
        processSteps: [
          ...(currentStepProcesses?.map((cp) => ({
            applicationId:
              applicationData?.getApplicationForJobListing?.id ?? "",
            id: cp?.id,
            processStepId: cp?.processStep.id ?? "",
            registeredAt: cp?.registeredAt,
          })) ?? []),
          {
            applicationId:
              applicationData?.getApplicationForJobListing?.id ?? "",
            processStepId: nextStep?.step.id ?? "",
            registeredAt: new Date(),
          },
        ],
        status: applicationData.getApplicationForJobListing?.status,
        dateOfApplication:
          applicationData?.getApplicationForJobListing?.dateOfApplication,
      },
    });

  const cancelApplication = () =>
    updateApplication({
      ApplicationInput: {
        id: applicationData.getApplicationForJobListing?.id,
        applicantProfileId: userProfile.id,
        jobListingId: jobId ?? "",
        userId:
          applicationData.getApplicationForJobListing?.candidate.user.id ?? "",
        status: ApplicationStatus.Canceled,
      },
    });

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={[
            "/app/organizations/:organizationSlug/recruitment/",
            "/app/organizations/:organizationSlug/recruitment/jobs/:jobId/applications",
            "/app/jobs/view",
            "/app/jobs/view/:jobId/applications",
          ]}
        />
      </Paper>
      <Group position="apart" p="md">
        <CandidateApplicationHero
          candidate={candidate}
          dateOfApplication={
            applicationData.getApplicationForJobListing.dateOfApplication
          }
          jobTitle={jobListing.title}
          profilePhotoUrl={
            userProfile.photography
              ? `${APP_IMAGES_API_PATH}/200x200/${userProfile.photography}`
              : undefined
          }
        />
        {isAuthorized([RoleType.ROLE_RECRUITER]) && (
          <Group>
            <Button
              variant="default"
              onClick={cancelApplication}
              disabled={
                !nextStep ||
                applicationData.getApplicationForJobListing.status ===
                  ApplicationStatus.Canceled ||
                applicationData.getApplicationForJobListing.status ===
                  ApplicationStatus.Finished
              }
            >
              Cancel
            </Button>
            <Button
              onClick={submitApplication}
              disabled={
                !nextStep ||
                applicationData.getApplicationForJobListing.status ===
                  ApplicationStatus.Canceled ||
                applicationData.getApplicationForJobListing.status ===
                  ApplicationStatus.Finished
              }
            >
              {nextStep ? `Proceed to "${nextStep.step.title}"` : "Proceed"}
            </Button>
          </Group>
        )}
      </Group>
      <Grid>
        <Grid.Col span={12} md={8}>
          <CandidateInformationSection
            candidate={applicationData.getApplicationForJobListing.candidate}
            userProfileUrl={`/app/up/${
              userProfile.profileSlugUrl ?? userProfile.id
            }`}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <ApplicationCandidatureTimeline
            application={applicationData.getApplicationForJobListing}
          />
        </Grid.Col>
        <Grid.Col span={12} md={8}>
          <Paper shadow={"xs"} p="md">
            <Title order={4} mb={5}>
              Attachments
            </Title>
            <Text size="sm">Documents added to this application</Text>
            <ShowIfElse
              if={
                (applicationData.getApplicationForJobListing
                  .applicationDocuments?.length ?? 0) > 0
              }
              else={
                <Text mt="sm" size="xs">
                  No documents added yet
                </Text>
              }
            >
              <Group
                className="rounded-lg bg-gray-50"
                mt="sm"
                spacing="xl"
                p="sm"
              >
                {applicationData.getApplicationForJobListing.applicationDocuments?.map(
                  (doc) =>
                    doc && (
                      <AttachmentItem
                        key={doc?.id}
                        fileName={doc.document.name}
                        src={"/images/pdf-icon.svg"}
                        apiUrl={`${APP_APPLICATION_DOCS_PATH}/${applicationData.getApplicationForJobListing?.id}/documents/${doc.document.name}`}
                      />
                    )
                )}
              </Group>
            </ShowIfElse>
          </Paper>
        </Grid.Col>
        <ShowIf if={!isAuthorized([RoleType.ROLE_RECRUITER])}>
          <Grid.Col span={12} md={8}>
            <Paper shadow={"xs"} p="md">
              <Title order={4} mb={5}>
                Add attachments
              </Title>
              <Text size="sm">
                Attachments will be uploaded as you add them
              </Text>
              <AttachmentUpload
                rootProps={{
                  style: {
                    padding: "0.65rem",
                  },
                }}
                pondProps={{
                  server: {
                    process: {
                      url: `${APP_API_BASE_URL}${APP_API_PATH}/applications/${applicationData.getApplicationForJobListing.id}/documents/upload`,
                      withCredentials: true,
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    },
                    revert: {
                      url: `${APP_API_BASE_URL}${APP_API_PATH}/applications/${applicationData.getApplicationForJobListing.id}/documents/delete`,
                      withCredentials: true,
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    },
                  },
                  acceptedFileTypes: ["application/pdf"],
                  fileValidateTypeLabelExpectedTypes:
                    "Expected .pdf/.doc(x) files",
                }}
              />
            </Paper>
          </Grid.Col>
        </ShowIf>
        <Grid.Col span={12} md={8}>
          <Paper shadow={"xs"} p="md">
            <Title order={4} mb={5}>
              Messages
            </Title>
            <Stack>
              <Text size="sm">There are no messages yet</Text>
            </Stack>
            <Space h="lg" />
            <Group spacing={"md"} noWrap>
              <Avatar
                size="lg"
                radius="xl"
                src={
                  currentUserProfile?.getUserProfile?.photography &&
                  `${APP_IMAGES_API_PATH}/100x100/${currentUserProfile?.getUserProfile?.photography}`
                }
              >
                {currentUserProfile?.getUserProfile?.user
                  ? `${currentUserProfile?.getUserProfile?.user.firstName?.[0].toUpperCase()}${currentUserProfile?.getUserProfile?.user.lastName?.[0].toUpperCase()}`
                  : currentUserProfile?.getUserProfile?.user.username?.[0].toUpperCase()}
              </Avatar>
              <Textarea
                w={"100%"}
                placeholder="Add a message in the application chat"
              />
            </Group>
            <Group position="right" mt="sm">
              <Button>Comment</Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default RecruitmentApplicationPage;
