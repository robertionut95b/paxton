import { Avatar, Group, Paper, Text, Timeline } from "@mantine/core";

export default function ExperienceCard() {
  return (
    <Paper>
      <Group noWrap>
        <Avatar className="self-start" size={"lg"} color={"gray"}>
          P
        </Avatar>
        <div className="px-experience-card">
          <div className="px-experience-heading mb-6">
            <Text className="font-bold" size="md">
              Paxton, Inc.
            </Text>
            <Text className="px-study-summary-years">7 years and 4 months</Text>
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
              <Timeline.Item>
                <Text size="md">Software Developer</Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-job-type"
                  color="dimmed"
                >
                  Full time contract
                </Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-years"
                  color="dimmed"
                  mb={8}
                >
                  aug. 2012 - present ·{" "}
                  <span className="text-xs">10 years</span>
                </Text>
                <Text
                  className="px-timeline-exp-description"
                  color="dark"
                  size="sm"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ac arcu consectetur, cursus nulla sed, interdum lectus. Sed
                  tristique nibh sit amet nulla gravida suscipit. Ut nec erat
                  sem. Donec a arcu ex. Aliquam erat sapien, tincidunt non
                  gravida et, porta sed metus. Curabitur consequat, ligula ac
                  iaculis sodales, felis sem cursus metus, vel semper ipsum quam
                  non enim. Morbi ut molestie sapien. Sed mollis accumsan lorem
                  vel auctor.
                </Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text size="md">Junior Software Developer</Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-job-type"
                  color="dimmed"
                >
                  Full time contract
                </Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-years"
                  color="dimmed"
                  mb={8}
                >
                  jan. 2010 - jul. 2012 ·{" "}
                  <span className="text-xs">2 years 1 months</span>
                </Text>
                <Text
                  className="px-timeline-exp-description"
                  color="dark"
                  size="sm"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ac arcu consectetur, cursus nulla sed, interdum lectus. Sed
                  tristique nibh sit amet nulla gravida suscipit. Ut nec erat
                  sem. Donec a arcu ex. Aliquam erat sapien, tincidunt non
                  gravida et, porta sed metus. Curabitur consequat, ligula ac
                  iaculis sodales, felis sem cursus metus, vel semper ipsum quam
                  non enim. Morbi ut molestie sapien. Sed mollis accumsan lorem
                  vel auctor.
                </Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text size="md">Trainee Software Developer</Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-job-type"
                  color="dimmed"
                >
                  Part-time contract
                </Text>
                <Text
                  size="sm"
                  className="px-timeline-exp-years"
                  color="dimmed"
                  mb={8}
                >
                  ar mar. 2009 - dec. 2010 ·{" "}
                  <span className="text-xs">1 years 11 months</span>
                </Text>
                <Text
                  className="px-timeline-exp-description"
                  color="dark"
                  size="sm"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ac arcu consectetur, cursus nulla sed, interdum lectus. Sed
                  tristique nibh sit amet nulla gravida suscipit. Ut nec erat
                  sem. Donec a arcu ex. Aliquam erat sapien, tincidunt non
                  gravida et, porta sed metus. Curabitur consequat, ligula ac
                  iaculis sodales, felis sem cursus metus, vel semper ipsum quam
                  non enim. Morbi ut molestie sapien. Sed mollis accumsan lorem
                  vel auctor.
                </Text>
              </Timeline.Item>
            </Timeline>
          </div>
        </div>
      </Group>
    </Paper>
  );
}
