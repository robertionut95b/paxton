import ShowIf from "@components/visibility/ShowIf";
import { ClockIcon } from "@heroicons/react/24/outline";
import { JobsDataPropsItem } from "@interfaces/jobs.types";
import {
  Anchor,
  Avatar,
  Group,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { intlFormatDistance } from "date-fns";
import { NavLink } from "react-router-dom";

type JobListingCardProps = {
  job: JobsDataPropsItem;
};

const JobListingCard = ({
  job: { id, title, organization, city, availableFrom, applications },
}: JobListingCardProps) => {
  return (
    <Paper shadow="sm" p="lg" radius="sm" h="100%">
      <Avatar
        color={"violet"}
        size={48}
        src={organization.photography}
        styles={{
          image: {
            objectFit: "contain",
          },
        }}
      >
        {organization.name[0]}
      </Avatar>
      <Space h="md" />
      <Title order={5}>
        <Anchor component={NavLink} to={`/app/jobs/view/${id}`}>
          {title}
        </Anchor>
      </Title>
      <Text mt={2} size={"sm"} color="dimmed">
        {city.name} {city.country.name}
      </Text>
      <Space h="lg" />
      <Group spacing={4}>
        <Group spacing={2}>
          <ClockIcon width={14} />
          <Text size={12}>
            {intlFormatDistance(new Date(availableFrom), new Date(), {
              unit: "day",
              style: "narrow",
            })}
          </Text>
        </Group>
        <ShowIf if={applications && applications.length > 0}>
          {" - "}
          <Text size={12}>{applications?.length} candidates</Text>
        </ShowIf>
      </Group>
    </Paper>
  );
};

export default JobListingCard;
