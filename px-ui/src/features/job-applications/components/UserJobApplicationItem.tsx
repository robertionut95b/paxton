import { Routes } from "@app/routes";
import { GetMyApplicationsQuery } from "@gql/generated";
import {
  BuildingOfficeIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { intlFormatDistance } from "date-fns";
import { NavLink } from "react-router-dom";

type UserJobApplicationItemProps = {
  application: NonNullable<
    NonNullable<GetMyApplicationsQuery["getMyApplications"]>[number]
  >;
};

const UserJobApplicationItem = ({
  application: { dateOfApplication, jobListing },
}: UserJobApplicationItemProps) => {
  return (
    <Grid align="center" justify="space-between" grow>
      <Grid.Col className="self-start" span={"content"}>
        <Avatar mt="xs" size="md" src={jobListing.organization.photography}>
          {jobListing.organization.name}
        </Avatar>
      </Grid.Col>
      <Grid.Col span={9}>
        <Stack spacing={2}>
          <Text size="md" weight="bold">
            <Anchor
              component={NavLink}
              to={Routes.Jobs.View.Details.buildPath({
                jobId: jobListing.id,
              })}
            >
              {jobListing.title}
            </Anchor>
          </Text>
          <Group spacing={5} align="center">
            <BuildingOfficeIcon width={14} />
            <Anchor
              to={Routes.Organizations.Details.buildPath({
                organizationSlug: jobListing.organization.slugName,
              })}
              component={NavLink}
            >
              <Text size="sm"> {jobListing.organization.name}</Text>
            </Anchor>
          </Group>
          <Group spacing={5}>
            <MapPinIcon width={14} />
            <Text
              size="sm"
              color="dimmed"
            >{`${jobListing.city.name}, ${jobListing.city.country.name}`}</Text>
          </Group>
          {dateOfApplication && (
            <Group mt="sm" spacing={5} align="center">
              <ClockIcon width={14} />
              <Text size="xs" color="dimmed">
                Applied{" "}
                {intlFormatDistance(new Date(dateOfApplication), new Date(), {
                  unit: "day",
                })}
              </Text>
            </Group>
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={"content"}>
        <ActionIcon size="lg" variant="subtle">
          <EllipsisHorizontalIcon width={16} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
};

export default UserJobApplicationItem;
