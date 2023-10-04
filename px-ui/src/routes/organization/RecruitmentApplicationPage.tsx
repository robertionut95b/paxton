import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import CandidateApplicationHero from "@components/candidates/CandidateApplicationHero";
import CandidateInformationSection from "@components/candidates/CandidateInformationSection";
import ApplicationCandidatureTimeline from "@components/jobs/job-page/ApplicationCandidatureTimeline";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ApplicationStatus,
  FieldType,
  Operator,
  SortDirection,
  Status,
  useAddMessageToApplicationChatMutation,
  useGetAllJobListingsQuery,
  useGetAllProcessesQuery,
  useGetApplicationByIdQuery,
  useGetApplicationsForJobIdCountByStepsQuery,
  useGetOrganizationBySlugNameQuery,
  useGetUserProfileQuery,
  useInfiniteGetMessagesPaginatedQuery,
  useUpdateApplicationMutation,
} from "@gql/generated";
import {
  CheckCircleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import {
  GraphqlApiResponse,
  isGraphqlApiResponse,
} from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import AccessDenied from "@routes/AccessDenied";
import NotFoundPage from "@routes/NotFoundPage";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 5;

const RecruitmentApplicationPage = () => {
  const { user, isAuthorized, accessToken } = useAuth();
  const { applicationId, jobId, organizationSlug } = useParams();
  const queryClient = useQueryClient();

  const {
    data: applicationData,
    isLoading,
    isError: isApplicationError,
    error,
  } = useGetApplicationByIdQuery(
    graphqlRequestClient,
    {
      applicationId: Number(applicationId),
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
  const { data: organizationData, isInitialLoading: isOrganizationLoading } =
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
          (!!organizationSlug ||
            !!jobListingData?.getAllJobListings?.list?.[0]?.organization
              .slugName) &&
          isAuthorized([RoleType.ROLE_RECRUITER]),
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
                organizationData?.getOrganizationBySlugName?.recruitmentProcess.id.toString() ??
                "",
            },
          ],
        },
      },
      {
        enabled: !!organizationData && isAuthorized([RoleType.ROLE_RECRUITER]),
      }
    );

  const searchQuery = useMemo(
    () => ({
      filters: [
        {
          key: "chat.id",
          value: applicationData?.getApplicationById?.chat.id.toString(),
          operator: Operator.Equal,
          fieldType: FieldType.Long,
        },
      ],
      sorts: [
        {
          direction: SortDirection.Desc,
          key: "modifiedAt",
        },
      ],
      page: 0,
      size: PAGE_SIZE,
    }),
    [applicationData?.getApplicationById?.chat.id]
  );

  const {
    data: messagesData,
    isLoading: messagesIsLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteGetMessagesPaginatedQuery(
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const offset: number = (allPages.length ?? 1) * PAGE_SIZE;
        const totalItems = lastPage.getMessagesPaginated?.totalElements ?? 0;
        const currPage = (lastPage.getMessagesPaginated?.page ?? 0) + 1;
        if (offset < totalItems)
          return {
            searchQuery: {
              ...searchQuery,
              page: currPage,
            },
          };
      },
      enabled: !!applicationData?.getApplicationById?.chat.id,
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
          useGetApplicationByIdQuery.getKey({
            applicationId: Number(applicationId) ?? 0,
          })
        );
        queryClient.invalidateQueries(
          useGetApplicationsForJobIdCountByStepsQuery.getKey({
            jobId: Number(jobId) ?? 0,
          })
        );
      },
      onError: (error: GraphqlApiResponse) => {
        if (
          error.response.errors?.[0].message
            .toLowerCase()
            .includes("access is denied")
        ) {
          showNotification({
            title: "Unauthorized access",
            message: "You are not allowed change this application",
            autoClose: 5000,
            icon: <ShieldExclamationIcon width={20} />,
          });
        }
      },
    }
  );

  const { mutate: addMessage } = useAddMessageToApplicationChatMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Application update",
          message: "Successfully added message to this chat",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        queryClient.invalidateQueries(
          useInfiniteGetMessagesPaginatedQuery.getKey({
            searchQuery,
          })
        );
      },
    }
  );

  const [parent] = useAutoAnimate();

  const messages = useMemo(
    () =>
      messagesData?.pages
        .flatMap((p) => p.getMessagesPaginated?.list ?? [])
        .reverse() ?? [],

    [messagesData?.pages]
  );

  if (
    isLoading ||
    isJobListingLoading ||
    isLoadingCurrentProfile ||
    isProcessLoading ||
    isOrganizationLoading
  )
    return <GenericLoadingSkeleton />;

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

  if (
    !applicationData?.getApplicationById ||
    !jobListingData?.getAllJobListings ||
    jobListingData.getAllJobListings.totalElements === 0
  )
    return <NotFoundPage />;
  if (
    !applicationData.getApplicationById ||
    !jobListingData.getAllJobListings.list?.[0]
  )
    return <NotFoundPage />;

  const candidate = applicationData.getApplicationById.candidate;
  const userProfile = applicationData.getApplicationById.applicantProfile;
  const jobListing = jobListingData.getAllJobListings.list[0];
  const currentStepProcesses = applicationData.getApplicationById.processSteps;
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
        jobListingId: Number(jobId) ?? 0,
        userId: applicationData.getApplicationById?.candidate.user.id ?? 0,
        id: applicationData?.getApplicationById?.id,
        processSteps: [
          ...(currentStepProcesses?.map((cp) => ({
            applicationId: applicationData?.getApplicationById?.id ?? 0,
            id: cp?.id,
            processStepId: cp?.processStep.id ?? 0,
            registeredAt: cp?.registeredAt,
          })) ?? []),
          {
            applicationId: applicationData?.getApplicationById?.id ?? 0,
            processStepId: nextStep?.step.id ?? 0,
            registeredAt: new Date(),
          },
        ],
        status: applicationData.getApplicationById?.status,
        dateOfApplication:
          applicationData?.getApplicationById?.dateOfApplication,
      },
    });

  const cancelApplication = () =>
    updateApplication({
      ApplicationInput: {
        id: applicationData.getApplicationById?.id,
        applicantProfileId: userProfile.id,
        jobListingId: Number(jobId) ?? 0,
        userId: applicationData.getApplicationById?.candidate.user.id ?? 0,
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
            applicationData.getApplicationById.dateOfApplication
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
                applicationData.getApplicationById.status ===
                  ApplicationStatus.Canceled ||
                applicationData.getApplicationById.status ===
                  ApplicationStatus.Finished
              }
            >
              Cancel
            </Button>
            <Button
              onClick={submitApplication}
              disabled={
                !nextStep ||
                applicationData.getApplicationById.status ===
                  ApplicationStatus.Canceled ||
                applicationData.getApplicationById.status ===
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
            candidate={applicationData.getApplicationById.candidate}
            userProfileUrl={`/app/up/${
              userProfile.profileSlugUrl ?? userProfile.id
            }`}
            applicationStatus={applicationData.getApplicationById.status}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <ApplicationCandidatureTimeline
            application={applicationData.getApplicationById}
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
                (applicationData.getApplicationById.applicationDocuments
                  ?.length ?? 0) > 0
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
                ref={parent}
              >
                {applicationData.getApplicationById.applicationDocuments?.map(
                  (doc) =>
                    doc && (
                      <AttachmentItem
                        key={doc?.id}
                        fileName={doc.document.name}
                        src={"/images/pdf-icon.svg"}
                        apiUrl={`${APP_APPLICATION_DOCS_PATH}/${applicationData.getApplicationById?.id}/documents/${doc.document.name}`}
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
                  onprocessfiles: () =>
                    queryClient.invalidateQueries(
                      useGetApplicationByIdQuery.getKey({
                        applicationId: Number(applicationId) ?? 0,
                      })
                    ),
                  onremovefile: () =>
                    queryClient.invalidateQueries(
                      useGetApplicationByIdQuery.getKey({
                        applicationId: Number(applicationId) ?? 0,
                      })
                    ),
                  server: {
                    process: {
                      url: `${APP_API_BASE_URL}${APP_API_PATH}/applications/${applicationData.getApplicationById.id}/documents/upload`,
                      withCredentials: true,
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    },
                    revert: {
                      url: `${APP_API_BASE_URL}${APP_API_PATH}/applications/${applicationData.getApplicationById.id}/documents/delete`,
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
            <Title order={4} mb={"sm"}>
              Messages
            </Title>
            <Divider />
            <ShowIfElse
              if={!messagesIsLoading}
              else={<Loader size="xs" variant="dots" />}
            >
              <ShowIfElse
                if={(messages?.length ?? 0) > 0}
                else={<Text size="sm">There are no messages yet</Text>}
              >
                <ChatSection
                  currentUser={user}
                  messages={messages}
                  childrenPre={
                    <ShowIf if={hasNextPage}>
                      <Button
                        compact
                        mt="xs"
                        onClick={() => fetchNextPage()}
                        loading={isFetching}
                        variant="light"
                        fullWidth
                      >
                        Load more
                      </Button>
                    </ShowIf>
                  }
                />
              </ShowIfElse>
            </ShowIfElse>
            <Space h="lg" />
            <MessageAddForm
              currentUser={user}
              currentUserAvatar={
                currentUserProfile?.getUserProfile?.photography
              }
              onSubmit={(values) =>
                addMessage({
                  applicationId: applicationData.getApplicationById?.id ?? 0,
                  MessageInput: {
                    chatId: applicationData.getApplicationById?.chat.id ?? 0,
                    content: values.content,
                    senderUserId: values.senderUserId ?? 0,
                  },
                })
              }
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default RecruitmentApplicationPage;
