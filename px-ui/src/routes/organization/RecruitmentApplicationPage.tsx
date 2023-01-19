import { useAuth } from "@auth/useAuth";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  FieldType,
  Operator,
  useGetAllApplicationsQuery,
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  ClipboardDocumentIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
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
  Timeline,
  Title,
} from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { format, formatDistanceToNowStrict } from "date-fns";
import { NavLink, useParams } from "react-router-dom";

const RecruitmentApplicationPage = () => {
  const { user } = useAuth();
  const { jobId, applicationId } = useParams();
  const { data: applicationData, isLoading } = useGetAllApplicationsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "id",
            operator: Operator.Equal,
            value: applicationId as string,
          },
        ],
      },
    },
    {
      enabled: !!applicationId,
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

  if (isLoading || isJobListingLoading || isLoadingCurrentProfile)
    return <GenericLoadingSkeleton />;
  if (
    !applicationData?.getAllApplications ||
    applicationData.getAllApplications.totalElements === 0 ||
    !jobListingData?.getAllJobListings ||
    jobListingData.getAllJobListings.totalElements === 0
  )
    return <NotFoundPage />;
  if (
    !applicationData.getAllApplications.list?.[0] ||
    !jobListingData.getAllJobListings.list?.[0]
  )
    return <NotFoundPage />;

  const candidate = applicationData.getAllApplications.list[0].candidate;
  const userProfile =
    applicationData.getAllApplications.list[0].applicantProfile;
  const jobListing = jobListingData.getAllJobListings.list[0];
  const dateOfApplication =
    applicationData.getAllApplications.list[0].dateOfApplication;

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={[
            "/app/organizations/:organizationId/recruitment/",
            "/app/organizations/:organizationId/recruitment/jobs/:jobId/applications",
          ]}
        />
      </Paper>
      <Group position="apart" p="md">
        <Group>
          {userProfile && (
            <Avatar
              size={"xl"}
              radius="xl"
              src={`${APP_IMAGES_API_PATH}/100x100?f=${userProfile.photography}`}
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
        <Group>
          <Button variant="default">Cancel</Button>
          <Button>Proceed</Button>
        </Group>
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
          <Paper shadow="xs" p="md" h="100%">
            <Title order={4} mb={"md"}>
              Timeline
            </Title>
            <Timeline active={0} bulletSize={30}>
              <Timeline.Item
                bullet={<UserCircleIcon width={20} />}
                title="New candidate"
              >
                <Text color="dimmed" size="sm">
                  User submitted application
                </Text>
                <Text size="xs" mt={4}>
                  {formatDistanceToNowStrict(new Date(dateOfApplication), {
                    addSuffix: true,
                  }) ?? "Invalid date"}
                </Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<ClipboardDocumentIcon width={20} />}
                title="To be reviewed"
              >
                <Text color="dimmed" size="sm">
                  Candidature will be taken under review by recruiter
                </Text>
                <Text size="xs" mt={4}>
                  {formatDistanceToNowStrict(new Date(dateOfApplication), {
                    addSuffix: true,
                  }) ?? "Invalid date"}
                </Text>
              </Timeline.Item>
            </Timeline>
            <Button mt="md" fullWidth>
              Advance
            </Button>
          </Paper>
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
                src={`${APP_IMAGES_API_PATH}/100x100?f=${currentUserProfile?.getUserProfile?.photography}`}
              >
                U
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
