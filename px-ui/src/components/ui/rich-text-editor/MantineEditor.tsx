import Editor, { EditorProps } from "@components/ui/rich-text-editor/Editor";
import { InputBase, InputBaseProps } from "@mantine/core";
import { useDarkMode } from "usehooks-ts";

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
