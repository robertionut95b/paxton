import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  useCreateOrUpdateOrganizationMutation,
  useGetCountriesCitiesQuery,
} from "@gql/generated";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CubeIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrganizationModal = () => {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const [desc, setDesc] = useState<string>("");
  const { organizationId } = useParams();

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { mutate } = useCreateOrUpdateOrganizationMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Organization update",
          message: "Successfully created organization",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    }
  );

  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    initialValues: {
      id: organizationId ?? null,
      name: "",
      description: "",
      industry: "",
      location: "",
      photography: "",
    },
    // validate: zodResolver,
  });

  const locations = useMemo(
    () =>
      countries?.getCountriesCities
        ?.map((c) => {
          const city = c?.cities?.map((ci) => ci?.name) || [];
          const locs = city.map((ci) => ({
            label: `${c?.name}, ${ci}`,
            value: ci as string,
          }));
          return locs;
        })
        .flat(1) || [],
    [countries]
  );
  const handleSubmit = async (values: typeof form["values"]) => {
    mutate({
      OrganizationInput: {
        ...values,
      },
    });
  };

  const changeDescCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(e.currentTarget.value);
      form.setFieldValue("description", e.currentTarget.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Modal
      title="Organization"
      opened={opened}
      onClose={closeModal}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      size={620}
    >
      <form
        className="px-mantine-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <TextInput
          label="Title"
          description="The name of the organization"
          mt="md"
          withAsterisk
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          description="Fill in a description for this organization"
          mt="md"
          withAsterisk
          minRows={6}
          icon={<ChatBubbleBottomCenterTextIcon width={18} />}
          {...form.getInputProps("description")}
          value={desc}
          onChange={changeDescCb}
        />
        <Group position="right">
          <Text
            size="xs"
            color={!form.errors.description ? "dimmed" : "red"}
            mt={4}
          >
            {desc.length}/2.000
          </Text>
        </Group>
        <TextInput
          label="Industry"
          description="The industry of the organization"
          withAsterisk
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("industry")}
        />
        <ShowIfElse
          if={!isCountryListLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Location"
            description="The source location of this organization"
            searchable
            mt="md"
            withAsterisk
            data={locations}
            icon={<MapPinIcon width={18} />}
            {...form.getInputProps("location")}
          />
        </ShowIfElse>
        <Divider my={40} />
        <TextInput
          mt={0}
          placeholder="URL address: https://www.acme.com/branding/logo.png"
          label="Logo"
          description="Place an URL address for a logo picture of your organization"
          icon={<PhotoIcon width={18} />}
          {...form.getInputProps("photography")}
        />
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default OrganizationModal;
