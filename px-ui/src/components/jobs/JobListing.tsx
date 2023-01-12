import ShowIf from "@components/visibility/ShowIf";
import { JobListing } from "@gql/generated";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Anchor, Avatar, Group, Paper, Text, Title } from "@mantine/core";
import { differenceInBusinessDays, formatDistanceToNowStrict } from "date-fns";
import { NavLink } from "react-router-dom";

export default function JobListingItem({
  data: {
    id,
    title,
    description,
    organization,
    city,
    availableFrom,
    availableTo,
  },
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
            <Anchor component={NavLink} to={`/app/jobs/view/${id}`}>
              {title}
            </Anchor>
          </Title>
          <ul>
            <li>
              <Anchor
                component={NavLink}
                to={`/app/organizations/${organization.id}/details`}
                color="dark"
              >
                <Text size={"md"}>{organization.name}</Text>
              </Anchor>
            </li>
            <li>
              <Text my={2} size={"sm"} truncate>
                {description}
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
              <Group>
                <Text mt={2} size="xs" color="dimmed">
                  {formatDistanceToNowStrict?.(new Date(availableFrom), {
                    addSuffix: true,
                  }) ?? "Invalid date"}
                </Text>
                {availableTo && (
                  <ShowIf
                    if={
                      differenceInBusinessDays(
                        new Date(availableTo),
                        new Date()
                      ) <= 3
                    }
                  >
                    <Group spacing={4}>
                      <ClockIcon width={16} color="red" />
                      <Text mt={2} size="xs" color="red">
                        expires{" "}
                        {formatDistanceToNowStrict?.(new Date(availableTo), {
                          addSuffix: true,
                        }) ?? "Invalid date"}
                      </Text>
                    </Group>
                  </ShowIf>
                )}
              </Group>
            </li>
          </ul>
        </div>
      </div>
    </Paper>
  );
}
