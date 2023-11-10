import { FilePondInitialFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import { FilePond, FilePondProps, registerPlugin } from "react-filepond";

import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useState } from "react";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageEdit,
);

type AttachmentUploadProps = {
  files?: (string | FilePondInitialFile | Blob)[];
  setFiles?: React.Dispatch<
    React.SetStateAction<(string | FilePondInitialFile | Blob)[]>
  >;
  pondProps?: FilePondProps;
  rootProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

const AttachmentUpload = ({
  files,
  setFiles,
  pondProps,
  rootProps,
}: AttachmentUploadProps) => {
  const [f, sF] = useState<(string | FilePondInitialFile | Blob)[]>([]);
  return (
    <div className="px-files-upload" {...rootProps}>
      <FilePond
        files={files ? files : f}
        // @ts-expect-error("type-errors")
        onupdatefiles={setFiles ? setFiles : sF}
        allowMultiple={true}
        maxFiles={3}
        name="files"
        labelIdle='Drag your files here or <span class="filepond--label-action">Browse</span>'
        {...pondProps}
      />
    </div>
  );
};

export default AttachmentUpload;
