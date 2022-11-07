import {
  GetCurrentUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@gql/generated";
import { User } from "@interfaces/user.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import FormUpdateProfileSchema from "@validator/FormUpdateProfileSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function BasicUpdateProfileModal() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(true);
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const prevData = queryClient.getQueryData<GetCurrentUserProfileQuery>([
    "GetCurrentUserProfile",
  ]);
  const prevProfileData = prevData?.getCurrentUserProfile;

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const form = useForm({
    initialValues: {
      description: prevProfileData?.description ?? "",
      location: prevProfileData?.location ?? "",
      profileTitle: prevProfileData?.profileTitle ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
    validate: zodResolver(FormUpdateProfileSchema),
  });

  const { mutate, isLoading } = useUpdateUserProfileMutation(
    graphqlRequestClient,
    {
      onSuccess() {
        const firstName = form.values.firstName;
        const lastName = form.values.lastName;
        setUser({
          ...(user as User),
          firstName,
          lastName,
        });
        queryClient.invalidateQueries(["GetCurrentUserProfile"]);
        closeModal();
      },
    }
  );

  const handleSubmit = async (values: typeof form["values"]) => {
    mutate({
      UserProfileInput: values,
    });
  };

  return (
    <Modal
      title="Update profile information"
      opened={opened}
      onClose={closeModal}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
    >
      <form
        className="px-mantine-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <TextInput
          label="First name"
          mt="md"
          withAsterisk
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last name"
          mt="md"
          withAsterisk
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Profile title"
          description="Your current job"
          placeholder="Awesome job at Acme Inc."
          mt="md"
          withAsterisk
          {...form.getInputProps("profileTitle")}
        />
        <Textarea
          label="Description"
          description="Tell everyone more about you and recruiters might recognize you!"
          placeholder="This is pretty much a description of your profile"
          minRows={6}
          mt="md"
          withAsterisk
          {...form.getInputProps("description")}
        />
        <TextInput
          label="Location"
          placeholder="Your actual location"
          description="This helps to suggest you job positions inside the app"
          mt="md"
          mb="md"
          withAsterisk
          {...form.getInputProps("location")}
        />
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
