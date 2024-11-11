import { Routes } from "@app/routes";
import NotFoundPage from "@app/routes/NotFoundPage";
import Breadcrumbs from "@components/ui/navigation/Breadcrumbs";
import BlocksLoadingSkeleton from "@components/ui/spinners/BlocksLoadingSkeleton";
import OrganizationJobsTab from "@features/organizations/components/OrganizationJobsTab";
import {
  FieldType,
  Operator,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Paper, Stack, Title } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

export default function RecruitmentPage() {
  const { organizationSlug } = useParams();
  const navigate = useNavigate();

  const { data: organizationData, isInitialLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      },
    );

  const organization = organizationData?.getOrganizationBySlugName;

  if (isLoadingOrganization) return <BlocksLoadingSkeleton />;
  if (!organization) return <NotFoundPage />;

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={[Routes.Organizations.Details.Recruitment.path]}
        />
      </Paper>
      <Paper shadow={"xs"} p="md" className="px-organization-jobs">
        <Title mb={8} order={4}>
          Jobs in company
        </Title>
        <OrganizationJobsTab
          filters={[
            {
              key: "organization.id",
              fieldType: FieldType.Long,
              value: organization.id.toString() ?? "",
              operator: Operator.Equal,
            },
          ]}
          itemClickCb={(jl) => {
            navigate(
              Routes.Organizations.Details.Recruitment.Jobs.Job.buildPath({
                organizationSlug: organizationSlug as string,
                jobId: jl.id.toString(),
              }),
            );
            return undefined;
          }}
        />
      </Paper>
    </Stack>
  );
}
