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
  useGetUserProfileQuery,
  useRemoveUserProfileExperienceMutation,
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
  MapPinIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { prettyEnumValue } from "@utils/enumUtils";
import FormAddExperienceSchema from "@validator/FormAddExperienceSchema";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileExperienceModal() {
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
    (e) => e?.id.toString() === params.experienceId,
  );

  const [activeJob, setActiveJob] = useState(
    !initialExperienceSelected?.endDate,
  );

  const [desc, setDesc] = useState<string>(
    initialExperienceSelected?.description ?? "",
  );

  const [startDate, setStartDate] = useState<Date>(
    initialExperienceSelected?.startDate
      ? new Date(initialExperienceSelected?.startDate)
      : new Date(),
  );

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient, undefined, {});

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useGetAllOrganizationsQuery(graphqlRequestClient, undefined, {});

  const { data: activitySectors, isLoading: isActivitySectorsLoading } =
    useGetAllActivitySectorsQuery(graphqlRequestClient, undefined, {});

  const { isLoading, mutate } = useAddUserProfileExperienceMutation(
    graphqlRequestClient,
    {
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
    },
  );

  const { isLoading: updateLoading, mutate: mutateUpdate } =
    useUpdateUserProfileExperienceMutation(graphqlRequestClient, {
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
        const city = c?.cities?.map((ci) => ci?.name) ?? [];
        const locs = city.map((ci) => ({
          label: `${c?.name}, ${ci}`,
          value: ci as string,
        }));
        return locs;
      })
      .flat(1) ?? [];

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const { mutate: removeExperience } = useRemoveUserProfileExperienceMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData<GetUserProfileQuery>(
            useGetUserProfileQuery.getKey({
              profileSlugUrl: params.profileSlug,
            }),
            {
              ...prevData,
              // @ts-expect-error("types-error")
              getUserProfile: {
                ...prevData?.getUserProfile,
                experiences: prevData?.getUserProfile?.experiences?.filter(
                  (s) => s?.id.toString() !== params.experienceId,
                ),
              },
            },
          );
        }
        closeAllModals();
        closeModal();
      },
    },
  );

  const form = useForm({
    initialValues: {
      id: initialExperienceSelected?.id ?? null,
      title: initialExperienceSelected?.title ?? "",
      description: initialExperienceSelected?.description ?? "",
      contractType: initialExperienceSelected?.contractType ?? "",
      organizationId:
        initialExperienceSelected?.organization?.id.toString() ?? "",
      city: initialExperienceSelected?.city?.name ?? "",
      startDate: initialExperienceSelected?.startDate
        ? new Date(initialExperienceSelected?.startDate)
        : new Date(),
      endDate: initialExperienceSelected?.endDate
        ? new Date(initialExperienceSelected?.endDate)
        : null,
      activitySectorId:
        initialExperienceSelected?.activitySector.id.toString() ?? "",
      userProfileSlugUrl: params.profileSlug ?? "",
    },
    validate: zodResolver(FormAddExperienceSchema),
  });

  const handleSubmit = async (values: (typeof form)["values"]) => {
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
          activitySectorId: Number(values.activitySectorId),
          organizationId: Number(values.organizationId),
          startDate: format(startDate, "yyyy-MM-dd") as unknown as Date,
          endDate:
            endDate && (format(endDate, "yyyy-MM-dd") as unknown as Date),
        },
      });
    else
      mutate({
        ExperienceInput: {
          ...values,
          contractType,
          activitySectorId: Number(values.activitySectorId),
          organizationId: Number(values.organizationId),
          startDate: format(startDate, "yyyy-MM-dd") as unknown as Date,
          endDate:
            endDate && (format(endDate, "yyyy-MM-dd") as unknown as Date),
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
      size={620}
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
            {desc.length}/1.000
          </Text>
        </Group>
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
              value: String(o?.id),
              image: o?.photography,
              description: o?.activitySector.name,
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
          data={(Object.entries(ContractType) ?? [])?.map(([, value]) => ({
            label: prettyEnumValue(value),
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
              value: String(a?.id),
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
          value={startDate}
          onChange={(d) => {
            if (d) {
              setStartDate(d);
              form.setFieldValue("startDate", d);
            }
          }}
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
            minDate={startDate}
            maxDate={new Date()}
            {...form.getInputProps("endDate")}
          />
        </ShowIf>
        <Group grow={!!initialExperienceSelected}>
          <ShowIf if={initialExperienceSelected}>
            <Button
              type="button"
              mt="xl"
              fullWidth
              color="red.7"
              loading={isLoading || updateLoading}
              onClick={() =>
                openConfirmModal({
                  title: "Delete study",
                  children: (
                    <Stack>
                      <Text size="sm">
                        Are you sure you want to delete this?
                      </Text>
                      <Text size="sm" weight="bold">
                        This action is irreversible!
                      </Text>
                    </Stack>
                  ),
                  labels: { cancel: "Cancel", confirm: "Confirm" },
                  confirmProps: { color: "red.7" },
                  onCancel: () => null,
                  onConfirm: () =>
                    removeExperience({
                      experienceId: Number(params.experienceId),
                    }),
                })
              }
            >
              Remove experience
            </Button>
          </ShowIf>
          <Button
            type="submit"
            fullWidth
            mt="xl"
            loading={isLoading || updateLoading}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
