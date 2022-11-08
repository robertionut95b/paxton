import { JobListing } from "@gql/generated";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Avatar, Group, Paper, Text, Title } from "@mantine/core";
import formatDistance from "date-fns/formatDistance";

export default function JobListingItem({
  data: { title, description, organization, city, availableFrom },
}: {
  data: JobListing;
}) {
  return (
    <Paper className="p-4">
      <div className="flex gap-x-6">
        <div className="px-job-card-heading mt-1.5">
          <Avatar
            color={"violet"}
            size={48}
            src={organization?.photography}
            styles={{
              image: {
                objectFit: "contain",
              },
            }}
          >
            {organization.name[0]}
          </Avatar>
        </div>
        <div className="px-job-card-details flex-grow">
          <Title order={5} color="violet">
            {title}
          </Title>
          <ul>
            <li>
              <Text size={"md"}>{organization.name}</Text>
            </li>
            <li>
              <Text my={2} size={"sm"}>
                {`${description.slice(0, 200)} ...`}
              </Text>
            </li>
            <li>
              <Group spacing={2}>
                <MapPinIcon width={14} color="indigo" />
                <Text mt={2} size={"sm"}>
                  {city.name} {city.country.name}
                </Text>
              </Group>
            </li>
            <li>
              <Text mt={2} size="xs" color="dimmed">
                {formatDistance?.(new Date(availableFrom), new Date(), {
                  addSuffix: true,
                }) ?? "Invalid date"}
              </Text>
            </li>
          </ul>
        </div>
      </div>
    </Paper>
  );
}
