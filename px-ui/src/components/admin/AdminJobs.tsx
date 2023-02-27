import {
  FieldType,
  Operator,
  useGetAllJobsPaginatedQuery,
} from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { TypeColumn } from "@inovua/reactdatagrid-community/types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const columns: TypeColumn[] = [
  {
    name: "id",
    header: "ID",
  },
  {
    name: "name",
    header: "Name",
  },
  {
    name: "description",
    header: "Description",
  },
];

const AdminJobs = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const searchQuery = {
    page: 0,
    size: 10,
  };
  const { data: jobsData, isLoading } = useGetAllJobsPaginatedQuery(
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      onSuccess: (data) => {
        const list = data.getAllJobsPaginated?.list ?? [];
        list.forEach((e) =>
          queryClient.setQueryData(
            useGetAllJobsPaginatedQuery.getKey({
              searchQuery: {
                filters: [
                  {
                    fieldType: FieldType.Long,
                    key: "id",
                    operator: Operator.Equal,
                    value: e?.id ?? "",
                  },
                ],
              },
            }),
            {
              getAllJobsPaginated: {
                list: [e],
              },
              page: 0,
              totalElements: 1,
              totalPages: 1,
            }
          )
        );
      },
    }
  );

  const renderRowContextMenu = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (menuProps: any, { rowProps }: { rowProps: any }) => {
      menuProps.autoDismiss = true;
      menuProps.items = [
        {
          label: "Edit job",
          onClick: () => navigate(`update/${rowProps.data.id}`),
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
  if (!jobsData?.getAllJobsPaginated?.list)
    return <Text>There is nothing to show</Text>;

  return (
    <>
      <Stack spacing={"sm"}>
        <Paper shadow="xs" p="md">
          <Group position="apart" mb="sm">
            <Title order={5}>Jobs</Title>
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
            dataSource={jobsData.getAllJobsPaginated.list}
            pagination
            theme={isDarkMode ? "default-dark" : "default-light"}
            renderRowContextMenu={renderRowContextMenu}
            enableColumnAutosize
            style={{
              minHeight: 350,
            }}
          />
        </Paper>
      </Stack>
      <Outlet />
    </>
  );
};

export default AdminJobs;
