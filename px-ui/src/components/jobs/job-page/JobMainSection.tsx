import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetAllJobListingsQuery, JobListing } from "@gql/generated";
import {
  BookmarkIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { formatDistanceToNowStrict, isFuture } from "date-fns";

type OmitApplicationFieldsType = NonNullable<
  NonNullable<
    NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
  >[number]
>;

const JobMainSection = ({
  job: {
    organization,
    title,
    city,
    applications,
    availableFrom,
    contractType,
    availableTo,
  },
  applied = false,
}: {
  job: JobListing | OmitApplicationFieldsType;
  applied?: boolean;
}) => {
  return (
    <Paper shadow={"xs"} p="lg">
      <Group position="apart" align={"flex-start"}>
        <ShowIf if={organization}>
          <Avatar size={"md"} src={organization.photography} mb={"md"}>
            {organization.name[0]}
          </Avatar>
        </ShowIf>
        <Group>
          <ActionIcon>
            <ShareIcon width={20} />
          </ActionIcon>
          <ActionIcon>
            <EllipsisHorizontalIcon width={24} />
          </ActionIcon>
        </Group>
      </Group>
      <Title order={3}>{title}</Title>
      <Group spacing={6}>
        <Text size={"sm"}>{organization.name}</Text>
        {" - "}
        <Text size={"sm"}>
          {city.country.name}, {city.name}
        </Text>
        <ShowIf if={applications && applications.length > 0}>
          {" - "}
          <Text size="sm">{applications?.length} candidates</Text>
        </ShowIf>
      </Group>
      <Space h="md" />
      <Stack align={"flex-start"} spacing={"sm"}>
        <Group spacing={5}>
          <CalendarDaysIcon width={16} />
          <Text size={"sm"}>
            Published{" "}
            {formatDistanceToNowStrict(new Date(availableFrom), {
              addSuffix: true,
            }) ?? "Invalid date"}
          </Text>
        </Group>
        <Group spacing={5}>
          <DocumentTextIcon width={16} />
          <Text size="sm">{prettyEnumValue(contractType)} contract</Text>
        </Group>
        <Group spacing={5}>
          <BuildingOfficeIcon width={16} />
          <Text size="sm">{organization.industry} activity line</Text>
        </Group>
        <ShowIf if={applications && applications.length > 0}>
          <Group spacing={5}>
            <BuildingOfficeIcon width={16} />
            <Text size="sm">{applications?.length} candidates</Text>
          </Group>
        </ShowIf>
        <ShowIfElse
          if={availableTo && isFuture(new Date(availableTo))}
          else={
            <Group spacing={4}>
              <XMarkIcon width={16} color="red" />
              <Text color="red" size="sm">
                Candidature is no longer allowed for this job
              </Text>
            </Group>
          }
        >
          <Group>
            <ShowIfElse
              if={!applied}
              else={
                <Button disabled leftIcon={<CheckCircleIcon width={16} />}>
                  Candidature sent
                </Button>
              }
            >
              <Button leftIcon={<CheckCircleIcon width={16} />}>Apply</Button>
            </ShowIfElse>
            <Button variant="light" leftIcon={<BookmarkIcon width={16} />}>
              Save this job
            </Button>
          </Group>
        </ShowIfElse>
      </Stack>
    </Paper>
  );
};

export default JobMainSection;
