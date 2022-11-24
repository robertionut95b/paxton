import { useAuth } from "@auth/useAuth";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, FileInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileBannerModal() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { profileSlug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const form = useForm({
    initialValues: {
      photography: null,
      profileSlugUrl: profileSlug,
    },
    // validate: zodResolver(FormAddStudySchema),
  });

  const handleSubmit = (values: typeof form["values"]) => {
    const photoFile = values.photography;
  };

  return (
    <Modal
      title="Customize banner"
      opened={opened}
      onClose={closeModal}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      size={520}
    >
      <form
        className="px-mantine-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <FileInput
          placeholder="Choose a photography"
          label="Photography"
          description="An image is worth a thousand words"
          withAsterisk
          icon={<PhotoIcon width={18} />}
          {...form.getInputProps("photography")}
        />
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
}
