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
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import FormAddStudySchema from "@validator/FormAddStudySchema";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileStudyModal() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const prevData = queryClient.getQueryData<GetUserProfileQuery>([
    "GetUserProfile",
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  ]);

  const initialStudySelected = prevData?.getUserProfile?.studies?.find(
    (e) => e?.id === params.studyId
  );

  const [activeStudy, setActiveStudy] = useState(
    initialStudySelected?.endDate ? false : true
  );

  const [desc, setDesc] = useState<string>(
    initialStudySelected?.description ?? ""
  );

  const [startDate, setStartDate] = useState<Date>(
    initialStudySelected?.startDate
      ? new Date(initialStudySelected?.startDate)
      : new Date()
  );

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  const [selectedCertification, setSelectedCertification] = useState<
    string | null
  >(initialStudySelected?.certification?.id || null);

  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(
    initialStudySelected?.institution?.id || null
  );

  const [selectedDomain, setSelectedDomain] = useState<string | null>(
    initialStudySelected?.domainStudy?.id || null
  );

  const { data: institutionsData, isLoading: isInstitutionsLoading } =
    useGetAllInstitutionsQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for institutions, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
      onSuccess: (data) => {
        setInstitutions(
          data.getAllInstitutions?.map((i) => ({
            label: i?.name,
            value: i?.id,
          })) ?? []
        );
      },
    });

  const [institutions, setInstitutions] = useState<
    { label?: string; value?: string }[]
  >(
    institutionsData?.getAllInstitutions?.map((i) => ({
      label: i?.name,
      value: i?.id,
    })) ?? []
  );

  const { data: domainsData, isLoading: isDomainsLoading } =
    useGetAllDomainsQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for domains, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
      onSuccess: (data) => {
        setDomains(
          data.getAllDomains?.map((d) => ({
            label: d?.name,
            value: d?.id,
          })) ?? []
        );
      },
    });

  const [domains, setDomains] = useState<{ label?: string; value?: string }[]>(
    domainsData?.getAllDomains?.map((d) => ({
      label: d?.name,
      value: d?.id,
    })) ?? []
  );

  const { data: certificationsData, isLoading: isCertificationsLoading } =
    useGetAllCertificationsQuery(graphqlRequestClient, undefined, {
      onError: () => {
        showNotification({
          title: "Data error",
          message:
            "Could not retrieve values for certifications, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
      onSuccess: (data) => {
        setCertifications(
          data.getAllCertifications?.map((c) => ({
            label: c?.name,
            value: c?.id,
          })) ?? []
        );
      },
    });

  const [certifications, setCertifications] = useState<
    { label?: string; value?: string }[]
  >(
    certificationsData?.getAllCertifications?.map((c) => ({
      label: c?.name,
      value: c?.id,
    })) ?? []
  );

  const form = useForm({
    initialValues: {
      id: initialStudySelected?.id ?? null,
      institution: initialStudySelected?.institution?.id ?? null,
      domainStudy: initialStudySelected?.domainStudy?.id ?? null,
      degree: initialStudySelected?.degree ?? "",
      certification: initialStudySelected?.certification?.id ?? null,
      description: initialStudySelected?.description ?? "",
      startDate: initialStudySelected?.startDate
        ? new Date(initialStudySelected?.startDate)
        : new Date(),
      endDate: initialStudySelected?.endDate
        ? new Date(initialStudySelected?.endDate)
        : null,
      userProfileSlugUrl: params.profileSlug ?? "",
    },
    validate: zodResolver(FormAddStudySchema),
  });

  const { mutate: addStudy, isLoading: isAddStudyLoading } =
    useAddUserProfileStudyMutation(graphqlRequestClient, {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message:
            "Could not update studies information, please try again later",
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
          title: "Studies update",
          message: "Successfully update studies information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    });

  const { mutate: updateStudy, isLoading: isUpdateStudyLoading } =
    useUpdateUserProfileStudyMutation(graphqlRequestClient, {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message:
            "Could not update studies information, please try again later",
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
          title: "Studies update",
          message: "Successfully updated studies information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    });

  const handleSubmit = async (values: typeof form["values"]) => {
    const id = values.id;
    const institution = values.institution as string;
    const domainStudy = values.domainStudy as string;
    const certification = values.certification as string;
    const startDate = values.startDate;
    const endDate = values.endDate;

    if (id) {
      updateStudy({
        StudyInput: {
          ...values,
          id,
          institution,
          domainStudy,
          certification,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: endDate && format(endDate, "yyyy-MM-dd"),
        },
      });
    } else
      addStudy({
        StudyInput: {
          ...values,
          institution,
          domainStudy,
          certification,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: endDate && format(endDate, "yyyy-MM-dd"),
        },
      });
  };

  const { mutateAsync: addInstitution, isLoading: isAddInstitutionLoading } =
    useAddInstitutionMutation(graphqlRequestClient, {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message: "Could not update institutions list, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    });

  const { mutateAsync: addDomain, isLoading: isAddDomainLoading } =
    useAddDomainMutation(graphqlRequestClient, {
      onError: (err) => {
        showNotification({
          title: "Unknown error",
          message: "Could not update domains list, please try again later",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    });

  const {
    mutateAsync: addCertification,
    isLoading: isAddCertificationLoading,
  } = useAddCertificationMutation(graphqlRequestClient, {
    onError: (err) => {
      showNotification({
        title: "Unknown error",
        message: "Could not update certifications list, please try again later",
        autoClose: 5000,
        icon: <ExclamationTriangleIcon width={20} />,
      });
    },
  });

  const createInstitutionCb = async (query: string) => {
    try {
      const institution = await addInstitution({
        InstitutionInput: {
          name: query,
        },
      });
      const item = {
        value: institution.addInstitution?.id,
        label: institution.addInstitution?.name,
      };
      setInstitutions((prev) => [...prev, item]);
      setSelectedInstitution(item.value as string);
      form.setFieldValue("institution", item.value as string);
      return item;
    } catch (err) {}
  };

  const createDomainCb = async (query: string) => {
    try {
      const domain = await addDomain({
        DomainInput: {
          name: query,
        },
      });
      const item = {
        value: domain.addDomain?.id,
        label: domain.addDomain?.name,
      };
      setDomains((prev) => [...prev, item]);
      setSelectedDomain(item.value as string);
      form.setFieldValue("domainStudy", item.value as string);
      return item;
    } catch (err) {}
  };

  const createCertificationCb = async (query: string) => {
    try {
      const certification = await addCertification({
        CertificationInput: {
          name: query,
        },
      });
      const item = {
        value: certification.addCertification?.id,
        label: certification.addCertification?.name,
      };
      setCertifications((prev) => [...prev, item]);
      setSelectedCertification(item.value as string);
      form.setFieldValue("certification", item.value as string);
      return item;
    } catch (err) {}
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
            onCreate={(query) => createInstitutionCb(query)}
            mt="md"
            withAsterisk
            icon={<BuildingLibraryIcon width={18} />}
            data={institutions}
            {...form.getInputProps("institution")}
            value={selectedInstitution}
            onChange={(val) => {
              setSelectedInstitution(val);
              form.setFieldValue("institution", val);
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
            onCreate={(query) => createDomainCb(query)}
            mt="md"
            icon={<CogIcon width={18} />}
            data={domains}
            {...form.getInputProps("domainStudy")}
            value={selectedDomain}
            onChange={(val) => {
              setSelectedDomain(val);
              form.setFieldValue("domainStudy", val);
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
            onCreate={(query) => createCertificationCb(query)}
            mt="md"
            icon={<DocumentCheckIcon width={18} />}
            data={certifications}
            {...form.getInputProps("certification")}
            value={selectedCertification}
            onChange={(val) => {
              setSelectedCertification(val);
              form.setFieldValue("certification", val);
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
        <Button
          type="submit"
          fullWidth
          mt="xl"
          loading={isAddStudyLoading || isUpdateStudyLoading}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
}
