import ApplicationJobExpire from "@components/application/ApplicationJobExpire";
import ApplicationJobExtend from "@components/application/ApplicationJobExtend";
import { ContractType } from "@gql/generated";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
  MapIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button, Group, Paper, Text, Title } from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { intlFormatDistance } from "date-fns";
import { Else, If, Then } from "react-if";
import { NavLink } from "react-router-dom";

type ApplicationJobHeroProps = {
  jobTitle: string;
  viewUrl: string;
  editUrl: string;
  jobIsActive: boolean;
  contractType: ContractType;
  availableFrom: Date;
  availableTo: Date;
};

const ApplicationJobHero = ({
  jobTitle,
  viewUrl,
  editUrl,
  jobIsActive,
  contractType,
  availableFrom,
  availableTo,
}: ApplicationJobHeroProps) => {
  return (
    <Paper shadow={"xs"} p="md">
      <Group position="apart" align={"center"} mb={"sm"}>
        <Title order={3}>{jobTitle}</Title>
        <Group spacing={"xs"} align="center">
          <Button
            component={NavLink}
            to={viewUrl}
            variant="light"
            leftIcon={<LinkIcon width={16} />}
          >
            View
          </Button>
          <Button
            component={NavLink}
            to={editUrl}
            variant="light"
            leftIcon={<PencilIcon width={16} />}
          >
            Edit
          </Button>
          <If condition={jobIsActive}>
            <Then>
              <ApplicationJobExpire>
                <Button variant="filled" leftIcon={<EyeSlashIcon width={16} />}>
                  Stop candidature
                </Button>
              </ApplicationJobExpire>
            </Then>
            <Else>
              <ApplicationJobExtend>
                <Button variant="light" leftIcon={<EyeIcon width={16} />}>
                  Extend
                </Button>
              </ApplicationJobExtend>
            </Else>
          </If>
        </Group>
      </Group>
      <Group spacing={"md"}>
        <Group spacing={5}>
          <BriefcaseIcon width={16} />
          <Text size="sm">{prettyEnumValue(contractType)} contract</Text>
        </Group>
        <Group spacing={5}>
          <MapIcon width={16} />
          <Text size="sm">Remote/On-site work</Text>
        </Group>
        <Group spacing={5}>
          <CalendarDaysIcon width={16} />
          <Text size="sm">
            {new Date(availableFrom) > new Date() ? "Publishes" : "Published"}{" "}
            {intlFormatDistance(new Date(availableFrom), new Date(), {
              unit: "day",
            })}
          </Text>
        </Group>
        <Group spacing={5}>
          <CalendarDaysIcon width={16} />
          <Text size="sm">
            Closing{" "}
            {intlFormatDistance(new Date(availableTo), new Date(), {
              unit: "day",
            }) ?? "Invalid date"}
          </Text>
        </Group>
      </Group>
    </Paper>
  );
};

export default ApplicationJobHero;
