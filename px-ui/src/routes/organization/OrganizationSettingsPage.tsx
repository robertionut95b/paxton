import { useAuth } from "@auth/useAuth";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import PageFooter from "@components/layout/PageFooter";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { useGetAllRecruitersForOrganizationBySlugQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Anchor, Grid, Paper, Stack, Title } from "@mantine/core";
import AccessDenied from "@routes/AccessDenied";
import { NavLink, Outlet, useParams } from "react-router-dom";

const OrganizationSettings = () => {
  const { user } = useAuth();
  const { organizationSlug } = useParams();

  const { data: recruitersData, isLoading: isRecruitersLoading } =
    useGetAllRecruitersForOrganizationBySlugQuery(
      graphqlRequestClient,
      {
        organizationSlug: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      }
    );

  if (isRecruitersLoading) return <ApplicationSpinner />;

  if (
    !recruitersData?.getAllRecruitersForOrganizationBySlug?.find(
      (r) => r?.id.toString() === user?.userId.toString()
    )
  ) {
    return <AccessDenied />;
  }

  return (
    <Stack>
      <Paper p="xs" shadow="xs">
        <Breadcrumbs excludePaths={["/app/organizations"]} />
      </Paper>
      <Grid>
        <Grid.Col md={3}>
          <Paper p="md" shadow="xs">
            <Stack>
              <Title order={6}>Organization settings</Title>
              <Anchor size="sm" variant="text" component={NavLink} to="#">
                General information
              </Anchor>
              <Anchor size="sm" variant="text" component={NavLink} to="process">
                Recruitment process
              </Anchor>
              <Anchor
                size="sm"
                variant="text"
                component={NavLink}
                to="recruiters"
              >
                Recruiters
              </Anchor>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col md={6}>
          <Outlet />
        </Grid.Col>
        <Grid.Col md={3}>
          <PageFooter />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default OrganizationSettings;
