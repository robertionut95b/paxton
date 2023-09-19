import { useAuth } from "@auth/useAuth";
import ContactRecord from "@components/network/ContactRecord";
import InvitationListSkeleton from "@components/network/InvitationListSkeleton";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ConnectionStatus,
  SortDirection,
  useGetChatWithUserIdQuery,
  useGetConnectionsForUserQuery,
  useRemoveConnectionMutation,
} from "@gql/generated";
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Anchor,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { default as React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

type SortByOptions = "lastModified" | "lastName" | "firstName";

const NetworkMyContactsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<
    React.ComponentProps<typeof ContactRecord>["userConnection"] | null
  >(null);
  const [searchByName, setSearchByName] = useState<string>("");
  const searchByNameDebounced = useDebounce(searchByName, 1000);
  const [sortBy, setSortBy] = useState<SortByOptions>("lastModified");
  const [p, setP] = useState(1);
  const [ps, setPs] = useState(API_PAGINATION_SIZE);

  const {
    data: connectionsData,
    isError,
    refetch,
    isInitialLoading: isLoadingConnections,
  } = useGetConnectionsForUserQuery(
    graphqlRequestClient,
    {
      page: p - 1,
      size: ps,
      userId: user?.userId ?? "",
      searchQuery: searchByNameDebounced ?? "",
      sortBy: {
        direction: SortDirection.Desc,
        key: sortBy,
      },
    },
    {
      keepPreviousData: true,
    }
  );

  const { mutate: removeConnectionMutation } = useRemoveConnectionMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData(
            useGetConnectionsForUserQuery.getKey({
              page: p - 1,
              size: ps,
              userId: user?.userId ?? "",
            }),
            {
              ...connectionsData,
              getConnectionsForUser: {
                ...connectionsData?.getConnectionsForUser,
                list: connectionsData?.getConnectionsForUser?.list?.filter(
                  (cu) => cu?.id !== data.removeConnection?.id
                ),
                totalElements:
                  (connectionsData?.getConnectionsForUser?.totalElements ?? 0) -
                  1,
              },
            }
          );

          showNotification({
            title: "Connection update",
            message: "Successfully removed connection",
            autoClose: 5000,
            icon: <CheckCircleIcon width={20} />,
          });
        }
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: foundChatData } = useGetChatWithUserIdQuery(
    graphqlRequestClient,
    {
      userId: selectedUser?.id ?? "",
    },
    {
      enabled: !!selectedUser?.id,
      onSuccess: (data) => {
        if (data) {
          const firstFoundChat = data.getChatWithUserId;
          navigate(`/app/inbox/messages/chat/${firstFoundChat?.id}`);
        }
      },
      onError: (err: GraphqlApiResponse) => {
        const error = err.response.errors?.[0];
        if (error.message.includes("Chat does not exist between users")) {
          navigate(`/app/inbox/messages/chat/new?chatUser=${selectedUser?.id}`);
        }
      },
    }
  );

  const [parent] = useAutoAnimate();

  const resetSearch = () => {
    setSearchByName("");
  };

  const contactsCount =
    connectionsData?.getConnectionsForUser?.totalElements ?? 0;
  const totalPages = connectionsData?.getConnectionsForUser?.totalPages ?? 0;

  const contacts = connectionsData?.getConnectionsForUser?.list ?? [];

  return (
    <Grid>
      <Grid.Col span={12} sm={9}>
        <Paper p="md" shadow="xs">
          <ShowIfElse
            if={isLoadingConnections}
            else={
              <ShowIfElse
                if={isError}
                else={
                  <ShowIfElse
                    if={contactsCount > 0}
                    else={
                      <Stack>
                        <Text size="md">No contacts</Text>
                        <Stack align="center" my="md">
                          <Image
                            src="/images/contacts.svg"
                            width={86}
                            height={86}
                          />
                          <Text size="sm">
                            Seek possible connections using our suggestions
                          </Text>
                          <Button
                            size="xs"
                            leftIcon={<ArrowUturnLeftIcon width={16} />}
                            onClick={resetSearch}
                          >
                            Reset search
                          </Button>
                        </Stack>
                      </Stack>
                    }
                  >
                    <Stack>
                      <Text size="md" weight="bold">
                        {contactsCount} contacts
                      </Text>
                      <Group position="apart">
                        <Group>
                          <Text size="sm">Sort by</Text>
                          <Select
                            size="sm"
                            defaultValue={sortBy}
                            value={sortBy}
                            variant="unstyled"
                            data={[
                              {
                                value: "lastModified",
                                label: "Recently added",
                              },
                              { value: "lastName", label: "Last name" },
                              { value: "firstName", label: "First name" },
                            ]}
                            onChange={(v) => setSortBy(v as SortByOptions)}
                          />
                        </Group>
                        <Group>
                          <Input
                            icon={<MagnifyingGlassIcon width={16} />}
                            placeholder="Search by name"
                            size="xs"
                            value={searchByName}
                            onChange={(e) =>
                              setSearchByName(e.currentTarget.value)
                            }
                          />
                          <Anchor
                            size="sm"
                            component={Link}
                            to={`/app/people/search?cn=${ConnectionStatus.Accepted}`}
                          >
                            Search by filters
                          </Anchor>
                        </Group>
                      </Group>
                      <Divider />
                      <Stack ref={parent}>
                        {contacts.map(
                          (c) =>
                            c && (
                              <ContactRecord
                                key={c.id}
                                userConnection={
                                  c.addressed.id === String(user?.userId)
                                    ? c.requester
                                    : c.addressed
                                }
                                createdAt={c.lastModified}
                                onClickMessage={(c) => setSelectedUser(c)}
                                onClickRemove={() =>
                                  removeConnectionMutation({
                                    connectionId: c.id,
                                  })
                                }
                              />
                            )
                        )}
                      </Stack>
                    </Stack>
                  </ShowIfElse>
                }
              >
                <Stack align="center" spacing="xs">
                  <Image
                    src="/images/error-broken.svg"
                    width="260px"
                    height="260px"
                  />
                  <Text size="sm">
                    Unfortunately we could not load the connections
                  </Text>
                  <Button
                    size="xs"
                    my="xs"
                    leftIcon={<ArrowUturnLeftIcon width={16} />}
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </Stack>
              </ShowIfElse>
            }
          >
            <InvitationListSkeleton rowsNo={5} />
          </ShowIfElse>
          {contactsCount > 0 && (
            <div className="px-connections-pagination mt-8">
              <PaginationToolbar
                page={p}
                setPage={setP}
                pageSize={ps}
                setPageSize={setPs}
                totalElements={contactsCount}
                totalPages={totalPages}
              />
            </div>
          )}
        </Paper>
      </Grid.Col>
      <Grid.Col span={12} sm={3}>
        <Paper p="sm" shadow="xs">
          <Title order={5}>Manage contacts</Title>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default NetworkMyContactsPage;
