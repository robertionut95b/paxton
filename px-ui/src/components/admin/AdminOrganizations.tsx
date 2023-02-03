import { useGetAllOrganizationsQuery } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { TypeColumn } from "@inovua/reactdatagrid-community/types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Button,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const columns: TypeColumn[] = [
  {
    name: "id",
    header: "ID",
    defaultWidth: 80,
  },
  {
    name: "photography",
    header: "Logo",
    defaultWidth: 80,
    render: ({ value, data }) =>
      value ? (
        <Image src={value} width={24} />
      ) : (
        <Avatar>{data.name[0]}</Avatar>
      ),
  },
  {
    name: "name",
    header: "Name",
  },
  {
    name: "description",
    header: "Description",
  },
  {
    name: "industry",
    header: "Industry",
  },
  {
    name: "location",
    header: "Location",
  },
];

const AdminOrganizations = () => {
  const navigate = useNavigate();
  const { data: organizationData, isLoading } = useGetAllOrganizationsQuery(
    graphqlRequestClient,
    {}
  );
  const { isDarkMode } = useDarkMode();

  const renderRowContextMenu = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (menuProps: any, { rowProps }: { rowProps: any }) => {
      menuProps.autoDismiss = true;
      menuProps.items = [
        {
          label: "Edit organization",
          onClick: () => navigate(`update/${rowProps.data.id}`),
        },
        {
          label: "Publish job listing",
          onClick: () => navigate(`publish/${rowProps.data.id}`),
        },
        {
          label: "Organization page",
          onClick: () => navigate(`/app/organizations/${rowProps.data.id}`),
        },
        {
          label: "Show recruiters",
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading)
    return (
      <Paper shadow="xs" p="md">
        <Loader size="sm" variant="dots" />
      </Paper>
    );
  if (!organizationData?.getAllOrganizations)
    return <Text>There is nothing to show</Text>;

  const organizations = organizationData.getAllOrganizations;

  return (
    <Stack spacing={"sm"}>
      <Paper shadow="xs" p="md">
        <Group position="apart" mb="sm">
          <Title order={5}>Organizations</Title>
          <Button
            component={NavLink}
            to="new"
            rightIcon={<PlusCircleIcon width={20} />}
          >
            New record
          </Button>
        </Group>
        <ReactDataGrid
          columns={columns}
          idProperty="id"
          dataSource={organizations}
          theme={isDarkMode ? "default-dark" : "default-light"}
          renderRowContextMenu={renderRowContextMenu}
          pagination
          enableColumnAutosize
          style={{
            minHeight: 350,
          }}
        />
      </Paper>
      <Outlet />
    </Stack>
  );
};

export default AdminOrganizations;
