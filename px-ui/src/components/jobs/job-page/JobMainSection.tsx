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
  MapIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Group,
  List,
  Loader,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { intlFormatDistance, isFuture } from "date-fns";
import { NavLink } from "react-router-dom";

type OmitApplicationFieldsType = NonNullable<
  NonNullable<
    NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
  >[number]
>;

type JobMainSectionProps = {
  job: JobListing | OmitApplicationFieldsType;
  applied?: boolean;
  isAllowedCandidature: boolean;
  submitCandidatureFn: () => void;
  isCandidatureLoading: boolean;
};

const JobMainSection = ({
  job: {
    organization,
    title,
    city,
    applications,
    availableFrom,
    contractType,
    availableTo,
    workType,
  },
  applied = false,
  isAllowedCandidature = false,
  submitCandidatureFn,
  isCandidatureLoading = true,
}: JobMainSectionProps) => {
  return (
    <Box>
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
        <Anchor
          size={"sm"}
          variant="link"
          component={NavLink}
          to={`/app/organizations/${organization.slugName}`}
        >
          {organization.name}
        </Anchor>
        {" - "}
        <Text size={"sm"}>
          {city.country.name}, {city.name}
        </Text>
        <ShowIf if={applications && applications.length > 0}>
          {" - "}
          <Text size="sm">{applications?.length} candidate(s)</Text>
        </ShowIf>
      </Group>
      <Space h="md" />
      <List size="sm" spacing={"xs"} center>
        <List.Item icon={<CalendarDaysIcon width={18} />}>
          <Text size={"sm"}>
            Published{" "}
            {intlFormatDistance(new Date(availableFrom), new Date(), {
              unit: "day",
            })}
          </Text>
        </List.Item>
        <List.Item icon={<MapIcon width={18} />}>
          <Text size="sm">{prettyEnumValue(workType)} work</Text>
        </List.Item>
        <List.Item icon={<DocumentTextIcon width={18} />}>
          <Text size="sm">{prettyEnumValue(contractType)} contract</Text>
        </List.Item>
        <List.Item icon={<BuildingOfficeIcon width={18} />}>
          <Text size="sm">
            {organization.activitySector.name} activity line
          </Text>
        </List.Item>
        <ShowIfElse
          if={isFuture(new Date(availableTo))}
          else={
            <List.Item icon={<XMarkIcon width={18} color="red" />}>
              <Text color="red" size="sm">
                Candidature is no longer allowed for this job
              </Text>
            </List.Item>
          }
        >
          <ShowIf if={isAllowedCandidature}>
            <ShowIfElse
              if={isCandidatureLoading}
              else={
                <Group mt="sm">
                  <ShowIfElse
                    if={!applied}
                    else={
                      <Button
                        disabled
                        leftIcon={<CheckCircleIcon width={18} />}
                      >
                        Candidature sent
                      </Button>
                    }
                  >
                    <Button
                      onClick={submitCandidatureFn}
                      leftIcon={<CheckCircleIcon width={18} />}
                    >
                      Apply
                    </Button>
                  </ShowIfElse>
                  <Button
                    variant="light"
                    leftIcon={<BookmarkIcon width={18} />}
                  >
                    Save this job
                  </Button>
                </Group>
              }
            >
              <Loader mt="md" size="xs" variant="dots" />
            </ShowIfElse>
          </ShowIf>
        </ShowIfElse>
      </List>
    </Box>
  );
};

export default JobMainSection;
