import { AxiosResponse } from "axios";
import { useRef, useState } from "react";

interface DownloadFileProps {
  readonly apiDefinition: () => Promise<AxiosResponse<Blob>>;
  readonly preDownloading?: () => void;
  readonly postDownloading?: () => void;
  readonly onError?: () => void;
  readonly getFileName: () => string;
}

interface DownloadedFileInfo {
  readonly download: () => Promise<void>;
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly name: string | undefined;
  readonly url: string | undefined;
}

export const useDownloadFile = ({
  apiDefinition,
  preDownloading,
  postDownloading,
  onError,
  getFileName,
}: DownloadFileProps): DownloadedFileInfo => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [url, setUrl] = useState<string>();
  const [name, setName] = useState<string>();

  const download = async () => {
    if (!ref.current) {
      console.error("Ref instance is not set for download anchor");
      return;
    }
    try {
      preDownloading?.();
      const { data } = await apiDefinition();
      const url = URL.createObjectURL(new Blob([data]));
      setUrl(url);
      setName(getFileName());
      ref.current.href = url;
      ref.current.download = getFileName();
      ref.current?.click();
      postDownloading?.();
      URL.revokeObjectURL(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      onError?.();
    }
  };

  return { download, ref, url, name };
};
