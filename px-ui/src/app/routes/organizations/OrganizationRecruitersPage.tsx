import PaginationToolbar from "@components/ui/pagination/PaginationToolbar";
import { API_PAGINATION_SIZE, APP_API_BASE_URL } from "@config/Properties";
import UserLineCard from "@features/user-profile/components/UserLineCard";
import {
  FieldType,
  Operator,
  useFindRecruitersAdvSearchQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Center, Loader, Paper, Stack, Title } from "@mantine/core";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";

const OrganizationRecruitersPage = () => {
  const { organizationSlug } = useParams();
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(API_PAGINATION_SIZE ?? 10);

  const { data: recruitersData, isLoading } = useFindRecruitersAdvSearchQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
        filters: [
          {
            fieldType: FieldType.String,
            key: "organization.slugName",
            operator: Operator.Equal,
            value: organizationSlug as string,
          },
        ],
      },
    },
  );

  if (isLoading)
    return (
      <Paper p="md" shadow="xs">
        <Center>
          <Loader size="sm" />
        </Center>
      </Paper>
    );

  const totalElements =
    recruitersData?.findRecruitersAdvSearch?.totalElements ?? 0;
  const totalPages = recruitersData?.findRecruitersAdvSearch?.totalPages ?? 0;
  const recruiters = recruitersData?.findRecruitersAdvSearch?.list ?? [];

  if (recruiters.length === 0) {
    return (
      <Paper p="md" shadow="xs">
        <Title order={6}>There are no recruiters yet</Title>
      </Paper>
    );
  }

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Title order={5}>Recruiters</Title>
        <Stack spacing="xl">
          {recruiters.map(
            (r) =>
              r?.user && (
                <div key={r?.id}>
                  <UserLineCard
                    // @ts-expect-error("types-to-fix")
                    user={
                      r.user.userProfile.userProfileAvatarImage
                        ? {
                            ...r.user,
                            userProfile: {
                              ...r.user.userProfile,
                              photography: `${APP_API_BASE_URL}/${r.user.userProfile.userProfileAvatarImage.url}`,
                            },
                          }
                        : r.user
                    }
                    joinedAt={r.registeredAt}
                  />
                </div>
              ),
          )}
        </Stack>
        <PaginationToolbar
          page={p}
          setPage={setP}
          pageSize={ps}
          setPageSize={setPs}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </Stack>
      <Outlet />
    </Paper>
  );
};

export default OrganizationRecruitersPage;
