import { downloadApiFile } from "@auth/authApi";
import { useDownloadFile } from "@hooks/useDownloadFile";
import { Box, Image, Text } from "@mantine/core";

type AttachmentItemProps = {
  fileName: string;
  src: string;
  apiUrl: string;
  keyV?: React.Key | null;
};

const AttachmentItem = ({
  fileName,
  src,
  apiUrl,
  keyV,
}: AttachmentItemProps) => {
  const { ref, url, download, name } = useDownloadFile({
    apiDefinition: () => downloadApiFile(apiUrl),
    getFileName: () => fileName,
  });

  return (
    <Box key={keyV}>
      <a href={url} download={name} className="hidden" ref={ref} />
      <Box className="cursor-pointer" onClick={download}>
        <Image src={src} width={52} />
        <Text size="xs" maw={60} truncate title={name}>
          {fileName}
        </Text>
      </Box>
    </Box>
  );
};

export default AttachmentItem;
