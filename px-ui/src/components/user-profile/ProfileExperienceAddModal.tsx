import { useGetCountriesCitiesQuery } from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Loader, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileExperienceAddModal() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(true);

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

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const form = useForm({
    initialValues: {
      title: "",
      contractType: "",
      organizationId: "",
      city: "",
      startDate: new Date(),
      endDate: new Date(),
      activitySectorId: "",
      description: "",
    },
    // validate: zodResolver(FormUpdateProfileSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    console.log(values);
  };

  return (
    <Modal
      title="Add experience"
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
          label="Title"
          mt="md"
          withAsterisk
          {...form.getInputProps("title")}
        />
        <TextInput
          label="Organization"
          mt="md"
          withAsterisk
          {...form.getInputProps("organizationId")}
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
      </form>
    </Modal>
  );
}
