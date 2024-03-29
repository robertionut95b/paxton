import ExpandableText from "@components/visibility/ExpandableText";
import {
  GetAllJobListingsQuery,
  JobListing,
  Organization,
} from "@gql/generated";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Paper, Title } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function JobOrganizationAboutCard({
  organization,
}: {
  organization:
    | NonNullable<
        NonNullable<
          NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
        >[number]
      >["organization"]
    | Omit<JobListing["organization"], "recruitmentProcess">
    | Organization;
}) {
  return (
    <Paper shadow={"xs"} p="md">
      <Group position="apart">
        <Title mb={"md"} order={4}>
          About the company
        </Title>
        <Button variant="outline" leftIcon={<PlusIcon width={16} />}>
          Follow
        </Button>
      </Group>
      <NavLink to={`/app/organizations/${organization.slugName}`}>
        <Group>
          <Avatar src={organization.photography} mb={"md"}>
            {organization.name[0]}
          </Avatar>
          <Title mb={8} order={5}>
            {organization.name}
          </Title>
        </Group>
      </NavLink>
      <ExpandableText size={"sm"}>{organization.description}</ExpandableText>
    </Paper>
  );
}
