/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetAllJobListingsQuery } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { TypeColumn } from "@inovua/reactdatagrid-community/types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Badge,
  Button,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const columns: TypeColumn[] = [
  {
    name: "id",
    header: "ID",
    defaultVisible: false,
  },
  {
    name: "title",
    header: "Title",
  },
  {
    name: "description",
    header: "Description",
  },
  {
    name: "organization",
    header: "Organization",
    render: ({ value, data }) =>
      value ? (
        <Image src={value?.photography} width={24} />
      ) : (
        <Avatar>{data.organization.name[0]}</Avatar>
      ),
  },
  {
    name: "availableFrom",
    header: "From",
  },
  {
    name: "availableTo",
    header: "To",
  },
  {
    name: "isActive",
    header: "Status",
    render: ({ value }) => (
      <Badge color={value ? "green" : "red"} variant="dot">
        {value ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    name: "numberOfVacancies",
    header: "Spots",
  },
  {
    name: "contractType",
    header: "Contract type",
    render: ({ value }) => prettyEnumValue(value),
  },
  {
    name: "workType",
    header: "Work type",
    render: ({ value }) => prettyEnumValue(value),
  },
  {
    name: "city",
    header: "City",
    render: ({ value }) => value.name,
  },
  {
    name: "country",
    header: "Country",
    render: ({ data }) => data.city.country.name,
  },
  {
    name: "job",
    header: "Job",
    render: ({ value }) => value.name,
  },
];

const AdminJobListings = () => {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(5);
  const { isDarkMode } = useDarkMode();
  const { data: jobsData, isLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
      },
    }
  );
  if (isLoading)
    return (
      <Paper shadow="xs" p="md">
        <Loader size="sm" variant="dots" />
      </Paper>
    );
  if (!jobsData?.getAllJobListings)
    return <Text>There is nothing to show</Text>;

  const jobsListings = jobsData.getAllJobListings.list ?? [];

  return (
    <Stack spacing={"sm"}>
      <Paper shadow="xs" p="md">
        <Group position="apart" mb="sm">
          <Title order={5}>Job listings</Title>
          <Button
            component={NavLink}
            to="new"
            rightIcon={<PlusCircleIcon width={20} />}
            disabled
          >
            New record
          </Button>
        </Group>
        <ReactDataGrid
          columns={columns}
          idProperty="id"
          dataSource={jobsListings}
          pagination
          theme={isDarkMode ? "default-dark" : "default-light"}
          limit={ps}
          style={{
            minHeight: 350,
          }}
        />
      </Paper>
      <Outlet />
    </Stack>
  );
};

export default AdminJobListings;
