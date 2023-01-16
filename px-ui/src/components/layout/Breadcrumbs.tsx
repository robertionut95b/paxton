import {
  FieldType,
  Operator,
  useGetAllJobListingsQuery,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Breadcrumbs as MantineBreadCrumbs,
  Button,
  Loader,
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

const OrgPageCrumb = ({ match }: BreadcrumbComponentProps<string>) => {
  const orgIdParam = match.params.organizationId;
  const { data: organizationData, isLoading } = useGetOrganizationByIdQuery(
    graphqlRequestClient,
    {
      organizationId: orgIdParam as string,
    },
    {
      enabled: !!orgIdParam,
    }
  );
  if (isLoading) return <Loader size={"xs"} />;
  if (!organizationData?.getOrganizationById) return orgIdParam;
  const name = organizationData.getOrganizationById.name;

  if (!name) return orgIdParam;

  return <Text>{name}</Text>;
};

const excPaths = ["/", "/app"];

const routes = [
  {
    path: "/app/jobs/view/:jobId",
    breadcrumb: JobPageCrumb,
  },
  {
    path: "/app/organizations/:organizationId/",
    breadcrumb: OrgPageCrumb,
  },
];

const Breadcrumbs = ({ excludePaths = [] }: { excludePaths?: string[] }) => {
  // @ts-expect-error(types-error)
  const breadcrumbs = useBreadcrumbs(routes, {
    excludePaths: [...excPaths, ...excludePaths],
  });
  return (
    <MantineBreadCrumbs separator="»">
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
