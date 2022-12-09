import { RoleType } from "@auth/permission.types";
import { RequirePermission } from "@auth/RequirePermission";
import { useAuth } from "@auth/useAuth";
import JobListingItem from "@components/jobs/JobListing";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Pagination,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import graphqlRequestClient from "../../lib/graphqlRequestClient";

export default function JobsPage() {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(5);
  const { data, isLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
      },
    },
    {
      queryKey: [`jobsListing${p}&${ps}`],
      keepPreviousData: true,
      staleTime: 1000 * 60,
    }
  );

  const totalPages = data?.getAllJobListings?.totalPages ?? 0;
  const totalElements = data?.getAllJobListings?.totalElements ?? 0;
  const jobs = data?.getAllJobListings?.list || [];

  const { user } = useAuth();

  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useGetUserProfileQuery(graphqlRequestClient, {
      profileSlugUrl: user?.profileSlugUrl,
    });

  if (isLoading || isLoadingUserProfile) return <JobsListingsSkeleton />;

  if (jobs.length === 0) {
    return (
      <>
        <Title mb={8} order={4}>
          No suitable jobs found
        </Title>
        <p>You should consider updating your profile</p>
      </>
    );
  }

  const lastOrganization =
    userProfile?.getUserProfile?.experiences?.[0]?.organization;

  return (
    <div className="px-jobs grid gap-8">
      <RequirePermission
        returnValue="null"
        strict
        permission={RoleType.ROLE_RECRUITER}
      >
        <Paper shadow={"xs"} p="md">
          <Group position="apart">
            <Group>
              <Button
                leftIcon={<BuildingOfficeIcon width={16} />}
                variant="light"
              >
                Company's jobs
              </Button>
              <Button
                leftIcon={<ClipboardDocumentIcon width={16} />}
                variant="light"
              >
                Publish jobs
              </Button>
              <Button leftIcon={<UserIcon width={16} />} variant="light">
                Contacts
              </Button>
            </Group>
            <ShowIf if={lastOrganization}>
              <NavLink
                to={`/app/organizations/${lastOrganization?.id}/details`}
              >
                <Group>
                  <Text className="hidden md:block" size="sm">
                    {lastOrganization?.name}
                  </Text>
                  <Avatar
                    size="sm"
                    src={lastOrganization?.photography}
                    title={lastOrganization?.name}
                  >
                    {lastOrganization?.name?.[0]}
                  </Avatar>
                </Group>
              </NavLink>
            </ShowIf>
          </Group>
        </Paper>
      </RequirePermission>
      <Container className="px-container-wrapper">
        <Title mb={2} order={4}>
          <ShowIfElse
            if={userProfile?.getUserProfile?.city}
            else={"Recommended jobs"}
          >
            Jobs of interest in:{" "}
            {`${userProfile?.getUserProfile?.city?.country.name}, ${userProfile?.getUserProfile?.city?.name}`}
          </ShowIfElse>
        </Title>
        <Text mb={10} color="dimmed" size={13}>
          {totalElements} results
        </Text>
        <Divider />
        {jobs.map(
          (jl, idx) =>
            jl && (
              <div key={jl.id}>
                <JobListingItem data={jl} />
                {idx !== jobs.length - 1 && <Divider />}
              </div>
            )
        )}
        <div className="px-jobs-pagination flex justify-between items-center mt-4">
          <Select
            data={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
            styles={{
              root: {
                display: "flex",
                alignItems: "center",
              },
              label: {
                marginRight: "10px",
              },
              input: {
                width: "5rem",
              },
            }}
            label="Page size"
            defaultValue={ps.toString()}
            value={ps.toString()}
            onChange={(v) => {
              setPs(parseInt(v ?? "10"));
              setP(1);
            }}
          />
          <Pagination
            total={totalPages}
            page={p}
            onChange={setP}
            initialPage={0}
            position="right"
            grow
          />
        </div>
      </Container>
    </div>
  );
}
