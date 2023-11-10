import { Alignment } from "@ckeditor/ckeditor5-alignment";
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { List } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Undo } from "@ckeditor/ckeditor5-undo";
import Event from "@ckeditor/ckeditor5-utils/src/eventinfo";
import { useMemo } from "react";

import { JOB_POSTING_INITIAL_DESCRIPTION } from "@constants/Properties";
import "@styles/ckEditorDark.css";

export interface EditorProps {
  configuration?: EditorConfig;
  initialValue?: string;
  onChange?: (event: Event, editor: ClassicEditor) => void;
  readOnly?: boolean;
  disabled?: boolean;
  onEditorReady?: (editor: ClassicEditor) => void;
}

const propsInitialValue = JOB_POSTING_INITIAL_DESCRIPTION;

const Editor = ({
  configuration,
  initialValue = propsInitialValue,
  onChange,
  readOnly = false,
  disabled = false,
  onEditorReady,
}: EditorProps) => {
  const editorConfiguration: EditorConfig = useMemo(
    () => ({
      ...configuration,
      plugins: [
        Essentials,
        Undo,
        Bold,
        Italic,
        Code,
        Underline,
        Strikethrough,
        Paragraph,
        Heading,
        Alignment,
        List,
      ],
      toolbar: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "code",
        "underline",
        "strikethrough",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
        ],
      },
    }),
    [configuration],
  );

  return (
    <CKEditor
      editor={ClassicEditor}
      disabled={disabled}
      config={editorConfiguration}
      data={initialValue}
      onChange={onChange}
      onReady={(editor) => {
        const toolbarElement = editor.ui.view.toolbar.element;
        const editableElement = editor.ui.view.editable.element;

        if (toolbarElement && editableElement && readOnly) {
          editor.enableReadOnlyMode("root");
          if (editor.isReadOnly) {
            toolbarElement.style.display = "none";
            editableElement.style.border = "0px";
          } else toolbarElement.style.display = "flex";
        }
        onEditorReady?.(editor);
      }}
    />
  );
};

export default Editor;
