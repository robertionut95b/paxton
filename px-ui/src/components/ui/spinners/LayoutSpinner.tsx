import { Center, Loader } from "@mantine/core";

const LayoutSpinner = () => {
  return (
    <Center className="px-app-loading">
      <Loader variant={"dots"} />
    </Center>
  );
};

export default LayoutSpinner;
