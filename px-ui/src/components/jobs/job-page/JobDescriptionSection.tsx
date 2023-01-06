import ExpandableText from "@components/visibility/ExpandableText";
import { Paper, Title } from "@mantine/core";

const JobDescriptionSection = ({ description }: { description: string }) => {
  return (
    <Paper shadow={"xs"} p="md">
      <Title mb={"md"} order={4}>
        About the job
      </Title>
      <Title mb={"md"} order={5}>
        Job description
      </Title>
      <ExpandableText size={"sm"}>{description}</ExpandableText>
    </Paper>
  );
};

export default JobDescriptionSection;
