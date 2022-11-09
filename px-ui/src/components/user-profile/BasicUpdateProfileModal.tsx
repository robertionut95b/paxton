import {
  GetUserProfileQuery,
  useGetCountriesCitiesQuery,
  useUpdateUserProfileMutation,
} from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { User } from "@interfaces/user.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Loader,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
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

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for location, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    });

  const locations =
    countries?.getCountriesCities
      ?.map((c) => {
        const city = c?.cities?.map((ci) => ci?.name) || [];
        const locs = city.map((ci) => ({
          label: `${c?.name}, ${ci}`,
          value: ci,
        }));
        return locs;
      })
      .flat(1) || [];

  const prevData = queryClient.getQueryData<GetUserProfileQuery>([
    "GetUserProfile",
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  ]);
  const prevProfileData = prevData?.getUserProfile;

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const closeModalNewPath = (path: string) => {
    navigate(path);
    setOpened(false);
  };

  const form = useForm({
    initialValues: {
      description: prevProfileData?.description ?? "",
      city: prevProfileData?.city?.name ?? "",
      profileTitle: prevProfileData?.profileTitle ?? "",
      profileSlugUrl: prevProfileData?.profileSlugUrl ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
    validate: zodResolver(FormUpdateProfileSchema),
  });

  const { mutate, isLoading } = useUpdateUserProfileMutation(
    graphqlRequestClient,
    {
      onSuccess(data) {
        const firstName = form.values.firstName;
        const lastName = form.values.lastName;
        setUser({
          ...(user as User),
          firstName,
          lastName,
        });
        queryClient.invalidateQueries([
          "GetUserProfile",
          {
            profileSlugUrl: user?.profileSlugUrl,
          },
        ]);
        closeModalNewPath(
          `/app/up/${data.updateUserProfile?.profileSlugUrl}` ?? ""
        );
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
          label="Profile URL"
          description="This is your profile unique url, it is unique for each user"
          mt="md"
          withAsterisk
          {...form.getInputProps("profileSlugUrl")}
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
        {isCountryListLoading ? (
          <Loader mt="md" size="sm" variant="dots" />
        ) : (
          <Select
            label="Location"
            placeholder="Your actual location"
            description="This helps to suggest you job positions inside the app"
            searchable
            mt="md"
            mb="md"
            withAsterisk
            data={locations}
            {...form.getInputProps("city")}
          />
        )}

        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
