import { useAuth } from "@auth/useAuth";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import useChangeProfileBanner from "@hooks/useChangeProfileBanner";
import { Button, FileInput, Modal } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { FormBannerChangeSchema } from "@validator/FormBannerChangeSchema";
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
    validate: zodResolver(FormBannerChangeSchema),
  });

  const { mutate } = useChangeProfileBanner({
    onSuccess: () => {
      queryClient.invalidateQueries([
        "GetUserProfile",
        { profileSlugUrl: profileSlug },
      ]);
      closeModal();
      showNotification({
        title: "Cover update",
        message: "Successfully updated cover picture",
        autoClose: 5000,
        icon: <CheckCircleIcon width={20} />,
      });
    },
    onError: (error) => {
      if (error) {
        showNotification({
          title: "Avatar update",
          message: error.response?.data.message ?? "Unknown error ocurred",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      }
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const photography = values.photography;
    const userId = user?.userId;

    if (photography && userId) {
      const formData = new FormData();
      formData.append("photography", photography);
      formData.append("userId", String(userId));
      mutate(formData);
    }
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
          label="Photography"
          description="An image is worth a thousand words"
          withAsterisk
          accept="image/jpeg"
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
