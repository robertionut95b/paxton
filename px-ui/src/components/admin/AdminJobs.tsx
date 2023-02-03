import { useGetAllJobsQuery } from "@gql/generated";
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
import { NavLink } from "react-router-dom";
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
  const { isDarkMode } = useDarkMode();
  const { data: jobsData, isLoading } = useGetAllJobsQuery(
    graphqlRequestClient,
    {}
  );

  if (isLoading)
    return (
      <Paper shadow="xs" p="md">
        <Loader size="sm" variant="dots" />
      </Paper>
    );
  if (!jobsData?.getAllJobs) return <Text>There is nothing to show</Text>;

  return (
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
          dataSource={jobsData.getAllJobs}
          pagination
          theme={isDarkMode ? "default-dark" : "default-light"}
          style={{
            minHeight: 350,
          }}
        />
      </Paper>
    </Stack>
  );
};

export default AdminJobs;
