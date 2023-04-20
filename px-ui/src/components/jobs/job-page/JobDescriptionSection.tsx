import ExpandableText from "@components/visibility/ExpandableText";
import { Box, Title } from "@mantine/core";

const JobDescriptionSection = ({ description }: { description: string }) => {
  return (
    <Box>
      <Title mb={"md"} order={4}>
        About the job
      </Title>
      <Title mb={"md"} order={5} weight="normal">
        Job description
      </Title>
      <ExpandableText size={"sm"}>{description}</ExpandableText>
    </Box>
  );
};

export default JobDescriptionSection;
