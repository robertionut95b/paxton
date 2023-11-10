import { useAuth } from "@auth/useAuth";
import InvitationListSkeleton from "@components/network/InvitationListSkeleton";
import InvitationsListSection from "@components/network/InvitationsListSection";
import SuggestionsListSkeleton from "@components/network/SuggestionsListSkeleton";
import UsersSuggestionsSection from "@components/network/UsersSuggestionsSection";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  ConnectionStatus,
  useCreateConnectionRequestMutation,
  useGetAllUserConnectionSuggestionsQuery,
  useGetConnectionInvitationsForUserQuery,
  useGetConnectionsForUserQuery,
  useUpdateConnectionMutation,
} from "@gql/generated";
import {
  BookmarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
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
    useGetConnectionInvitationsForUserQuery(
      graphqlRequestClient,
      {
        userId: Number(user?.userId) ?? 0,
        page: 0,
        size: API_PAGINATION_SIZE,
      },
      {
        keepPreviousData: true,
      },
    );

  const { data: connectionsData, isLoading: isLoadingConnections } =
    useGetConnectionsForUserQuery(graphqlRequestClient, {
      page: 0,
      size: API_PAGINATION_SIZE,
      userId: user?.userId ?? 0,
    });

  const {
    data: allUserSuggestionsData,
    isLoading: isAllUserSuggestionsDataLoading,
  } = useGetAllUserConnectionSuggestionsQuery(
    graphqlRequestClient,
    {
      page: 0,
      size: API_PAGINATION_SIZE,
    },
    {
      keepPreviousData: true,
    },
  );

  const { mutate } = useUpdateConnectionMutation(graphqlRequestClient, {
    onSuccess: (updateData) => {
      if (updateData) {
        showNotification({
          title: "Connection update",
          message: "Successfully updated connection request",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });

        // refresh invitations list
        queryClient.setQueryData(
          useGetConnectionInvitationsForUserQuery.getKey({
            userId: user?.userId ?? 0,
            page: 0,
            size: API_PAGINATION_SIZE,
          }),
          {
            ...data,
            getNewConnectionForUser: {
              ...data?.getNewConnectionForUser,
              list: data?.getNewConnectionForUser?.list?.filter(
                (c) => c?.id !== updateData.updateConnection?.id,
              ),
            },
          },
        );
        queryClient.invalidateQueries(
          useGetConnectionsForUserQuery.getKey({
            userId: user?.userId ?? 0,
            page: 0,
            size: API_PAGINATION_SIZE,
          }),
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

  const { mutate: sendConnectionRequest } = useCreateConnectionRequestMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data) {
          showNotification({
            title: "Connection update",
            message: "Successfully sent connection request",
            autoClose: 5000,
            icon: <CheckCircleIcon width={20} />,
          });

          // refresh suggestions query
          queryClient.setQueryData(
            useGetAllUserConnectionSuggestionsQuery.getKey({
              page: 0,
              size: API_PAGINATION_SIZE,
            }),
            {
              ...allUserSuggestionsData,
              getAllUserConnectionSuggestions: {
                ...allUserSuggestionsData?.getAllUserConnectionSuggestions,
                list: allUserSuggestionsData?.getAllUserConnectionSuggestions?.list?.filter(
                  (s) => s?.id !== data.createConnection?.addressed.id,
                ),
              },
            },
          );
        }
      },
      onError: (err: GraphqlApiResponse) => {
        if (err.response.errors) {
          showNotification({
            title: "Connection failed",
            message:
              err.response.errors?.[0].message.split(":")?.[1] ??
              "Unknown error occurred",
            autoClose: 5000,
            icon: <ExclamationCircleIcon width={20} />,
          });
        }
      },
    },
  );

  const connectionRequests = data?.getNewConnectionForUser?.list ?? [];

  const contactsCount =
    connectionsData?.getConnectionsForUser?.totalElements ?? 0;

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
                  <Group position="apart" w="100%">
                    <NavLink to="my-contacts">Contacts</NavLink>
                    {contactsCount > 0 ? <Text>{contactsCount}</Text> : null}
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
                <InvitationsListSection length={connectionRequests.length}>
                  {connectionRequests.map(
                    (c) =>
                      c && (
                        <InvitationsListSection.Item
                          key={c?.id}
                          data={c}
                          onAccept={(c) =>
                            mutate({
                              connectionRequestInput: {
                                id: c.id,
                                addressedId: user?.userId ?? 0,
                                connectionStatus: ConnectionStatus.Accepted,
                                requesterId: c.requester.id,
                              },
                            })
                          }
                          onDecline={(c) =>
                            mutate({
                              connectionRequestInput: {
                                id: c.id,
                                addressedId: user?.userId ?? 0,
                                connectionStatus: ConnectionStatus.Accepted,
                                requesterId: c.requester.id,
                              },
                            })
                          }
                        />
                      ),
                  )}
                </InvitationsListSection>
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
                  <InvitationListSkeleton rowsNo={3} />
                </Grid.Col>
              </div>
            </ShowIfElse>
          </Paper>
          <Paper p="md" shadow="xs">
            <ShowIfElse
              if={isAllUserSuggestionsDataLoading}
              else={
                <UsersSuggestionsSection
                  title="Suggestions based on your workplace"
                  link={`by-workplace`}
                  length={userSuggestions.length}
                >
                  {userSuggestions.map(
                    (usrs) =>
                      usrs && (
                        <UsersSuggestionsSection.Item
                          key={usrs?.id}
                          user={usrs}
                          onConnectClick={(us) =>
                            sendConnectionRequest({
                              connectionCreateInput: {
                                requesterId: user?.userId ?? 0,
                                addressedId: us.id,
                                connectionStatus: ConnectionStatus.Requested,
                              },
                            })
                          }
                        />
                      ),
                  )}
                </UsersSuggestionsSection>
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
                  <SuggestionsListSkeleton cardsNo={4} />
                </Grid.Col>
              </Grid>
            </ShowIfElse>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
