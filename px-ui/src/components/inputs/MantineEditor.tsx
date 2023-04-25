import { InputBase, InputBaseProps } from "@mantine/core";
import { useDarkMode } from "usehooks-ts";
import Editor, { EditorProps } from "./Editor/Editor";

const MantineEditor = (props: InputBaseProps & EditorProps) => {
  const { isDarkMode } = useDarkMode();
  return (
    <InputBase
      className={isDarkMode ? "ck-editor-dark" : "" + props.className}
      component={Editor}
      {...props}
    />
  );
};

export default MantineEditor;
