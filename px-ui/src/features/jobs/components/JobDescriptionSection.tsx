import MantineEditor from "@components/ui/rich-text-editor/MantineEditor";

const JobDescriptionSection = ({ description }: { description: string }) => {
  return <MantineEditor readOnly initialValue={description} disabled />;
};

export default JobDescriptionSection;
