import { Routes } from "@app/routes";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetMyApplicationForJobListingQuery } from "@gql/generated";
import { Anchor, Group, Paper, Text, Timeline, Title } from "@mantine/core";
import { formatDistanceToNowStrict } from "date-fns";
import { NavLink } from "react-router-dom";

type ApplicationCandidatureTimelineProps = {
  application: NonNullable<
    NonNullable<
      GetMyApplicationForJobListingQuery["getMyApplicationForJobListing"]
    >
  >;
};

const ApplicationCandidatureTimeline = ({
  application: { processSteps, jobListing, id },
}: ApplicationCandidatureTimelineProps) => {
  const [parent] = useAutoAnimate();
  return (
    <Paper shadow={"xs"} p="md">
      <Group mb="md" align="center">
        <Title order={4}>Application timeline</Title>
        <Anchor
          component={NavLink}
          size="xs"
          to={Routes.Jobs.View.Details.RecruitmentApplicationDetails.buildPath({
            jobId: jobListing.id,
            applicationId: id,
          })}
        >
          View application
        </Anchor>
      </Group>
      <Timeline
        active={(processSteps?.length ?? 1) - 1}
        bulletSize={10}
        lineWidth={2}
        ref={parent}
      >
        {processSteps?.map(
          (p) =>
            p && (
              <Timeline.Item
                key={p.id}
                title={p.processStep.step.title}
                lineVariant="solid"
                style={{
                  fontSize: 14,
                }}
              >
                <Text size="xs">
                  {formatDistanceToNowStrict(new Date(p.registeredAt), {
                    addSuffix: true,
                  }) ?? "Invalid date"}
                </Text>
              </Timeline.Item>
            ),
        )}
      </Timeline>
    </Paper>
  );
};

export default ApplicationCandidatureTimeline;
