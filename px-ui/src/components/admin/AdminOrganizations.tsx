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
import { NavLink } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const columns: TypeColumn[] = [
  {
    name: "id",
    header: "ID",
    defaultVisible: false,
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
  const { data: organizationData, isLoading } = useGetAllOrganizationsQuery(
    graphqlRequestClient,
    {}
  );
  const { isDarkMode } = useDarkMode();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRowContextMenu = useCallback((menuProps: any) => {
    menuProps.autoDismiss = true;
    menuProps.items = [
      {
        label: "Row details",
        onClick: () => {
          menuProps.onDismiss();
        },
      },
      {
        label: "Show recruiters",
      },
    ];
  }, []);

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
            rightIcon={<PlusCircleIcon width={16} />}
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
          enableColumnAutosize
        />
      </Paper>
    </Stack>
  );
};

export default AdminOrganizations;
