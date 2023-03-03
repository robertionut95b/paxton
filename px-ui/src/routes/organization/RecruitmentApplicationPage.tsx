import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import ApplicationCandidatureTimeline from "@components/jobs/job-page/ApplicationCandidatureTimeline";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  FieldType,
  Operator,
  useGetAllJobListingsQuery,
  useGetAllProcessesQuery,
  useGetApplicationForJobListingRecruitmentQuery,
  useGetOrganizationBySlugNameQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { format } from "date-fns";
import { NavLink, useParams } from "react-router-dom";
import { useUpdateApplicationMutation } from "../../gql/generated";

const RecruitmentApplicationPage = () => {
  const { user, isAuthorized } = useAuth();
  const { jobId, organizationSlug } = useParams();
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
  const { mutate: updateApplication } =
    useUpdateApplicationMutation(graphqlRequestClient);

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
  const dateOfApplication =
    applicationData.getApplicationForJobListing.dateOfApplication;

  const currentStepProcesses =
    applicationData.getApplicationForJobListing.processSteps;
  const currentStepProcess =
    currentStepProcesses?.[currentStepProcesses.length - 1 ?? 0];
  const nextStepProcess = processData?.getAllProcesses?.list?.[0]?.processSteps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nextStep = nextStepProcess?.find(
    (sp) =>
      sp?.order ===
      (currentStepProcess?.processStep?.order ?? Number.NEGATIVE_INFINITY) + 1
  );

  console.log(currentStepProcess, nextStep);

  const submitApplication = () => {
    updateApplication({
      ApplicationInput: {
        applicantProfileId: userProfile.id,
        jobListingId: jobId ?? "",
        userId: user?.userId ?? "",
        id: applicationData.getApplicationForJobListing?.id,
        processSteps: [
          ...(currentStepProcesses?.map((cp) => ({
            applicationId: applicationData.getApplicationForJobListing?.id,
            id: cp?.id,
            processStepId: cp?.processStep.id,
            registeredAt: cp?.registeredAt,
          })) ?? []),
          {
            applicationId: applicationData.getApplicationForJobListing?.id,
            processStepId: nextStep?.step.id,
            registeredAt: new Date(),
          },
        ],
      },
    });
  };

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
        <Group>
          {userProfile && (
            <Avatar
              size={"xl"}
              radius="xl"
              variant={!userProfile?.photography ? "filled" : "light"}
              src={
                userProfile.photography &&
                `${APP_IMAGES_API_PATH}/100x100?f=${userProfile.photography}`
              }
            >
              {candidate.user?.username?.[0].toUpperCase() ?? "U"}
            </Avatar>
          )}
          <Stack spacing={2}>
            <ShowIfElse
              if={candidate.user.firstName && candidate.user.lastName}
              else={<Title order={3}>{candidate.user.username}</Title>}
            >
              <Title order={3}>
                {`${candidate.user.firstName} ${candidate.user.lastName}`}
              </Title>
            </ShowIfElse>
            <Group spacing={4}>
              <Text size={"sm"} color="dimmed">
                Applied for
              </Text>
              <Text size="sm" weight="bold">
                {jobListing.title}
              </Text>
              <Text size="sm" color="dimmed">
                {" "}
                on {format(new Date(dateOfApplication), "MMMM dd, yyyy")}
              </Text>
            </Group>
          </Stack>
        </Group>
        {isAuthorized([RoleType.ROLE_RECRUITER]) && (
          <Group>
            <Button variant="default">Cancel</Button>
            <Button onClick={() => submitApplication()}>Proceed</Button>
          </Group>
        )}
      </Group>
      <Grid>
        <Grid.Col span={12} md={8}>
          <Paper shadow={"xs"} p="md" h="100%">
            <Title order={4} mb={5}>
              Applicant information
            </Title>
            <Text color="dimmed" size="sm">
              Personal details of the applicant
            </Text>
            <Divider my="lg" />
            <Stack spacing={"xl"}>
              <Stack spacing={0}>
                <Title order={5} mb={5} color="dimmed" weight="normal">
                  Profile
                </Title>
                <NavLink
                  to={`/app/up/${userProfile.profileSlugUrl ?? userProfile.id}`}
                >
                  <Text size="sm" variant="link">
                    User&apos;s profile
                  </Text>
                </NavLink>
              </Stack>
              <Group spacing={"xl"}>
                <Stack spacing={0}>
                  <Title order={5} mb={5} color="dimmed" weight="normal">
                    Full name
                  </Title>
                  <Text size="sm">
                    {`${candidate.user.firstName} ${candidate.user.lastName}`}
                  </Text>
                </Stack>
                <Stack spacing={0}>
                  <Title order={5} mb={5} color="dimmed" weight="normal">
                    Email address
                  </Title>
                  <Text size="sm">{candidate.user.email}</Text>
                </Stack>
                {candidate.user.birthDate && (
                  <Stack spacing={0}>
                    <Title order={5} mb={5} color="dimmed" weight="normal">
                      Birthdate
                    </Title>
                    <Text size="sm">
                      {format(
                        new Date(candidate.user.birthDate),
                        "MMMM dd, yyyy"
                      )}
                    </Text>
                  </Stack>
                )}
              </Group>
              <Stack spacing={2}>
                <Title order={5} mb={5} color="dimmed" weight="normal">
                  Attachments
                </Title>
                <Stack>
                  <Text size="sm">No attachments added</Text>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <ApplicationCandidatureTimeline
            application={applicationData.getApplicationForJobListing}
          />
        </Grid.Col>
        <Grid.Col span={12} md={8}>
          <Paper shadow={"xs"} p="md">
            <Title order={4} mb={0}>
              Messages
            </Title>
            <Divider mt="lg" mb="md" />
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
                  `${APP_IMAGES_API_PATH}/100x100?f=${currentUserProfile?.getUserProfile?.photography}`
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
