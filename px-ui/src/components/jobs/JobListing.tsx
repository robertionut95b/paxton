import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetAllJobListingsQuery } from "@gql/generated";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Anchor, Avatar, Group, Paper, Text, Title } from "@mantine/core";
import {
  differenceInBusinessDays,
  differenceInDays,
  formatDistanceToNowStrict,
} from "date-fns";
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
  compact = false,
  navigable = true,
}: {
  data: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
      >
    >[number]
  >;
  compact?: boolean;
  navigable?: boolean;
}) {
  return (
    <Paper py="md" px="xs">
      <div className="flex gap-x-6">
        {compact === false && (
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
        )}
        <div className="px-job-card-details flex-grow overflow-auto">
          <Title order={5} color="violet">
            <ShowIfElse if={navigable} else={title}>
              <Anchor component={NavLink} to={`/app/jobs/view/${id}`}>
                {title}
              </Anchor>
            </ShowIfElse>
          </Title>
          <ul>
            <li>
              <ShowIfElse
                if={navigable}
                else={<Text size={"md"}>{organization.name}</Text>}
              >
                <Anchor
                  component={NavLink}
                  to={`/app/organizations/${organization.slugName}`}
                >
                  <Text size={"md"}>{organization.name}</Text>
                </Anchor>
              </ShowIfElse>
            </li>
            <li>
              <Text my={2} size={"sm"} truncate>
                {description}
              </Text>
            </li>
            <li>
              <Group spacing={2}>
                <MapPinIcon width={14} />
                <Text mt={2} size={"sm"}>
                  {city.name}, {city.country.name}
                </Text>
              </Group>
            </li>
            <li>
              <Group>
                <ShowIfElse
                  if={
                    differenceInDays(new Date(availableFrom), new Date()) !== 0
                  }
                  else={
                    <Text mt={2} size="xs" color="dimmed">
                      Today
                    </Text>
                  }
                >
                  <Text mt={2} size="xs" color="dimmed">
                    {formatDistanceToNowStrict?.(new Date(availableFrom), {
                      addSuffix: true,
                    }) ?? "Invalid date"}
                  </Text>
                </ShowIfElse>
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
