import { APP_IMAGES_API_PATH } from "@constants/Properties";
import { User } from "@interfaces/user.types";
import { Avatar, Button, Group, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useState } from "react";
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
  onSubmit,
  maxLength = 250,
  disabled = false,
}: MessageAddFormProps) => {
  const [content, setContent] = useState<string>("");

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

  const changeMsgCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.currentTarget.value);
      form.setFieldValue("content", e.currentTarget.value);
    },
    [form]
  );

  const handleSubmit = async (values: (typeof form)["values"]) => {
    onSubmit(values);
    if (form.isValid()) form.reset();
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
          placeholder="Add a message in this chat"
          {...form.getInputProps("content")}
          value={content}
          onChange={changeMsgCb}
        />
        <Group position="right">
          <Text
            size="xs"
            color={!form.errors.description ? "dimmed" : "red"}
            mt={4}
          >
            {content.length}/{maxLength}
          </Text>
        </Group>
      </Group>
      <Group position="right" mt="sm">
        <Button type="submit" disabled={content.length === 0 || disabled}>
          Send
        </Button>
      </Group>
    </form>
  );
};

export default MessageAddForm;
