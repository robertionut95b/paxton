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
  Group,
  Popover,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
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
  senderUserId: string | undefined;
};

const MessageAddForm = ({
  currentUser,
  currentUserAvatar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
  maxLength = 250,
  disabled = false,
}: MessageAddFormProps) => {
  const [content, setContent] = useState<string>("");
  const { isDarkMode } = useDarkMode();

  const displayInitials =
    currentUser &&
    `${currentUser.firstName[0].toUpperCase()}${currentUser.lastName[0].toUpperCase()}`;

  const form = useForm({
    initialValues: {
      content: "",
      senderUserId: String(currentUser?.userId),
    },
    validate: zodResolver(
      z.object({
        content: z.string().min(5).max(maxLength),
        senderUserId: z.string().min(1),
      })
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeMsgCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.currentTarget.value);
      form.setFieldValue("content", e.currentTarget.value);
    },
    [form]
  );

  const handleSubmit = async (values: (typeof form)["values"]) => {
    onSubmit(values);
    if (form.isValid()) {
      form.reset();
      setContent("");
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
            currentUserAvatar &&
            `${APP_IMAGES_API_PATH}/100x100/${currentUserAvatar}`
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
                    String.fromCodePoint(parseInt(unified, 16))
                  );
                  setContent(newContent);
                  form.setFieldValue("content", newContent);
                }}
                previewEmoji={false}
              />
            </Popover.Dropdown>
          </Popover>
          <Popover withArrow shadow="md" disabled>
            <Popover.Target>
              <ActionIcon disabled>
                <PhotoIcon width={26} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p={0}></Popover.Dropdown>
          </Popover>
          <Popover withArrow shadow="md" disabled>
            <Popover.Target>
              <ActionIcon disabled>
                <PaperClipIcon width={26} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p={0}></Popover.Dropdown>
          </Popover>
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
          <Button type="submit" disabled={content.length === 0 || disabled}>
            Send
          </Button>
        </Group>
      </Group>
    </form>
  );
};

export default MessageAddForm;
