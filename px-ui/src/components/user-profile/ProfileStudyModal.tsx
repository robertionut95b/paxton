import { useAuth } from "@auth/useAuth";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  GetUserProfileQuery,
  useAddCertificationMutation,
  useAddDomainMutation,
  useAddInstitutionMutation,
  useAddUserProfileStudyMutation,
  useGetAllCertificationsQuery,
  useGetAllDomainsQuery,
  useGetAllInstitutionsQuery,
  useGetUserProfileQuery,
  useRemoveUserProfileStudyMutation,
  useUpdateUserProfileStudyMutation,
} from "@gql/generated";
import {
  BuildingLibraryIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CogIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
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
import FormAddStudySchema from "@validator/FormAddStudySchema";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileStudyModal() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { studyId, profileSlug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const prevData = queryClient.getQueryData<GetUserProfileQuery>([
    "GetUserProfile",
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  ]);

  const initialStudySelected = prevData?.getUserProfile?.studies?.find(
    (e) => e?.id.toString() === studyId,
  );

  const [activeStudy, setActiveStudy] = useState(
    !initialStudySelected?.endDate,
  );

  const [desc, setDesc] = useState<string>(
    initialStudySelected?.description ?? "",
  );

  const [startDate, setStartDate] = useState<Date>(
    initialStudySelected?.startDate
      ? new Date(initialStudySelected?.startDate)
      : new Date(),
  );

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const [selectedCertification, setSelectedCertification] = useState<
    string | null
  >(String(initialStudySelected?.certification?.id) || null);

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(
    String(initialStudySelected?.institution?.id) || null,
  );

  const [selectedDomain, setSelectedDomain] = useState<string | null>(
    String(initialStudySelected?.domainStudy?.id) || null,
  );

  const { data: institutionsData, isLoading: isInstitutionsLoading } =
    useGetAllInstitutionsQuery(graphqlRequestClient, undefined, {
      onSuccess: (data) => {
        setInstitutions(
          data.getAllInstitutions?.map((i) => ({
            label: i?.name,
            value: i?.id.toString(),
          })) ?? [],
        );
      },
    });

  const [institutions, setInstitutions] = useState<
    { label?: string; value?: string }[]
  >(
    institutionsData?.getAllInstitutions?.map((i) => ({
      label: i?.name,
      value: i?.id.toString(),
    })) ?? [],
  );

  const { data: domainsData, isLoading: isDomainsLoading } =
    useGetAllDomainsQuery(graphqlRequestClient, undefined, {
      onSuccess: (data) => {
        setDomains(
          data.getAllDomains?.map((d) => ({
            label: d?.name,
            value: d?.id.toString(),
          })) ?? [],
        );
      },
    });

  const [domains, setDomains] = useState<{ label?: string; value?: string }[]>(
    domainsData?.getAllDomains?.map((d) => ({
      label: d?.name,
      value: d?.id.toString(),
    })) ?? [],
  );

  const { data: certificationsData, isLoading: isCertificationsLoading } =
    useGetAllCertificationsQuery(graphqlRequestClient, undefined, {
      onSuccess: (data) => {
        setCertifications(
          data.getAllCertifications?.map((c) => ({
            label: c?.name,
            value: c?.id.toString(),
          })) ?? [],
        );
      },
    });

  const [certifications, setCertifications] = useState<
    { label?: string; value?: string }[]
  >(
    certificationsData?.getAllCertifications?.map((c) => ({
      label: c?.name,
      value: c?.id.toString(),
    })) ?? [],
  );

  const { mutate: removeStudy } = useRemoveUserProfileStudyMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.setQueryData<GetUserProfileQuery>(
            useGetUserProfileQuery.getKey({
              profileSlugUrl: profileSlug,
            }),
            {
              ...prevData,
              // @ts-expect-error("types-error")
              getUserProfile: {
                ...prevData?.getUserProfile,
                studies: prevData?.getUserProfile?.studies?.filter(
                  (s) => s?.id.toString() !== studyId,
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
      id: initialStudySelected?.id ?? null,
      institution: initialStudySelected?.institution?.id.toString() ?? "",
      domainStudy: initialStudySelected?.domainStudy?.id.toString() ?? "",
      degree: initialStudySelected?.degree ?? "",
      certification: initialStudySelected?.certification?.id.toString() ?? "",
      description: initialStudySelected?.description ?? "",
      startDate: initialStudySelected?.startDate
        ? new Date(initialStudySelected?.startDate)
        : new Date(),
      endDate: initialStudySelected?.endDate
        ? new Date(initialStudySelected?.endDate)
        : null,
      userProfileSlugUrl: profileSlug ?? "",
    },
    validate: zodResolver(FormAddStudySchema),
  });

  const { mutate: addStudy, isLoading: isAddStudyLoading } =
    useAddUserProfileStudyMutation(graphqlRequestClient, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "GetUserProfile",
          { profileSlugUrl: profileSlug },
        ]);
        closeModal();
        showNotification({
          title: "Studies update",
          message: "Successfully update studies information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    });

  const { mutate: updateStudy, isLoading: isUpdateStudyLoading } =
    useUpdateUserProfileStudyMutation(graphqlRequestClient, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "GetUserProfile",
          { profileSlugUrl: profileSlug },
        ]);
        closeModal();
        showNotification({
          title: "Studies update",
          message: "Successfully updated studies information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    });

  const handleSubmit = async (values: (typeof form)["values"]) => {
    const id = values.id;
    const startDate = values.startDate;
    const endDate = values.endDate;

    if (id) {
      updateStudy({
        StudyInput: {
          ...values,
          id,
          institution: Number(values.institution),
          certification: Number(values.certification),
          domainStudy: Number(values.domainStudy),
          startDate: format(startDate, "yyyy-MM-dd") as unknown as Date,
          endDate:
            endDate && (format(endDate, "yyyy-MM-dd") as unknown as Date),
        },
      });
    } else
      addStudy({
        StudyInput: {
          ...values,
          institution: Number(values.institution),
          certification: Number(values.certification),
          domainStudy: Number(values.domainStudy),
          startDate: format(startDate, "yyyy-MM-dd") as unknown as Date,
          endDate:
            endDate && (format(endDate, "yyyy-MM-dd") as unknown as Date),
        },
      });
  };

  const { mutateAsync: addInstitution, isLoading: isAddInstitutionLoading } =
    useAddInstitutionMutation(graphqlRequestClient, {});

  const { mutateAsync: addDomain, isLoading: isAddDomainLoading } =
    useAddDomainMutation(graphqlRequestClient, {});

  const {
    mutateAsync: addCertification,
    isLoading: isAddCertificationLoading,
  } = useAddCertificationMutation(graphqlRequestClient, {});

  const createInstitutionCb = async (query: string) => {
    const institution = await addInstitution({
      InstitutionInput: {
        name: query,
      },
    });
    const item = {
      value: institution.addInstitution?.id.toString(),
      label: institution.addInstitution?.name,
    };
    setInstitutions((prev) => [...prev, item]);
    setSelectedInstitution(String(item.value));
    form.setFieldValue("institution", item.value?.toString() ?? "");
    return item;
  };

  const createDomainCb = async (query: string) => {
    const domain = await addDomain({
      DomainInput: {
        name: query,
      },
    });
    const item = {
      value: domain.addDomain?.id.toString(),
      label: domain.addDomain?.name,
    };
    setDomains((prev) => [...prev, item]);
    setSelectedDomain(String(item.value));
    form.setFieldValue("domainStudy", item.value?.toString() ?? "");
    return item;
  };

  const createCertificationCb = async (query: string) => {
    const certification = await addCertification({
      CertificationInput: {
        name: query,
      },
    });
    const item = {
      value: certification.addCertification?.id.toString(),
      label: certification.addCertification?.name,
    };
    setCertifications((prev) => [...prev, item]);
    setSelectedCertification(String(item.value));
    form.setFieldValue("certification", item.value?.toString() ?? "");
    return item;
  };

  return (
    <Modal
      title="Add study"
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
        <ShowIfElse
          if={!isInstitutionsLoading || !isAddInstitutionLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Institution"
            description="The place where you had this study"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            // @ts-expect-error("types-check")
            onCreate={(query) => createInstitutionCb(query)}
            mt="md"
            withAsterisk
            icon={<BuildingLibraryIcon width={18} />}
            // @ts-expect-error("types-check")
            data={institutions}
            {...form.getInputProps("institution")}
            value={selectedInstitution}
            onChange={(val) => {
              setSelectedInstitution(val);
              form.setFieldValue("institution", val?.toString() ?? "");
            }}
          />
        </ShowIfElse>
        <ShowIfElse
          if={!isDomainsLoading || !isAddDomainLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Domain"
            description="The area of expertise"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            // @ts-expect-error("types-check")
            onCreate={(query) => createDomainCb(query)}
            mt="md"
            icon={<CogIcon width={18} />}
            // @ts-expect-error("types-check")
            data={domains}
            {...form.getInputProps("domainStudy")}
            value={selectedDomain}
            onChange={(val) => {
              setSelectedDomain(val);
              form.setFieldValue("domainStudy", val?.toString() ?? "");
            }}
          />
        </ShowIfElse>
        <TextInput
          label="Degree"
          mt="md"
          description="The final mark obtained as graduation"
          icon={<DocumentDuplicateIcon width={18} />}
          {...form.getInputProps("degree")}
        />
        <ShowIfElse
          if={!isCertificationsLoading || !isAddCertificationLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Certification"
            description="The license obtained in the institution's program"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            // @ts-expect-error("types-check")
            onCreate={(query) => createCertificationCb(query)}
            mt="md"
            icon={<DocumentCheckIcon width={18} />}
            // @ts-expect-error("types-check")
            data={certifications}
            {...form.getInputProps("certification")}
            value={selectedCertification}
            onChange={(val) => {
              setSelectedCertification(val);
              form.setFieldValue("certification", val?.toString() ?? "");
            }}
          />
        </ShowIfElse>
        <Textarea
          label="Description"
          description="Describe as accurately as possible your studies"
          mt="md"
          minRows={6}
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
        <DatePicker
          withAsterisk
          mt="md"
          label="From"
          description="The starting date of the study program"
          icon={<CalendarIcon width={18} />}
          maxDate={new Date()}
          {...form.getInputProps("startDate")}
          value={startDate}
          onChange={(d) => {
            if (d) {
              setStartDate(d);
              form.setFieldValue("startDate", d);
            } else new Date();
          }}
        />
        <Checkbox
          mt="md"
          label="I have ongoing studies"
          checked={activeStudy}
          onChange={(event) => {
            setActiveStudy(event.currentTarget.checked);
            form.setFieldValue("endDate", null);
          }}
        />
        <ShowIf if={!activeStudy}>
          <DatePicker
            mt="md"
            label="Until"
            description="The ending date of the study"
            disabled={activeStudy}
            icon={<CalendarIcon width={18} />}
            minDate={startDate}
            maxDate={new Date()}
            {...form.getInputProps("endDate")}
          />
        </ShowIf>
        <Group grow={!!initialStudySelected}>
          <ShowIf if={initialStudySelected}>
            <Button
              type="button"
              mt="xl"
              fullWidth
              color="red.7"
              loading={isAddStudyLoading || isUpdateStudyLoading}
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
                    removeStudy({
                      studyId: Number(studyId),
                    }),
                })
              }
            >
              Remove study
            </Button>
          </ShowIf>
          <Button
            type="submit"
            mt="xl"
            fullWidth
            loading={isAddStudyLoading || isUpdateStudyLoading}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
