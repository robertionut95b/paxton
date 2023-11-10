import ExpandableText from "@components/visibility/ExpandableText";
import { Experience } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Avatar,
  Group,
  Paper,
  Text,
  Timeline,
} from "@mantine/core";
import {
  getTimeBetweenInExperience,
  getTotalTimeInOrganizationByExperiences,
} from "@utils/experienceTime";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

export default function ExperienceCard({
  experience,
}: {
  experience: [string, Array<Experience>] | [string, null];
}) {
  const organization = experience?.[1]?.[0]?.organization;
  const experiences = experience?.[1] ?? [];

  return (
    <Paper>
      <Group noWrap>
        <Avatar
          className="self-start"
          size={"lg"}
          color={"gray"}
          src={organization?.photography}
          mx={"sm"}
        >
          {organization?.name[0]}
        </Avatar>
        <div className="px-experience-card w-full">
          <div className="px-experience-heading mb-6">
            <Text className="font-semibold" size="md">
              {organization?.name}
            </Text>
            <Text className="px-study-summary-years" size="sm">
              {getTotalTimeInOrganizationByExperiences(experiences)}
            </Text>
          </div>
          <div className="px-experience-timeline">
            <Timeline
              bulletSize={12}
              lineWidth={2}
              color="violet"
              active={0}
              classNames={{
                itemBullet: "mt-1.5",
              }}
            >
              {experiences.map((e) => (
                <Timeline.Item key={e.id}>
                  <div className="px-experience-wrapper flex justify-between">
                    <div className="px-erperience-timeline-item grow">
                      <Text size="md">{e.title}</Text>
                      <Text
                        size="sm"
                        className="px-timeline-item-experience-location"
                      >
                        {`${e.city?.name}, ${e.city?.country.name}`}
                      </Text>
                      <Text
                        size="sm"
                        className="px-timeline-item-experience-job-type first-letter:uppercase"
                        color="dimmed"
                      >
                        {e.contractType.split("_").join(" ").toLowerCase()}
                      </Text>
                      <Text
                        size="sm"
                        className="px-timeline-item-experience-years"
                        color="dimmed"
                        mb={8}
                      >
                        {format(
                          new Date(e.startDate),
                          "MMM. yyyy",
                        )?.toLowerCase()}{" "}
                        -{" "}
                        {e.endDate
                          ? format(
                              new Date(e.endDate),
                              "MMM. yyyy",
                            )?.toLowerCase()
                          : "present"}{" "}
                        ·{" "}
                        <span className="text-sm">
                          {getTimeBetweenInExperience(
                            new Date(e.startDate),
                            e.endDate ? new Date(e.endDate) : new Date(),
                          )}
                        </span>
                      </Text>
                      <ExpandableText
                        className="px-timeline-item-experience-description"
                        color="dark"
                        size="sm"
                      >
                        {e.description}
                      </ExpandableText>
                    </div>
                    <NavLink to={`experiences/${e.id}/update`}>
                      <ActionIcon variant="subtle" color={"violet"}>
                        <PencilIcon width={16} />
                      </ActionIcon>
                    </NavLink>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      </Group>
    </Paper>
  );
}
