import { SelectItem } from "@components/select-items/SelectItem";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  ContractType,
  FieldType,
  Operator,
  useAddJobCategoryMutation,
  useGetAllJobCategoriesQuery,
  useGetAllJobListingsQuery,
  useGetAllJobsQuery,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
  usePublishJobListingMutation,
} from "@gql/generated";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CubeIcon,
  LifebuoyIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { prettyEnumValue } from "@utils/enumUtils";
import { FormJobListingSchema } from "@validator/FormJobListingSchema";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizationPostJobForm() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { organizationId, jobListingId } = useParams();

  const { data: jobListing, isInitialLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            key: "id",
            fieldType: FieldType.Long,
            operator: Operator.Equal,
            value: jobListingId?.toString() as string,
          },
        ],
      },
    },
    {
      enabled: !!jobListingId,
    }
  );

  const jobListingItem = jobListing?.getAllJobListings?.list?.[0];

  const [desc, setDesc] = useState<string>(jobListingItem?.description ?? "");

  const [startDate, setStartDate] = useState<Date>(new Date());

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useGetAllOrganizationsQuery(graphqlRequestClient);

  const { data: jobCategoriesData, isLoading: isJobCategoriesLoading } =
    useGetAllJobCategoriesQuery(graphqlRequestClient, undefined, {
      onSuccess: ({ getAllJobCategories }) => {
        setJobCategories(
          getAllJobCategories?.map((j) => ({ label: j?.name, value: j?.id })) ??
            []
        );
      },
    });

  const { data: jobs, isLoading: isJobsLoading } =
    useGetAllJobsQuery(graphqlRequestClient);

  const [jobCategories, setJobCategories] = useState<
    { label?: string; value?: string }[]
  >(
    jobCategoriesData?.getAllJobCategories?.map((j) => ({
      label: j?.name,
      value: j?.id,
    })) ?? []
  );

  const [selectedJobCategory, setSelectedJobCategory] = useState<string | null>(
    jobListingItem?.category?.id ?? null
  );

  const { mutateAsync: addJobCategory, isLoading: isAddJobCategoryLoading } =
    useAddJobCategoryMutation(graphqlRequestClient);

  const createJobCategoryCb = async (query: string) => {
    const jobCategory = await addJobCategory({
      JobCategoryInput: {
        name: query,
      },
    });
    const item = {
      value: jobCategory.addJobCategory?.id,
      label: jobCategory.addJobCategory?.name,
    };
    setJobCategories((prev) => [...prev, item]);
    setSelectedJobCategory(item.value as string);
    form.setFieldValue("categoryId", item.value as string);
    return item;
  };

  const { mutate: publishJob } = usePublishJobListingMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Organization updates",
          message: "Successfully published job listing",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        closeModal();
      },
    }
  );

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
      title: jobListingItem?.title ?? "",
      description: jobListingItem?.description ?? "",
      availableFrom: jobListingItem?.availableFrom
        ? new Date(jobListingItem.availableFrom)
        : new Date(),
      availableTo: jobListingItem?.availableTo
        ? new Date(jobListingItem.availableTo)
        : addDays(new Date(), 1),
      location: jobListingItem?.city.name ?? "",
      jobId: jobListingItem?.job.id ?? "",
      numberOfVacancies: jobListingItem?.numberOfVacancies ?? 1,
      contractType: jobListingItem?.contractType ?? ContractType["FullTime"],
      organizationId: organizationId,
      categoryId: jobListingItem?.category?.id ?? "",
    },
    validate: zodResolver(FormJobListingSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    publishJob({
      JobListingInput: {
        ...values,
        organizationId: organizationId as string,
        availableFrom: format(values.availableFrom, "yyyy-MM-dd"),
        availableTo: format(values.availableTo, "yyyy-MM-dd"),
      },
    });
  };

  if (isInitialLoading) return <ApplicationSpinner />;

  return (
    <Modal
      title="Publish job"
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
          description="The headline of the job listing"
          mt="md"
          withAsterisk
          icon={<CubeIcon width={18} />}
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          description="Fill in a job description for this listing"
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
            {desc.length}/2.000
          </Text>
        </Group>
        <DatePicker
          withAsterisk
          mt="md"
          label="From"
          description="The starting date of this listing"
          clearable={false}
          icon={<CalendarIcon width={18} />}
          minDate={new Date()}
          {...form.getInputProps("availableFrom")}
          value={startDate}
          onChange={(d) => {
            if (d) {
              setStartDate(d);
              form.setFieldValue("availableFrom", d);
            } else new Date();
          }}
        />
        <DatePicker
          mt="md"
          label="Until"
          description="The ending date of this listing"
          icon={<CalendarIcon width={18} />}
          withAsterisk
          minDate={addDays(startDate, 1)}
          clearable={false}
          {...form.getInputProps("availableTo")}
        />
        <ShowIfElse
          if={!isCountryListLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Location"
            description="The place where this job will be held"
            searchable
            mt="md"
            withAsterisk
            data={locations}
            icon={<MapPinIcon width={18} />}
            {...form.getInputProps("location")}
          />
        </ShowIfElse>
        <ShowIfElse
          if={!isJobsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Job"
            description="The base job type of this listing (e.g. Software Developer)"
            searchable
            mt="md"
            withAsterisk
            itemComponent={SelectItem}
            data={(jobs?.getAllJobs ?? [])?.map((j) => ({
              label: j?.name,
              value: j?.id,
              description: j?.description,
            }))}
            icon={<WrenchIcon width={18} />}
            {...form.getInputProps("jobId")}
          />
        </ShowIfElse>
        <NumberInput
          defaultValue={18}
          label="No. of spots"
          placeholder="The number of occupancy spots for this job listing"
          withAsterisk
          mt="md"
          icon={<UsersIcon width={18} />}
          {...form.getInputProps("numberOfVacancies")}
        />
        <Select
          label="Contract type"
          description="The type of contract for this job"
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
          if={!isOrganizationsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Organization"
            description="The recruiting company of this job"
            mt="md"
            withAsterisk
            itemComponent={SelectItem}
            readOnly
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
          if={!isJobCategoriesLoading || isAddJobCategoryLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Category"
            description="The category of this job"
            mt="md"
            withAsterisk
            creatable
            searchable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => createJobCategoryCb(query)}
            data={jobCategories}
            icon={<LifebuoyIcon width={18} />}
            {...form.getInputProps("categoryId")}
            value={selectedJobCategory}
            onChange={(val) => {
              setSelectedJobCategory(val);
              form.setFieldValue("categoryId", val as string);
            }}
          />
        </ShowIfElse>
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
}
