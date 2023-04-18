import { useAuth } from "@auth/useAuth";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import PageFooter from "@components/layout/PageFooter";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  FieldType,
  Operator,
  useFindRecruitersAdvSearchQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Anchor, Grid, Paper, Stack, Title } from "@mantine/core";
import AccessDenied from "@routes/AccessDenied";
import NotFoundPage from "@routes/NotFoundPage";
import { NavLink, Outlet, useParams } from "react-router-dom";

const OrganizationSettings = () => {
  const { user } = useAuth();
  const { organizationSlug } = useParams();

  const { data: organizationData, isLoading: isOrganizationLoading } =
    useGetOrganizationBySlugNameQuery(graphqlRequestClient, {
      slugName: organizationSlug as string,
    });

  const { data: recruitersData, isLoading: isRecruitersLoading } =
    useFindRecruitersAdvSearchQuery(graphqlRequestClient, {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
        filters: [
          {
            fieldType: FieldType.String,
            key: "organization.slugName",
            operator: Operator.Equal,
            value: organizationSlug as string,
          },
        ],
      },
    });

  if (isRecruitersLoading || isOrganizationLoading)
    return <ApplicationSpinner />;

  if (!organizationData?.getOrganizationBySlugName) return <NotFoundPage />;

  if (
    !recruitersData?.findRecruitersAdvSearch?.list?.find(
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
              <Anchor size="sm" variant="text" component={NavLink} to="">
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
                Recruiters in organization
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
