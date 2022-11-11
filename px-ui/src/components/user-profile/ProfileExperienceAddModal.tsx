import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  ContractType,
  useAddUserProfileExperienceMutation,
  useGetAllActivitySectorsQuery,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
} from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Loader,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileExperienceAddModal() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(true);
  const params = useParams();

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

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useGetAllOrganizationsQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for organizations, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    });

  const { data: activitySectors, isLoading: isActivitySectorsLoading } =
    useGetAllActivitySectorsQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for activity sectors, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    });

  const { isLoading, mutate } =
    useAddUserProfileExperienceMutation(graphqlRequestClient);

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
      description: "",
      contractType: "",
      organizationId: "",
      city: "",
      startDate: new Date(),
      endDate: null,
      activitySectorId: "",
      userProfileSlugUrl: params.profileSlug ?? "",
    },
    // validate: zodResolver(FormUpdateProfileSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    const contractType = values.contractType as ContractType;
    const startDate = values.startDate;
    mutate({
      ExperienceInput: {
        ...values,
        contractType,
        startDate: format(startDate, "yyyy-MM-dd"),
      },
    });
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
        <Textarea
          label="Description"
          description="Describe as accurately as possible your experience"
          mt="md"
          withAsterisk
          {...form.getInputProps("description")}
        />
        <ShowIfElse
          if={!isOrganizationsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Organization"
            description="The company at which you held this experience"
            mt="md"
            withAsterisk
            data={(organizations?.getAllOrganizations ?? [])?.map((o) => ({
              label: o?.name,
              value: o?.id,
            }))}
            {...form.getInputProps("organizationId")}
          />
        </ShowIfElse>
        <ShowIfElse
          if={!isCountryListLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Location"
            description="The place where you had this experience"
            searchable
            mt="md"
            withAsterisk
            data={locations}
            {...form.getInputProps("city")}
          />
        </ShowIfElse>
        <Select
          label="Contract type"
          description="The type of contract during your work time"
          mt="md"
          withAsterisk
          data={(Object.entries(ContractType) ?? [])?.map(([key, value]) => ({
            label: key,
            value: value,
          }))}
          {...form.getInputProps("contractType")}
        />
        <DatePicker
          withAsterisk
          mt="md"
          label="Starting from"
          description="The starting date of employment"
          maxDate={new Date()}
          {...form.getInputProps("startDate")}
        />
        <DatePicker
          mt="md"
          label="Starting from"
          description="The ending date of employment"
          maxDate={new Date()}
          {...form.getInputProps("endDate")}
        />
        <ShowIfElse
          if={!isActivitySectorsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Activity sector"
            description="The activity domain of your employment"
            searchable
            mt="md"
            withAsterisk
            data={(activitySectors?.getAllActivitySectors ?? []).map((a) => ({
              label: a?.name,
              value: a?.id,
            }))}
            {...form.getInputProps("activitySectorId")}
          />
        </ShowIfElse>
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
