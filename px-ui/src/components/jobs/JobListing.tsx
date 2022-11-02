import { JobListing } from "@gql/generated";
import { Paper, Text, Title } from "@mantine/core";
import formatDistance from "date-fns/formatDistance";

export default function JobListingItem({
  data: { title, organization, location, availableFrom },
}: {
  data: JobListing;
}) {
  return (
    <Paper>
      <Title order={5}>{title}</Title>
      <ul>
        <li>{organization.name}</li>
        <li>{location}</li>
        <li>
          <Text size="xs" color="dimmed">
            {formatDistance?.(new Date(), new Date(availableFrom), {
              addSuffix: true,
            }) ?? "Invalid date"}
          </Text>
        </li>
      </ul>
    </Paper>
  );
}
