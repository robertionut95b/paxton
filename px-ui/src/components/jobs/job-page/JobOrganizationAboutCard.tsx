import ExpandableText from "@components/visibility/ExpandableText";
import { JobListing, Organization } from "@gql/generated";
import { Avatar, Group, Paper, Title } from "@mantine/core";

export default function JobOrganizationAboutCard({
  organization,
  jobDescription,
}: {
  organization: JobListing["organization"] | Organization;
  jobDescription: string;
}) {
  return (
    <Paper shadow={"xs"} p="md">
      <Title mb={"md"} order={4}>
        About the company
      </Title>
      <Group>
        <Avatar src={organization.photography} mb={"md"}>
          {organization.name[0]}
        </Avatar>
        <Title mb={8} order={5}>
          {organization.name}
        </Title>
      </Group>
      <ExpandableText size={"sm"}>{organization.description}</ExpandableText>
    </Paper>
  );
}
