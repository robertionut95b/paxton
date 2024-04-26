import AttachmentItem from "@components/upload/AttachmentItem";
import {
  APP_SUPPORTED_DOCS_TYPES,
  APP_SUPPORTED_IMAGE_TYPES,
} from "@constants/Properties";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  FaceSmileIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { User } from "@interfaces/user.types";
import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Divider,
  FileButton,
  Flex,
  Group,
  Image,
  Indicator,
  Popover,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { useDarkMode } from "usehooks-ts";
import { z } from "zod";

type MessageAddFormProps = {
  currentUser: User | null;
  currentUserAvatar?: string | null;
  maxLength?: number;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
};

type FormValues = {
  content: string;
  senderUserId: number | undefined;
  fileUpload: unknown;
};

const MessageAddForm = ({
  currentUser,
  currentUserAvatar,
  onSubmit,
  maxLength = 250,
  disabled = false,
}: MessageAddFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { isDarkMode } = useDarkMode();

  const displayInitials =
    currentUser &&
    `${currentUser.firstName[0].toUpperCase()}${currentUser.lastName[0].toUpperCase()}`;

  const form = useForm({
    initialValues: {
      content: "",
      senderUserId: Number(currentUser?.userId),
      fileUpload: null,
    },
    validate: zodResolver(
      z
        .object({
          content: z.string().max(maxLength).optional(),
          senderUserId: z.number().min(1),
          fileUpload: z.any().optional(),
        })
        .superRefine((data, ctx) => {
          if (data.content !== "" && data.fileUpload) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["content"],
              message: "Either message or file upload must be set",
            });
          }
        }),
    ),
  });

  const setFilesCb = useCallback(
    (payload: File[]): void => {
      setFiles(payload);
      // @ts-expect-error("types-error")
      form.setFieldValue("fileUpload", payload);
    },
    [form],
  );

  const handleSubmit = (values: (typeof form)["values"]) => {
    onSubmit(values);
    if (form.isValid()) {
      form.reset();
      setFiles([]);
    }
  };

  const removeFileFromState = (file: File) => {
    const newFiles = files.filter((f) => f.name !== file.name);
    setFiles(newFiles);
    setFilesCb(newFiles);
  };

  const filesSizeInMb =
    files.reduce((acc, curr) => curr.size + acc, 0) / 1024 / 1024;
  const filesExceedingSize = filesSizeInMb > 10;

  return (
    <form
      className="px-mantine-form"
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
    >
      <Group spacing={"md"} noWrap>
        <Avatar size="lg" radius="xl" variant="filled" src={currentUserAvatar}>
          {displayInitials}
        </Avatar>
        <Textarea
          w={"100%"}
          label="Message"
          withAsterisk
          autosize
          minRows={2}
          placeholder="Type in a message..."
          {...form.getInputProps("content")}
        />
      </Group>
      <Group mt="sm" position="apart">
        <Group ml={70} spacing="xs">
          <Popover withArrow shadow="md">
            <Popover.Target>
              <ActionIcon>
                <FaceSmileIcon width={26} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p={0}>
              <Picker
                theme={isDarkMode ? "dark" : "light"}
                data={data}
                // @ts-expect-error(missing types)
                onEmojiSelect={({ unified }) => {
                  const newContent = form.values.content.concat(
                    String.fromCodePoint(parseInt(unified, 16)),
                  );
                  form.setFieldValue("content", newContent);
                }}
                previewEmoji={false}
              />
            </Popover.Dropdown>
          </Popover>
          <FileButton
            onChange={setFilesCb}
            accept={APP_SUPPORTED_IMAGE_TYPES.join(",")}
            multiple
          >
            {(props) => (
              <ActionIcon {...props}>
                <PhotoIcon width={26} />
              </ActionIcon>
            )}
          </FileButton>
          <FileButton
            onChange={setFilesCb}
            accept={APP_SUPPORTED_DOCS_TYPES.join(",")}
            multiple
          >
            {(props) => (
              <ActionIcon {...props}>
                <PaperClipIcon width={26} />
              </ActionIcon>
            )}
          </FileButton>
        </Group>
        <Group>
          <Group position="right">
            <Text
              size="xs"
              color={!form.errors.description ? "dimmed" : "red"}
              mt={4}
            >
              {form.values.content.length}/{maxLength}
            </Text>
          </Group>
          <Button
            type="submit"
            disabled={
              (form.values.content.length === 0 && files.length === 0) ||
              disabled ||
              filesExceedingSize
            }
          >
            Send
          </Button>
        </Group>
      </Group>
      <When condition={!!files && files.length > 0}>
        <Divider mt="sm" />
        <Flex mt={"sm"} gap={"sm"} wrap={"wrap"} justify={"center"}>
          {files.map((file, index) => (
            <Indicator
              key={index + file.name}
              size={16}
              label={<XMarkIcon width={14} />}
              onClick={() => removeFileFromState(file)}
            >
              <If
                condition={APP_SUPPORTED_IMAGE_TYPES.some(
                  (fmt) => file.type === fmt,
                )}
              >
                <Then>
                  <Image
                    src={URL.createObjectURL(file)}
                    width={80}
                    height={80}
                    fit="cover"
                  />
                </Then>
                <Else>
                  <AttachmentItem
                    fileName={file.name}
                    src={"/images/pdf-icon.svg"}
                    apiUrl="#"
                  />
                </Else>
              </If>
            </Indicator>
          ))}
        </Flex>
        <When condition={filesExceedingSize}>
          <Then>
            <Alert color="red" mt="xs" variant="light">
              <Text align="center" color="red.7">
                Files selection exceeded 10Mb. Please choose fewer items
              </Text>
            </Alert>
          </Then>
        </When>
      </When>
    </form>
  );
};

export default MessageAddForm;
