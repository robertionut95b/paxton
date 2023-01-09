import { useAuth } from "@auth/useAuth";
import {
  GetUserProfileQuery,
  useGetCountriesCitiesQuery,
  useUpdateUserProfileMutation,
} from "@gql/generated";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  HashtagIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { User } from "@interfaces/user.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Group,
  Loader,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import FormUpdateProfileSchema from "@validator/FormUpdateProfileSchema";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BasicUpdateProfileModal() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(true);
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { profileSlug } = useParams();

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
          value: ci as string,
        }));
        return locs;
      })
      .flat(1) || [];

  const prevData = queryClient.getQueryData<GetUserProfileQuery>([
    "GetUserProfile",
    {
      profileSlugUrl: profileSlug,
    },
  ]);
  const prevProfileData = prevData?.getUserProfile;

  const [desc, setDesc] = useState<string>(prevProfileData?.description ?? "");

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
      id: prevProfileData?.id ?? "0",
      description: prevProfileData?.description ?? "",
      city: prevProfileData?.city?.name ?? "",
      profileTitle: prevProfileData?.profileTitle ?? "",
      profileSlugUrl: prevProfileData?.profileSlugUrl ?? "",
      firstName: prevProfileData?.user?.firstName ?? "",
      lastName: prevProfileData?.user?.lastName ?? "",
    },
    validate: zodResolver(FormUpdateProfileSchema),
  });

  const { mutate, isLoading } = useUpdateUserProfileMutation(
    graphqlRequestClient,
    {
      onSuccess(data) {
        const firstName = form.values.firstName;
        const lastName = form.values.lastName;
        const profileSlugUrl = form.values.profileSlugUrl;
        setUser({
          ...(user as User),
          firstName,
          lastName,
          profileSlugUrl,
        });
        queryClient.invalidateQueries([
          "GetUserProfile",
          {
            profileSlugUrl: profileSlug,
          },
        ]);
        if (prevProfileData?.profileSlugUrl !== profileSlugUrl) {
          queryClient.removeQueries({
            queryKey: [
              "GetUserProfile",
              {
                profileSlugUrl: prevProfileData?.profileSlugUrl,
              },
            ],
          });
        }
        closeModalNewPath(
          `/app/up/${data.updateUserProfile?.profileSlugUrl}` ?? ""
        );
        showNotification({
          title: "Profile update",
          message: "Successfully updated profile information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
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
      size={520}
    >
      <form
        className="px-mantine-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <TextInput
          label="First name"
          mt="md"
          withAsterisk
          icon={<TagIcon width={18} />}
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last name"
          mt="md"
          withAsterisk
          icon={<TagIcon width={18} />}
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Profile URL"
          description="This is your profile's personalized URL, it is unique for each user"
          mt="md"
          withAsterisk
          icon={<GlobeAltIcon width={18} />}
          {...form.getInputProps("profileSlugUrl")}
        />
        <TextInput
          label="Profile title"
          description="Your job or occupation in present"
          placeholder="Awesome job at Acme Inc."
          mt="md"
          withAsterisk
          icon={<HashtagIcon width={18} />}
          {...form.getInputProps("profileTitle")}
        />
        <Textarea
          label="Description"
          description="Tell everyone more about you and recruiters might recognize you"
          placeholder="This is pretty much a description of your profile"
          minRows={6}
          mt="md"
          withAsterisk
          icon={<ChatBubbleBottomCenterTextIcon width={18} />}
          {...form.getInputProps("description")}
          value={desc}
          onChange={(e) => {
            setDesc(e.currentTarget.value);
            form.setFieldValue("description", e.currentTarget.value);
          }}
        />
        <Group position="right">
          <Text
            size="xs"
            color={!form.errors.description ? "dimmed" : "red"}
            mt={4}
          >
            {desc.length}/1000
          </Text>
        </Group>
        {isCountryListLoading ? (
          <Loader mt="md" size="sm" variant="dots" />
        ) : (
          <Select
            label="Location"
            placeholder="Your actual location"
            description="This helps suggest you job positions inside the platform"
            searchable
            mt="md"
            mb="md"
            icon={<MapPinIcon width={18} />}
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
