import { useAuth } from "@auth/useAuth";
import ContactRecord from "@components/network/ContactRecord";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  FieldType,
  GetUserProfileQuery,
  Operator,
  useGetAllUsersPagedQuery,
  useGetChatWithUserIdQuery,
  useGetCountriesCitiesQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  ArrowUturnLeftIcon,
  MapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";

const UserSearchPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const peopleQuery = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(peopleQuery ?? "");
  const [debouncedQuery] = useDebounceValue(searchQuery, 1500);
  const [selectedUser, setSelectedUser] = useState<
    React.ComponentProps<typeof ContactRecord>["userConnection"] | null
  >(null);

  const [parent] = useAutoAnimate();

  const prevUserProfileQueryData =
    queryClient.getQueryData<GetUserProfileQuery>(
      useGetUserProfileQuery.getKey({ profileSlugUrl: user?.profileSlugUrl }),
    );

  const cityId =
    searchParams.get("city") ??
    prevUserProfileQueryData?.getUserProfile?.city?.id;

  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(API_PAGINATION_SIZE);

  const {
    data: usersData,
    isError: usersIsError,
    isInitialLoading: isUsersLoading,
    refetch: usersRefetch,
  } = useGetAllUsersPagedQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
        filters: [
          {
            fieldType: FieldType.Long,
            key: "id",
            operator: Operator.NotEqual,
            value: String(user?.userId) ?? "",
          },
          ...(debouncedQuery
            ? [
                {
                  key: "lastName",
                  fieldType: FieldType.String,
                  value: debouncedQuery,
                  operator: Operator.Like,
                },
              ]
            : []),
          ...(cityId
            ? [
                {
                  key: "userProfile.city.id",
                  fieldType: FieldType.Long,
                  value: String(cityId),
                  operator: Operator.Equal,
                },
              ]
            : []),
        ],
      },
    },
    {
      keepPreviousData: true,
    },
  );

  const { data: cityData, isInitialLoading: cityIsLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { data: userProfileData, isInitialLoading: isProfileLoading } =
    useGetUserProfileQuery(graphqlRequestClient, {
      profileSlugUrl: user?.profileSlugUrl,
    });

  useGetChatWithUserIdQuery(
    graphqlRequestClient,
    {
      userId: selectedUser?.id ?? 0,
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
    },
  );

  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
    onChangeSingleType(e.currentTarget.value, "q");
  };

  const onChangeSingleType = (value: string | null, key: string) => {
    const currentSearchParams = searchParams;
    if (!value) {
      currentSearchParams.delete(key);
      return setSearchParams(currentSearchParams);
    }
    currentSearchParams.set(key, value);
    setSearchParams(currentSearchParams);
  };

  const locations = useMemo(
    () =>
      cityData?.getCountriesCities
        ?.map((c) => {
          const cityId = c?.cities?.map((ci) => String(ci?.id) ?? "") ?? [];
          const cityName = c?.cities?.map((ci) => ci?.name) ?? [];
          const locs = cityName.map((ci, idx) => ({
            label: `${c?.name}, ${ci}`,
            value: cityId[idx],
          }));
          return locs;
        })
        .flat(1) ?? [],
    [cityData],
  );

  useEffect(() => {
    if (userProfileData?.getUserProfile?.city?.id) {
      const currentSearchParams = searchParams;
      currentSearchParams.set(
        "city",
        userProfileData?.getUserProfile?.city.id.toString(),
      );
      setSearchParams(currentSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData?.getUserProfile?.city?.id]);

  const contacts = usersData?.getAllUsersPaged?.list ?? [];

  const totalElements = usersData?.getAllUsersPaged?.totalElements ?? 0;
  const totalPages = usersData?.getAllUsersPaged?.totalPages ?? 0;

  if (cityIsLoading || isUsersLoading || isProfileLoading)
    return <ApplicationSpinner />;

  return (
    <Grid className="px-people-search">
      <Grid.Col span={12}>
        <Group noWrap spacing={5}>
          <TextInput
            size="xs"
            placeholder="Full name"
            icon={<UserIcon width={16} />}
            value={searchQuery ?? undefined}
            onChange={onChangeSearchQuery}
          />
          <Divider orientation="vertical" mx={5} />
          <Select
            placeholder="Location"
            size="xs"
            icon={<MapIcon width={16} />}
            searchable
            nothingFound="No record found"
            data={locations}
            value={searchParams.get("city") ?? undefined}
            onChange={(val) => onChangeSingleType(val, "city")}
            transition="fade"
            transitionDuration={300}
            clearable
          />
        </Group>
      </Grid.Col>
      <Grid.Col span={12} md={8}>
        <Paper p="md" shadow="xs">
          <When condition={usersIsError}>
            <Stack align="center" spacing="xs">
              <Image
                src="/images/error-broken.svg"
                width="260px"
                height="260px"
              />
              <Text size="sm">Unfortunately we could not load the users</Text>
              <Button
                size="xs"
                my="xs"
                leftIcon={<ArrowUturnLeftIcon width={16} />}
                onClick={() => usersRefetch()}
              >
                Retry
              </Button>
            </Stack>
          </When>
          <When condition={!usersIsError && totalElements === 0}>
            <Stack align="center" my="sm">
              <Image src="/images/contacts.svg" width={76} />
              <Text size="sm">Could not find anyone for this criteria</Text>
            </Stack>
          </When>
          <When condition={!usersIsError && totalElements > 0}>
            <Stack ref={parent}>
              <Title order={5}>{totalElements} people</Title>
              {contacts.map(
                (u) =>
                  u && (
                    <ContactRecord
                      key={u.id}
                      userConnection={u}
                      onClickMessage={(c) => setSelectedUser(c)}
                    />
                  ),
              )}
            </Stack>
          </When>
          <When condition={!usersIsError && totalElements > 0}>
            <PaginationToolbar
              page={p}
              setPage={setP}
              pageSize={ps}
              setPageSize={setPs}
              totalElements={totalElements}
              totalPages={totalPages}
            />
          </When>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default UserSearchPage;
