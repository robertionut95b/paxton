import MantineEditor from "@components/inputs/MantineEditor";

const JobDescriptionSection = ({ description }: { description: string }) => {
  return <MantineEditor readOnly initialValue={description} disabled />;
};

export default JobDescriptionSection;
