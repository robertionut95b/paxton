import {
  FieldType,
  Operator,
  useGetAllApplicationsQuery,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Loader,
  Breadcrumbs as MantineBreadCrumbs,
  Text,
} from "@mantine/core";
import { NavLink } from "react-router-dom";
import useBreadcrumbs, {
  BreadcrumbComponentProps,
} from "use-react-router-breadcrumbs";

const JobPageCrumb = ({ match }: BreadcrumbComponentProps<string>) => {
  const jobIdParam = match.params.jobId;
  const { data: jobData, isLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            key: "id",
            fieldType: FieldType.Long,
            operator: Operator.Equal,
            value: jobIdParam ?? "0",
          },
        ],
      },
    },
    {
      enabled: !!jobIdParam,
    }
  );
  if (isLoading) return <Loader size={"xs"} />;
  if (!jobData?.getAllJobListings) return jobIdParam;
  const title = jobData.getAllJobListings.list?.[0]?.title;

  if (!title) return jobIdParam;

  return <Text>{title}</Text>;
};

const ApplicationPageCrumb = ({ match }: BreadcrumbComponentProps<string>) => {
  const applicationId = match.params.applicationId;
  const { data: applicationData, isLoading } = useGetAllApplicationsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "id",
            operator: Operator.Equal,
            value: applicationId as string,
          },
        ],
      },
    },
    {
      enabled: !!applicationId,
    }
  );
  console.log("ceva");
  if (isLoading) return <Loader size={"xs"} />;
  if (!applicationData?.getAllApplications) return applicationId;
  if (!applicationData.getAllApplications.list?.[0]) return applicationId;

  const user = applicationData.getAllApplications.list[0].candidate.user;
  const fullName = `${user.firstName} ${user.lastName}`;

  if (!fullName) return applicationId;

  return <Text>{fullName}</Text>;
};

const OrgPageCrumb = ({ match }: BreadcrumbComponentProps<string>) => {
  const orgSlugParam = match.params.organizationSlug;
  const { data: organizationData, isLoading } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: orgSlugParam as string,
      },
      {
        enabled: !!orgSlugParam,
      }
    );
  if (isLoading) return <Loader size={"xs"} />;
  if (!organizationData?.getOrganizationBySlugName) return orgSlugParam;
  const name = organizationData.getOrganizationBySlugName.name;

  if (!name) return orgSlugParam;

  return <Text>{name}</Text>;
};

const excPaths = ["/", "/app"];

const routes = [
  {
    path: "/app/jobs/view/:jobId",
    breadcrumb: JobPageCrumb,
  },
  {
    path: "/app/organizations/:organizationSlug/recruitment/jobs/:jobId",
    breadcrumb: JobPageCrumb,
  },
  {
    path: "/app/organizations/:organizationSlug/",
    breadcrumb: OrgPageCrumb,
  },
  {
    path: "/app/organizations/:organizationSlug/recruitment/jobs/:jobId/applications/:applicationId",
    breadCrumb: ApplicationPageCrumb,
  },
];

const Breadcrumbs = ({ excludePaths = [] }: { excludePaths?: string[] }) => {
  // @ts-expect-error(types-error)
  const breadcrumbs = useBreadcrumbs(routes, {
    excludePaths: [...excPaths, ...excludePaths],
  });
  return (
    <MantineBreadCrumbs
      separator="»"
      styles={(theme) => ({
        separator: {
          marginLeft: theme.spacing.xs - 5,
          marginRight: theme.spacing.xs - 5,
        },
      })}
    >
      {breadcrumbs.map(({ breadcrumb, match }, idx) => (
        <NavLink key={match.pathname} to={match.pathname}>
          <Button
            variant={breadcrumbs.length - 1 === idx ? "light" : "subtle"}
            compact
          >
            {breadcrumb}
          </Button>
        </NavLink>
      ))}
    </MantineBreadCrumbs>
  );
};

export default Breadcrumbs;
