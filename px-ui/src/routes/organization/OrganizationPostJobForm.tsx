import { SelectItem } from "@components/select-items/SelectItem";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  ContractType,
  FieldType,
  GetOrganizationBySlugNameQuery,
  Operator,
  useAddJobCategoryMutation,
  useGetAllJobCategoriesQuery,
  useGetAllJobListingsQuery,
  useGetAllJobsQuery,
  useGetAllOrganizationsQuery,
  useGetAllRecruitersForOrganizationBySlugQuery,
  useGetCountriesCitiesQuery,
  useGetOrganizationBySlugNameQuery,
  usePublishJobListingMutation,
  WorkType,
} from "@gql/generated";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CubeIcon,
  GlobeAltIcon,
  LifebuoyIcon,
  MapPinIcon,
  UserIcon,
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
import { useQueryClient } from "@tanstack/react-query";
import { prettyEnumValue } from "@utils/enumUtils";
import { FormJobListingSchema } from "@validator/FormJobListingSchema";
import { addDays, format } from "date-fns";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizationPostJobForm() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { organizationSlug, jobListingId } = useParams();
  const queryClient = useQueryClient();

  const prevOrgQuery = queryClient.getQueryData<GetOrganizationBySlugNameQuery>(
    useGetOrganizationBySlugNameQuery.getKey({
      slugName: organizationSlug ?? "",
    })
  );

  const [orgId, setOrgId] = useState<string | null>(
    prevOrgQuery?.getOrganizationBySlugName?.id ?? null
  );

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
    useGetAllOrganizationsQuery(
      graphqlRequestClient,
      {},
      {
        onSuccess: (data) => {
          const org = data.getAllOrganizations?.find(
            (o) => o?.slugName === organizationSlug
          );
          if (org) {
            setOrgId(org.id);
            form.setFieldValue("organizationId", org.id);
          }
        },
      }
    );

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

  const { data: recruitersData, isLoading: isRecruitersLoading } =
    useGetAllRecruitersForOrganizationBySlugQuery(
      graphqlRequestClient,
      {
        organizationSlug: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      }
    );

  const [jobCategories, setJobCategories] = useState<
    { label?: string; value?: string }[]
  >(
    jobCategoriesData?.getAllJobCategories?.map((j) => ({
      label: j?.name as string,
      value: j?.id as string,
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
      value: jobCategory.addJobCategory?.id as string,
      label: jobCategory.addJobCategory?.name as string,
    };
    setJobCategories((prev) => [...prev, item]);
    setSelectedJobCategory(item.value);
    form.setFieldValue("categoryId", item.value);
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
          value: ci as string,
        }));
        return locs;
      })
      .flat(1) || [];

  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    initialValues: {
      id: jobListingId ?? null,
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
      organizationId: orgId,
      categoryId: jobListingItem?.category?.id ?? "",
      recruiterId: jobListingItem?.recruiter?.id ?? "",
      workType: jobListingItem?.workType ?? WorkType.Hybrid,
    },
    validate: zodResolver(FormJobListingSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    publishJob({
      JobListingInput: {
        ...values,
        organizationId: orgId as string,
        availableFrom: format(
          values.availableFrom,
          "yyyy-MM-dd"
        ) as unknown as Date,
        availableTo: format(
          values.availableTo,
          "yyyy-MM-dd"
        ) as unknown as Date,
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
            {desc.length}/2.000
          </Text>
        </Group>
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
            // @ts-expect-error(types-error)
            onCreate={(query) => createJobCategoryCb(query)}
            // @ts-expect-error(types-error)
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
            } else {
              const currDate = new Date();
              setStartDate(currDate);
              form.setFieldValue("availableFrom", currDate);
            }
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
              value: j?.id as string,
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
          min={0}
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
        <Select
          label="Work type"
          description="If the organization allows alternative choices for workplaces"
          mt="md"
          withAsterisk
          icon={<GlobeAltIcon width={18} />}
          data={(Object.entries(WorkType) ?? [])?.map(([, value]) => ({
            label: prettyEnumValue(value),
            value: value,
          }))}
          {...form.getInputProps("workType")}
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
            // readOnly
            data={(organizations?.getAllOrganizations ?? [])?.map((o) => ({
              label: o?.name,
              value: o?.id as string,
              image: o?.photography,
              description: o?.activitySector.name,
            }))}
            icon={<BuildingOffice2Icon width={18} />}
            {...form.getInputProps("organizationId")}
          />
        </ShowIfElse>
        <ShowIfElse
          if={!isRecruitersLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Recruiter"
            description="The recruiting person for this job publishing"
            mt="md"
            withAsterisk
            itemComponent={SelectItem}
            data={(
              recruitersData?.getAllRecruitersForOrganizationBySlug ?? []
            )?.map((r) => ({
              label:
                r?.user.firstName && r.user.lastName
                  ? `${r.user.firstName} ${r.user.lastName}`
                  : r?.user.username,
              value: r?.id as string,
              description: r?.user.userProfile.profileTitle,
              image:
                r?.user.userProfile.photography &&
                `${APP_IMAGES_API_PATH}/100x100?f=/${r.user.userProfile.photography}`,
            }))}
            icon={<UserIcon width={18} />}
            {...form.getInputProps("recruiterId")}
          />
        </ShowIfElse>
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
}
