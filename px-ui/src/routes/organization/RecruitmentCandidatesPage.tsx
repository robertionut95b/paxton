import ApplicationRecordCard from "@components/candidates/CandidateRecordCard";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  useGetAllApplicationsQuery,
  useGetAllJobListingsQuery,
  useGetAllProcessesQuery,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import {
  EyeIcon,
  EyeSlashIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  LinkIcon,
  MapIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { prettyEnumValue } from "@utils/enumUtils";
import { formatDistanceToNowStrict } from "date-fns";
import { NavLink, useParams } from "react-router-dom";

const RecruitmentCandidatesPage = () => {
  const { organizationId, jobId } = useParams();
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
  const { data: applicationsData, isLoading: isApplicationLoading } =
    useGetAllApplicationsQuery(
      graphqlRequestClient,
      {
        searchQuery: {
          filters: [
            {
              fieldType: FieldType.Long,
              key: "jobListing",
              operator: Operator.Equal,
              value: jobId as string,
            },
          ],
        },
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
              value: organization?.getOrganizationById?.recruitmentProcess
                .id as string,
            },
          ],
        },
      },
      {
        enabled: !!organization?.getOrganizationById?.recruitmentProcess.id,
      }
    );

  if (
    isLoadingOrganization ||
    isApplicationLoading ||
    isJobListingLoading ||
    isProcessLoading
  )
    return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationById) return <NotFoundPage />;
  if (
    !jobListingData?.getAllJobListings ||
    !jobListingData.getAllJobListings.list ||
    jobListingData.getAllJobListings.list.length === 0
  )
    return <NotFoundPage />;
  if (!jobListingData.getAllJobListings.list?.[0]) return <NotFoundPage />;

  const { title, contractType, availableFrom, isActive, availableTo } =
    jobListingData.getAllJobListings.list[0];

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={["/app/organizations/:organizationId/recruitment/"]}
        />
      </Paper>
      <Paper shadow={"xs"} p="md">
        <Group position="apart" align={"center"} mb={"sm"}>
          <Title order={3}>{title}</Title>
          <Group spacing={"xs"} align="center">
            <Button
              component={NavLink}
              to={`/app/jobs/view/${jobId}`}
              variant="light"
              leftIcon={<LinkIcon width={16} />}
            >
              View
            </Button>
            <Button
              component={NavLink}
              to={`/app/organizations/${organizationId}/jobs/publish-job/form/${jobId}/update`}
              variant="light"
              leftIcon={<PencilIcon width={16} />}
            >
              Edit
            </Button>
            <ShowIfElse
              if={isActive}
              else={
                <Button variant="light" leftIcon={<EyeIcon width={16} />}>
                  Extend
                </Button>
              }
            >
              <Button variant="filled" leftIcon={<EyeSlashIcon width={16} />}>
                Stop candidature
              </Button>
            </ShowIfElse>
          </Group>
        </Group>
        <Group spacing={"md"}>
          <Group spacing={5}>
            <BriefcaseIcon width={16} />
            <Text size="sm">
              {prettyEnumValue(contractType ?? "")} contract
            </Text>
          </Group>
          <Group spacing={5}>
            <MapIcon width={16} />
            <Text size="sm">Remote/On-site work</Text>
          </Group>
          <Group spacing={5}>
            <CalendarDaysIcon width={16} />
            <Text size="sm">
              <ShowIfElse
                if={isActive}
                else={
                  <Text color="dimmed">
                    Becomes available{" "}
                    {formatDistanceToNowStrict(new Date(availableFrom), {
                      addSuffix: true,
                    }) ?? "Invalid date"}
                  </Text>
                }
              >
                Published{" "}
                {formatDistanceToNowStrict(new Date(availableFrom), {
                  addSuffix: true,
                }) ?? "Invalid date"}
              </ShowIfElse>
            </Text>
          </Group>
          <Group spacing={5}>
            <CalendarDaysIcon width={16} />
            <Text size="sm">
              Closing{" "}
              {formatDistanceToNowStrict(new Date(availableTo), {
                addSuffix: true,
              }) ?? "Invalid date"}
            </Text>
          </Group>
        </Group>
      </Paper>
      <ShowIf if={!processData?.getAllProcesses?.list?.[0]}>
        <Alert
          icon={<ShieldExclamationIcon width={30} />}
          title="Process is unavailable"
          color="red"
          variant="filled"
          styles={{
            message: {
              lineHeight: 1.7,
            },
          }}
        >
          Hello recruiter! <br />
          Unfortunately this job listing does not have a recruitment process
          allocated! <br /> Please edit the job and select your process and
          it&apos;s respective steps. You can also set it as a default process
          for all further job postings.
        </Alert>
      </ShowIf>
      <Paper shadow={"xs"} p="md" className="px-candidates">
        <Title mb="xs" order={4}>
          Candidates
        </Title>
        <Tabs defaultValue="all" keepMounted={false}>
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
            {(processData?.getAllProcesses?.list?.[0]?.processSteps ?? []).map(
              (p) =>
                p && (
                  <Tabs.Tab
                    key={p.id}
                    value={p.step.title}
                    rightSection={
                      <Badge
                        sx={{ width: 16, height: 16, pointerEvents: "none" }}
                        variant="light"
                        size="xs"
                        p={0}
                      >
                        0
                      </Badge>
                    }
                  >
                    {p.step.title}
                  </Tabs.Tab>
                )
            )}
          </Tabs.List>
          <Tabs.Panel value="all">
            {applicationsData && (
              <ShowIfElse
                if={
                  (applicationsData.getAllApplications?.list?.length ?? []) > 0
                }
                else={<Text mt="xs">No candidates yet</Text>}
              >
                {applicationsData.getAllApplications?.list?.map(
                  (a, idx) =>
                    a && (
                      <div key={a.id} className="mt-4">
                        <ApplicationRecordCard candidate={a} />
                        {idx !==
                          (applicationsData.getAllApplications?.list?.length ??
                            1) -
                            1 && <Divider mt="sm" />}
                      </div>
                    )
                )}
              </ShowIfElse>
            )}
          </Tabs.Panel>
          {(processData?.getAllProcesses?.list?.[0]?.processSteps ?? []).map(
            (p) =>
              p && (
                <Tabs.Panel key={p.id} value={p.step.title}>
                  {applicationsData && (
                    <ShowIfElse
                      if={
                        (applicationsData.getAllApplications?.list?.length ??
                          []) > 0
                      }
                      else={<Text mt="xs">No candidates yet</Text>}
                    >
                      {applicationsData.getAllApplications?.list?.map(
                        (a, idx) =>
                          a && (
                            <div key={a.id} className="mt-4">
                              <ApplicationRecordCard candidate={a} />
                              {idx !==
                                (applicationsData.getAllApplications?.list
                                  ?.length ?? 1) -
                                  1 && <Divider mt="sm" />}
                            </div>
                          )
                      )}
                    </ShowIfElse>
                  )}
                </Tabs.Panel>
              )
          )}
        </Tabs>
      </Paper>
    </Stack>
  );
};

export default RecruitmentCandidatesPage;
