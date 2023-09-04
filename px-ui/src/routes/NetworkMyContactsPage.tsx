import { useAuth } from "@auth/useAuth";
import ContactRecord from "@components/network/ContactRecord";
import InvitationListSkeleton from "@components/network/InvitationListSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  useGetConnectionsForUserQuery,
  useRemoveConnectionMutation,
} from "@gql/generated";
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Anchor,
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type SortByOptions = "recent" | "lname" | "firstname";

const NetworkMyContactsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: connectionsData, isLoading: isLoadingConnections } =
    useGetConnectionsForUserQuery(graphqlRequestClient, {
      page: 0,
      size: API_PAGINATION_SIZE,
      userId: user?.userId ?? "",
    });

  const { mutate: removeConnectionMutation } = useRemoveConnectionMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData(
            useGetConnectionsForUserQuery.getKey({
              page: 0,
              size: API_PAGINATION_SIZE,
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
  const [parent] = useAutoAnimate();

  const [sortBy, setSortBy] = useState<SortByOptions>("recent");

  const contactsCount =
    connectionsData?.getConnectionsForUser?.totalElements ?? 0;

  const contacts = connectionsData?.getConnectionsForUser?.list ?? [];

  return (
    <Grid>
      <Grid.Col span={12} sm={9}>
        <Paper p="md" shadow="xs">
          <ShowIfElse
            if={isLoadingConnections}
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
                    </Stack>
                  </Stack>
                }
              >
                <Stack>
                  <Text size="md">{contactsCount} contacts</Text>
                  <Group position="apart">
                    <Group>
                      <Text size="sm">Sort by</Text>
                      <Select
                        size="sm"
                        defaultValue={sortBy}
                        value={sortBy}
                        variant="unstyled"
                        data={[
                          { value: "recent", label: "Recently added" },
                          { value: "lname", label: "Last name" },
                          { value: "fname", label: "First name" },
                        ]}
                        onChange={(v) => setSortBy(v as SortByOptions)}
                      />
                    </Group>
                    <Group>
                      <Input
                        icon={<MagnifyingGlassIcon width={16} />}
                        placeholder="Search by name"
                        size="xs"
                      />
                      <Anchor
                        size="sm"
                        component={Link}
                        to="/app/people/search"
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
                            onClickMessage={(c) =>
                              navigate(
                                `/app/inbox/messages/chat/new?chatUser=${c.id}`
                              )
                            }
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
            <InvitationListSkeleton rowsNo={5} />
          </ShowIfElse>
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
