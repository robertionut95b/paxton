import ExpandableText from "@components/ui/text/ExpandableText";
import { Study } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { format } from "date-fns";
import { Else, If, Then, When } from "react-if";
import { NavLink } from "react-router-dom";

export default function StudyCard({
  study,
  withDivider = false,
}: Readonly<{
  study: Omit<Study, "userProfile">;
  withDivider?: boolean;
}>) {
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
        <div className="px-study-card flex w-full justify-between">
          <div className="px-study-card-content grow">
            <Text className="font-bold" size="md">
              {study?.institution.name ?? "No title provided"}
            </Text>
            <Text size="sm" className="px-study-diploma">
              <When condition={study?.certification?.name}>
                {study?.certification?.name ?? "No license provided"}
              </When>{" "}
              <When condition={study?.domainStudy?.name}>
                in {study?.domainStudy?.name}
              </When>
              <When condition={study?.degree}> · {study?.degree}</When>
            </Text>
            <Text size="sm" className="px-study-years" color="dimmed" mb={8}>
              {format(new Date(study?.startDate), "yyyy")} -{" "}
              {
                <If condition={!!study?.endDate}>
                  <Then>
                    {study.endDate && format(new Date(study?.endDate), "yyyy")}
                  </Then>
                  <Else>present</Else>
                </If>
              }
            </Text>
            <If condition={study?.description}>
              <Then>
                <ExpandableText
                  size="sm"
                  className="px-study-description"
                  color="dark"
                >
                  {study?.description}
                </ExpandableText>
              </Then>
              <Else>
                <Text size="sm">No description provided</Text>
              </Else>
            </If>
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
