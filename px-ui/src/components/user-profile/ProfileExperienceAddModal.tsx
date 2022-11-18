import { useAuth } from "@auth/useAuth";
import { SelectItem } from "@components/select-items/SelectItem";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  ContractType,
  GetUserProfileQuery,
  useAddUserProfileExperienceMutation,
  useGetAllActivitySectorsQuery,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
  useUpdateUserProfileExperienceMutation,
} from "@gql/generated";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CogIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Checkbox,
  Loader,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "@utils/capitalizeString";
import FormAddExperienceSchema from "@validator/FormAddExperienceSchema";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileExperienceAddModal() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const prevData = queryClient.getQueryData<GetUserProfileQuery>([
    "GetUserProfile",
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  ]);

  const initialExperienceSelected = prevData?.getUserProfile?.experiences?.find(
    (e) => e?.id === params.experienceId
  );

  const [activeJob, setActiveJob] = useState(
    initialExperienceSelected?.endDate ? false : true
  );

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

  const { isLoading, mutate } = useAddUserProfileExperienceMutation(
    graphqlRequestClient,
    {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message:
            "Could not add experience information, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries([
          "GetUserProfile",
          { profileSlugUrl: params.profileSlug },
        ]);
        closeModal();
        showNotification({
          title: "Experiences update",
          message: "Successfully updated experiences information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    }
  );

  const { isLoading: updateLoading, mutate: mutateUpdate } =
    useUpdateUserProfileExperienceMutation(graphqlRequestClient, {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message:
            "Could not update experience information, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries([
          "GetUserProfile",
          { profileSlugUrl: params.profileSlug },
        ]);
        closeModal();
        showNotification({
          title: "Experiences update",
          message: "Successfully updated experiences information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
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
      id: initialExperienceSelected?.id ?? null,
      title: initialExperienceSelected?.title ?? "",
      description: initialExperienceSelected?.description ?? "",
      contractType: initialExperienceSelected?.contractType ?? "",
      organizationId: initialExperienceSelected?.organization?.id ?? "",
      city: initialExperienceSelected?.city?.name ?? "",
      startDate: initialExperienceSelected?.startDate
        ? new Date(initialExperienceSelected?.startDate)
        : new Date(),
      endDate: initialExperienceSelected?.endDate
        ? new Date(initialExperienceSelected?.endDate)
        : null,
      activitySectorId: initialExperienceSelected?.activitySector.id ?? "",
      userProfileSlugUrl: params.profileSlug ?? "",
    },
    validate: zodResolver(FormAddExperienceSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    const contractType = values.contractType as ContractType;
    const startDate = values.startDate;
    const endDate = values?.endDate;
    const id = values.id;

    if (id)
      mutateUpdate({
        ExperienceInput: {
          ...values,
          id,
          contractType,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: endDate && format(endDate, "yyyy-MM-dd"),
        },
      });
    else
      mutate({
        ExperienceInput: {
          ...values,
          contractType,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: endDate && format(endDate, "yyyy-MM-dd"),
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
      size={520}
    >
      <form
        className="px-mantine-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <TextInput
          label="Title"
          mt="md"
          withAsterisk
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          description="Describe as accurately as possible your experience"
          mt="md"
          withAsterisk
          minRows={9}
          icon={<ChatBubbleBottomCenterTextIcon width={18} />}
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
            itemComponent={SelectItem}
            data={(organizations?.getAllOrganizations ?? [])?.map((o) => ({
              label: o?.name,
              value: o?.id,
              image: o?.photography,
              description: o?.industry,
            }))}
            icon={<BuildingOffice2Icon width={18} />}
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
            icon={<MapPinIcon width={18} />}
            {...form.getInputProps("city")}
          />
        </ShowIfElse>
        <Select
          label="Contract type"
          description="The type of contract during your work time"
          mt="md"
          withAsterisk
          icon={<ClipboardDocumentIcon width={18} />}
          data={(Object.entries(ContractType) ?? [])?.map(([key, value]) => ({
            label: capitalizeFirstLetter(
              value.toLowerCase().split("_").join(" ")
            ),
            value: value,
          }))}
          {...form.getInputProps("contractType")}
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
            icon={<CogIcon width={18} />}
            data={(activitySectors?.getAllActivitySectors ?? []).map((a) => ({
              label: a?.name,
              value: a?.id,
            }))}
            {...form.getInputProps("activitySectorId")}
          />
        </ShowIfElse>
        <DatePicker
          withAsterisk
          mt="md"
          label="From"
          description="The starting date of employment"
          clearable={false}
          icon={<CalendarIcon width={18} />}
          maxDate={new Date()}
          {...form.getInputProps("startDate")}
        />
        <Checkbox
          mt="md"
          label="I currently work on this position"
          checked={activeJob}
          onChange={(event) => {
            setActiveJob(event.currentTarget.checked);
            form.setFieldValue("endDate", null);
          }}
        />
        <ShowIf if={!activeJob}>
          <DatePicker
            mt="md"
            label="Until"
            description="The ending date of employment"
            icon={<CalendarIcon width={18} />}
            disabled={activeJob}
            maxDate={new Date()}
            {...form.getInputProps("endDate")}
          />
        </ShowIf>

        <Button
          type="submit"
          fullWidth
          mt="xl"
          loading={isLoading || updateLoading}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
}
