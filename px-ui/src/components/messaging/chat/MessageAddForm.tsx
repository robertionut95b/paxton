import { APP_IMAGES_API_PATH } from "@constants/Properties";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  FaceSmileIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { User } from "@interfaces/user.types";
import {
  ActionIcon,
  Avatar,
  Button,
  FileButton,
  Group,
  List,
  Popover,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
import { When } from "react-if";
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
  const [content, setContent] = useState<string>("");
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

  const changeMsgCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.currentTarget.value);
      form.setFieldValue("content", e.currentTarget.value);
    },
    [form],
  );

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
      setContent("");
      setFiles([]);
    }
  };

  return (
    <form
      className="px-mantine-form"
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
    >
      <Group spacing={"md"} noWrap>
        <Avatar
          size="lg"
          radius="xl"
          variant="filled"
          src={
            currentUserAvatar
              ? `${APP_IMAGES_API_PATH}/100x100/${currentUserAvatar}`
              : undefined
          }
        >
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
          value={content}
          onChange={changeMsgCb}
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
                  const newContent = content.concat(
                    String.fromCodePoint(parseInt(unified, 16)),
                  );
                  setContent(newContent);
                  form.setFieldValue("content", newContent);
                }}
                previewEmoji={false}
              />
            </Popover.Dropdown>
          </Popover>
          <FileButton
            onChange={setFilesCb}
            accept="image/png,image/jpeg"
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
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
              {content.length}/{maxLength}
            </Text>
          </Group>
          <Button
            type="submit"
            disabled={(content.length === 0 && files.length === 0) || disabled}
          >
            Send
          </Button>
          <When condition={!!files}>
            <List size="sm" mt={5} withPadding>
              {files.map((file, index) => (
                <List.Item key={index}>{file.name}</List.Item>
              ))}
            </List>
          </When>
        </Group>
      </Group>
    </form>
  );
};

export default MessageAddForm;
