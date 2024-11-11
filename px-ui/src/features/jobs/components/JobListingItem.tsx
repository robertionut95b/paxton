import { Routes } from "@app/routes";
import { GetAllJobListingsQuery } from "@gql/generated";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Anchor, Avatar, Group, Paper, Text, Title } from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { differenceInBusinessDays, intlFormatDistance } from "date-fns";
import { Else, If, Then, When } from "react-if";
import { NavLink } from "react-router-dom";

type JobListingItemProps = {
  data: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
      >
    >[number]
  >;
  compact?: boolean;
  navigable?: boolean;
};

export default function JobListingItem({
  data: { id, title, organization, city, availableFrom, availableTo, workType },
  compact = false,
  navigable = true,
}: Readonly<JobListingItemProps>) {
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
            <If condition={navigable}>
              <Then>
                <Anchor
                  component={NavLink}
                  to={Routes.Jobs.View.Details.buildPath({ jobId: id })}
                >
                  {title}
                </Anchor>
              </Then>
              <Else>{title}</Else>
            </If>
          </Title>
          <ul>
            <li>
              <If condition={navigable}>
                <Then>
                  <Anchor
                    component={NavLink}
                    to={Routes.Organizations.Details.buildPath({
                      organizationSlug: organization.slugName,
                    })}
                  >
                    <Text size={"sm"}>{organization.name}</Text>
                  </Anchor>
                </Then>
                <Else>
                  <Text size={"md"}>{organization.name}</Text>
                </Else>
              </If>
            </li>
            <li>
              <Group spacing={2} align="center" mt={2}>
                <MapPinIcon width={14} />
                <Text size={"sm"}>
                  {city.name}, {city.country.name} {" - "}
                </Text>
                <Text color="dimmed" size={"sm"}>
                  {prettyEnumValue(workType)} work
                </Text>
              </Group>
            </li>
            <li>
              <Group spacing={"sm"}>
                <Group spacing={4}>
                  <ClockIcon width={14} />
                  <Text mt={2} size="xs" color="dimmed">
                    {intlFormatDistance(new Date(availableFrom), new Date(), {
                      unit: "day",
                    })}
                  </Text>
                </Group>
                <When
                  condition={
                    availableTo &&
                    differenceInBusinessDays(
                      new Date(availableTo),
                      new Date(),
                    ) <= 3
                  }
                >
                  <Group spacing={4}>
                    <ClockIcon width={14} color="red" />
                    <Text mt={2} size="xs" color="red">
                      expires{" "}
                      {intlFormatDistance(new Date(availableTo), new Date(), {
                        unit: "day",
                      })}
                    </Text>
                  </Group>
                </When>
              </Group>
            </li>
          </ul>
        </div>
      </div>
    </Paper>
  );
}
