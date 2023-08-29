import { useAuth } from "@auth/useAuth";
import InvitationListSkeleton from "@components/network/InvitationListSkeleton";
import InvitationsList from "@components/network/InvitationsList";
import SuggestionsList from "@components/network/SuggestionsList";
import SuggestionsListSkeleton from "@components/network/SuggestionsListSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  ConnectionStatus,
  FieldType,
  Operator,
  useGetAllUserConnectionSuggestionsQuery,
  useGetConnectionInvitationsForUserQuery,
  useGetConnectionsQuery,
  useUpdateConnectionMutation,
} from "@gql/generated";
import {
  BookmarkIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Grid,
  Group,
  List,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

export default function NetworkPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingInvRequests } =
    useGetConnectionInvitationsForUserQuery(graphqlRequestClient, {
      userId: user?.userId ?? "",
      page: 0,
      size: API_PAGINATION_SIZE,
    });

  const { data: connectionsData, isLoading: isLoadingConnections } =
    useGetConnectionsQuery(graphqlRequestClient, {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
        filters: [
          {
            fieldType: FieldType.Long,
            key: "secondUser.id",
            operator: Operator.Equal,
            value: user?.userId ?? "",
          },
          {
            fieldType: FieldType.Enum,
            key: "connectionStatus",
            operator: Operator.Equal,
            value: `ConnectionStatus;${ConnectionStatus.Accepted}`,
          },
        ],
      },
    });

  const {
    data: allUserSuggestionsData,
    isLoading: isAllUserSuggestionsDataLoading,
  } = useGetAllUserConnectionSuggestionsQuery(graphqlRequestClient, {
    page: 0,
    size: API_PAGINATION_SIZE,
  });

  const { mutate } = useUpdateConnectionMutation(graphqlRequestClient, {
    onSuccess: async (data) => {
      if (data) {
        showNotification({
          title: "Connection update",
          message: "Successfully updated connection request",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });

        await queryClient.invalidateQueries(
          useGetConnectionInvitationsForUserQuery.getKey({
            userId: user?.userId ?? "",
            page: 0,
            size: API_PAGINATION_SIZE,
          })
        );
      }
    },

    onError: (error: GraphqlApiResponse) => {
      if (error.response) {
        showNotification({
          title: "Connection update",
          message:
            error.response.errors?.[0].message ?? "Unknown error ocurred",
          autoClose: 5000,
          icon: <ShieldExclamationIcon width={20} />,
        });
      }
    },
  });

  const connectionRequests = data?.getConnectionInvitationsForUser?.list ?? [];

  const contactsCount = connectionsData?.getConnections?.totalElements ?? 0;

  const userSuggestions =
    allUserSuggestionsData?.getAllUserConnectionSuggestions?.list ?? [];

  return (
    <Grid>
      <Grid.Col span={12} sm={3}>
        <Paper p="md" shadow="xs">
          <Title order={5} mb="md">
            Manage my network
          </Title>
          <ShowIfElse
            if={isLoadingConnections}
            else={
              <List spacing={"md"} size="sm" center>
                <List.Item icon={<UsersIcon width={20} />}>
                  <Group position="apart">
                    <NavLink to="my-contacts">Contacts</NavLink>
                    <Text>{contactsCount > 0 ? contactsCount : null}</Text>
                  </Group>
                </List.Item>
                <List.Item icon={<BookmarkIcon width={20} />}>
                  Imported
                </List.Item>
                <List.Item icon={<UserCircleIcon width={20} />}>
                  Following and followed
                </List.Item>
              </List>
            }
          >
            <Stack spacing={"sm"}>
              {Array.from(Array(5).keys()).map((i) => (
                <Skeleton key={i} height={20} />
              ))}
            </Stack>
          </ShowIfElse>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12} sm={9}>
        <Stack>
          <Paper p="md" shadow="xs">
            <ShowIfElse
              if={isLoadingInvRequests}
              else={
                <InvitationsList
                  invitations={connectionRequests}
                  onAcceptInvitation={(i) =>
                    mutate({
                      connectionRequestInput: {
                        id: i.id,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        addressedId: user!.userId,
                        connectionStatus: ConnectionStatus.Accepted,
                        requesterId: i.requester.id,
                      },
                    })
                  }
                  onDeclineInvitation={(i) =>
                    mutate({
                      connectionRequestInput: {
                        id: i.id,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        addressedId: user!.userId,
                        connectionStatus: ConnectionStatus.Declined,
                        requesterId: i.requester.id,
                      },
                    })
                  }
                />
              }
            >
              <div>
                <Grid align="center">
                  <Grid.Col mb="sm">
                    <Group position="apart">
                      <Skeleton w={300} h={20} />
                      <Skeleton w={100} h={20} />
                    </Group>
                  </Grid.Col>
                </Grid>
                <Grid.Col>
                  <InvitationListSkeleton />
                </Grid.Col>
              </div>
            </ShowIfElse>
          </Paper>
          <Paper p="md" shadow="xs">
            <ShowIfElse
              if={isAllUserSuggestionsDataLoading}
              else={
                <SuggestionsList
                  title="Suggestions based on your workplace"
                  link={`by-workplace`}
                  // @ts-expect-error("type-error")
                  data={userSuggestions}
                />
              }
            >
              <Grid align="center">
                <Grid.Col>
                  <Group position="apart">
                    <Skeleton w={300} h={20} />
                    <Skeleton w={100} h={20} />
                  </Group>
                </Grid.Col>
                <Grid.Col>
                  <SuggestionsListSkeleton />
                </Grid.Col>
              </Grid>
            </ShowIfElse>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
