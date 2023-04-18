import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  GetOrganizationBySlugNameQuery,
  OrganizationInputSchema,
  OrganizationSize,
  Specialization,
  useCreateOrUpdateOrganizationMutation,
  useGetAllActivitySectorsQuery,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CogIcon,
  CubeIcon,
  MapPinIcon,
  PhotoIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { prettyEnumValue, prettyEnumValueCompanySize } from "@utils/enumUtils";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrganizationModal = () => {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { organizationSlug } = useParams();
  const queryClient = useQueryClient();
  const prevOrgQuery = queryClient.getQueryData<GetOrganizationBySlugNameQuery>(
    useGetOrganizationBySlugNameQuery.getKey({
      slugName: organizationSlug ?? "",
    })
  );
  const [desc, setDesc] = useState<string>(
    prevOrgQuery?.getOrganizationBySlugName?.description ?? ""
  );

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { data: activitySectors, isLoading: isActivitySectorsLoading } =
    useGetAllActivitySectorsQuery(graphqlRequestClient);

  const { data: organizationData, isInitialLoading: isOrganizationLoading } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug ?? "",
      },
      {
        enabled: !!organizationSlug,
        onSuccess: (data) => {
          const {
            recruitmentProcess,
            slugName,
            headQuarters,
            activitySector,
            ...rest
          } = data.getOrganizationBySlugName ?? {};
          const trsfLocs = data.getOrganizationBySlugName?.locations?.map(
            (l) => l?.id
          );
          form.setValues({
            ...rest,
            description: data.getOrganizationBySlugName?.description ?? "",
            photography: data.getOrganizationBySlugName?.photography ?? "",
            webSite: data.getOrganizationBySlugName?.webSite ?? "",
            activitySectorId:
              data.getOrganizationBySlugName?.activitySector.id ?? "",
            headQuartersId:
              data.getOrganizationBySlugName?.headQuarters.id ?? "",
            foundedAt: data.getOrganizationBySlugName?.foundedAt
              ? new Date(data.getOrganizationBySlugName.foundedAt)
              : new Date(),
            specializations:
              data.getOrganizationBySlugName?.specializations ?? [],
            locations: trsfLocs ?? [],
          });
          setDesc(data.getOrganizationBySlugName?.description ?? "");
        },
      }
    );

  const { mutate } = useCreateOrUpdateOrganizationMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Organization update",
          message: "Successfully created/updated organization",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        closeModal();
        queryClient.invalidateQueries(useGetAllOrganizationsQuery.getKey());
        queryClient.invalidateQueries(
          useGetOrganizationBySlugNameQuery.getKey({
            slugName: organizationSlug ?? "",
          })
        );
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
      id: organizationData?.getOrganizationBySlugName?.id ?? null,
      name: organizationData?.getOrganizationBySlugName?.name ?? "",
      description:
        organizationData?.getOrganizationBySlugName?.description ?? "",
      slogan: organizationData?.getOrganizationBySlugName?.slogan ?? "",
      activitySectorId:
        organizationData?.getOrganizationBySlugName?.activitySector.id ?? "",
      headQuartersId:
        organizationData?.getOrganizationBySlugName?.headQuarters.id ?? "",
      companySize:
        organizationData?.getOrganizationBySlugName?.companySize ??
        OrganizationSize["Between_1_5"],
      foundedAt: organizationData?.getOrganizationBySlugName?.foundedAt
        ? new Date(organizationData?.getOrganizationBySlugName?.foundedAt)
        : new Date(),
      webSite: organizationData?.getOrganizationBySlugName?.webSite ?? "",
      specializations:
        organizationData?.getOrganizationBySlugName?.specializations ?? [],
      locations:
        organizationData?.getOrganizationBySlugName?.locations?.map(
          (l) => l?.id
        ) ?? [],
      photography:
        organizationData?.getOrganizationBySlugName?.photography ?? "",
    },
    validate: zodResolver(OrganizationInputSchema()),
  });

  const locations = useMemo(
    () =>
      countries?.getCountriesCities
        ?.map((c) => {
          const city =
            c?.cities?.map((ci) => ({ name: ci?.name, id: ci?.id })) || [];
          const locs = city.map((ci) => ({
            value: ci.id as string,
            label: `${c?.name}, ${ci.name}`,
          }));
          return locs;
        })
        .flat(1) || [],
    [countries]
  );

  const handleSubmit = async (values: (typeof form)["values"]) => {
    mutate({
      OrganizationInput: {
        ...values,
        locations: values.locations.map((l) => l) as unknown as string[],
        specializations: values.specializations ?? [],
        foundedAt: format(values.foundedAt, "yyyy-MM-dd") as unknown as Date,
      },
    });
  };

  const changeDescCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(e.currentTarget.value);
      form.setFieldValue("description", e.currentTarget.value);
    },
    [form]
  );

  if (isOrganizationLoading) return <ApplicationSpinner />;

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
          label="Slogan"
          description="Describe the organization in one line"
          mt="md"
          withAsterisk
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("slogan")}
        />
        <ShowIfElse
          if={!isActivitySectorsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Activity sector"
            description="The activity domain of the organization"
            searchable
            mt="md"
            withAsterisk
            icon={<CogIcon width={18} />}
            data={(activitySectors?.getAllActivitySectors ?? []).map((a) => ({
              label: a?.name,
              value: a?.id as string,
            }))}
            {...form.getInputProps("activitySectorId")}
          />
        </ShowIfElse>
        <ShowIfElse
          if={!isCountryListLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Headquarters"
            description="The headquarters location of this organization"
            searchable
            mt="md"
            withAsterisk
            data={locations}
            icon={<MapPinIcon width={18} />}
            {...form.getInputProps("headQuartersId")}
          />
        </ShowIfElse>
        <DatePicker
          mt="md"
          label="Founded"
          description="The date when this organization was founded"
          icon={<CalendarIcon width={18} />}
          withAsterisk
          maxDate={new Date()}
          clearable={false}
          {...form.getInputProps("foundedAt")}
        />
        <Select
          label="Company size"
          description="The approximate size of the organization"
          mt="md"
          withAsterisk
          icon={<BuildingOffice2Icon width={18} />}
          data={(Object.entries(OrganizationSize) ?? [])?.map(([, value]) => ({
            label: `${prettyEnumValueCompanySize(value)} employees`,
            value,
          }))}
          {...form.getInputProps("companySize")}
        />
        <TextInput
          label="Website"
          description="The home page of the organization"
          mt="md"
          placeholder="https://acme.example.org"
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("webSite")}
        />
        <MultiSelect
          label="Specializations"
          description="The areas of specialization for your organization"
          mt="md"
          searchable
          data={(Object.entries(Specialization) ?? []).map(([, value]) => ({
            label: prettyEnumValue(value),
            value,
          }))}
          icon={<Square3Stack3DIcon width={18} />}
          {...form.getInputProps("specializations")}
        />
        <MultiSelect
          label="Locations"
          description="The locations of activity for your organization"
          mt="md"
          searchable
          data={locations}
          icon={<MapPinIcon width={18} />}
          {...form.getInputProps("locations")}
        />
        <Divider my={25} />
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
