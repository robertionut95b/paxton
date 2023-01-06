import ShowIf from "@components/visibility/ShowIf";
import { GetRelatedJobListingsQuery } from "@gql/generated";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Anchor, Avatar, Card, Group, Space, Text, Title } from "@mantine/core";
import { formatDistanceToNowStrict } from "date-fns";
import { NavLink } from "react-router-dom";

type JobListingCardProps = {
  data: NonNullable<
    NonNullable<GetRelatedJobListingsQuery["getRelatedJobListings"]>[number]
  >;
};

const JobListingCard = ({
  data: { id, title, organization, city, availableFrom, applications },
}: JobListingCardProps) => {
  return (
    <Card shadow="sm" p="lg" radius="sm" withBorder h="100%">
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
        <Anchor color="dark" component={NavLink} to={`/app/jobs/view/${id}`}>
          {title}
        </Anchor>
      </Title>
      <Text mt={2} size={"sm"} color="dimmed">
        {city.name} {city.country.name}
      </Text>
      <Space h="lg" />
      <Group spacing={4}>
        <Group spacing={2}>
          <ClockIcon width={16} />
          <Text size={13}>
            {formatDistanceToNowStrict(new Date(availableFrom), {
              addSuffix: true,
            }) ?? "Invalid date"}
          </Text>
        </Group>
        <ShowIf if={applications && applications.length > 0}>
          {" - "}
          <Text size={13}>{applications?.length} candidates</Text>
        </ShowIf>
      </Group>
    </Card>
  );
};

export default JobListingCard;
