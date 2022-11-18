import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { Study } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

export default function StudyCard({
  study,
  withDivider = false,
}: {
  study: Omit<Study, "userProfile"> | null;
  withDivider?: boolean;
}) {
  return (
    <Paper>
      <Group noWrap>
        <Avatar
          className="self-start object-cover"
          size={"lg"}
          color={"gray"}
          mx="sm"
          src={study?.institution.photography}
        >
          {study?.institution.name[0]}
        </Avatar>
        <div className="px-study-card flex justify-between w-full">
          <div className="px-study-card-content">
            <Text className="font-bold" size="md">
              {study?.institution.name ?? "No title provided"}
            </Text>
            <Text size="sm" className="px-study-diploma">
              <ShowIf if={study?.certification?.name}>
                {study?.certification?.name ?? "No license provided"}
              </ShowIf>{" "}
              <ShowIf if={study?.domainStudy}>
                in {study?.domainStudy?.name}
              </ShowIf>
              <ShowIf if={study?.degree}> · {study?.degree}</ShowIf>
            </Text>
            <Text size="sm" className="px-study-years" color="dimmed" mb={8}>
              {format(new Date(study?.startDate), "yyyy")} -{" "}
              {
                <ShowIfElse if={study?.endDate} else="present">
                  {format(new Date(study?.endDate), "yyyy")}
                </ShowIfElse>
              }
            </Text>
            <Text size="sm" className="px-study-description" color="dark">
              {study?.description ?? "No description provided"}
            </Text>
            {withDivider && <Divider mt={16} />}
          </div>
          <NavLink to={`studies/${study?.id}/update`}>
            <ActionIcon variant="subtle" color={"violet"}>
              <PencilIcon width={16} />
            </ActionIcon>
          </NavLink>
        </div>
      </Group>
    </Paper>
  );
}
