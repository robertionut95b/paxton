import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ExpandableText from "@components/visibility/ExpandableText";
import { useGetOrganizationByIdQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Paper, Stack, Title } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { useParams } from "react-router-dom";

const OrganizationAboutPanel = () => {
  const { organizationId } = useParams();
  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationByIdQuery(
      graphqlRequestClient,
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );
  const organizationItem = organization?.getOrganizationById;

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationById || !organizationItem)
    return <NotFoundPage />;

  const { description } = organizationItem;

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Title order={5}>About</Title>
        <ExpandableText size="sm">{description}</ExpandableText>
      </Stack>
    </Paper>
  );
};

export default OrganizationAboutPanel;
