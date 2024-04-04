import viewToPlainText from "@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext";
import MantineEditor from "@components/inputs/MantineEditor";
import { SelectItem } from "@components/select-items/SelectItem";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { APP_API_BASE_URL } from "@constants/Properties";
import {
  ContractType,
  FieldType,
  GetOrganizationBySlugNameQuery,
  Operator,
  WorkType,
  useAddJobCategoryMutation,
  useGetAllJobCategoriesQuery,
  useGetAllJobListingsQuery,
  useGetAllJobsQuery,
  useGetAllOrganizationsQuery,
  useGetAllRecruitersForOrganizationBySlugQuery,
  useGetCountriesCitiesQuery,
  useGetOrganizationBySlugNameQuery,
  usePublishJobListingMutation,
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
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
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
    }),
  );

  const [orgId, setOrgId] = useState<string | null>(
    prevOrgQuery?.getOrganizationBySlugName?.id.toString() ?? null,
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
      onSuccess: (data) => {
        if (data.getAllJobListings?.list?.[0]) {
          const firstItem = data.getAllJobListings?.list?.[0];
          form.setValues({
            ...firstItem,
            categoryId: firstItem?.category?.id.toString(),
            availableFrom: new Date(firstItem.availableFrom),
            availableTo: new Date(firstItem.availableTo),
            location: firstItem.city.name,
            jobId: firstItem.job.id.toString(),
            organizationId: firstItem.organization.id.toString(),
            recruiterId: firstItem.recruiter?.id.toString(),
          });
          setSelectedJobCategory(firstItem?.category?.id.toString() ?? null);
        }
      },
    },
  );

  const jobListingItem = jobListing?.getAllJobListings?.list?.[0];

  const [startDate, setStartDate] = useState<Date>(new Date());

  const { data: countries, isInitialLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { data: organizations, isInitialLoading: isOrganizationsLoading } =
    useGetAllOrganizationsQuery(
      graphqlRequestClient,
      {},
      {
        onSuccess: (data) => {
          const org = data.getAllOrganizations?.find(
            (o) => o?.slugName === organizationSlug,
          );
          if (org) {
            setOrgId(org.id.toString());
            form.setFieldValue("organizationId", org.id.toString());
          }
        },
      },
    );

  const { data: jobCategoriesData, isInitialLoading: isJobCategoriesLoading } =
    useGetAllJobCategoriesQuery(graphqlRequestClient, undefined, {
      onSuccess: ({ getAllJobCategories }) => {
        setJobCategories(
          getAllJobCategories?.map((j) => ({
            label: j?.name,
            value: j?.id.toString(),
          })) ?? [],
        );
      },
    });

  const { data: jobs, isInitialLoading: isJobsLoading } =
    useGetAllJobsQuery(graphqlRequestClient);

  const { data: recruitersData, isInitialLoading: isRecruitersLoading } =
    useGetAllRecruitersForOrganizationBySlugQuery(
      graphqlRequestClient,
      {
        organizationSlug: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      },
    );

  const [jobCategories, setJobCategories] = useState<
    { label?: string; value?: string }[]
  >(
    jobCategoriesData?.getAllJobCategories?.map((j) => ({
      label: j?.name as string,
      value: j?.id.toString(),
    })) ?? [],
  );

  const [selectedJobCategory, setSelectedJobCategory] = useState<string | null>(
    jobListingItem?.category?.id.toString() ?? null,
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
      value: jobCategory.addJobCategory?.id.toString() ?? "",
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
    },
  );

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

  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    initialValues: {
      id: jobListingId ? Number(jobListingId) : null,
      title: jobListingItem?.title ?? "",
      description: jobListingItem?.description ?? "",
      formattedDescription: jobListingItem?.formattedDescription ?? "",
      availableFrom: jobListingItem?.availableFrom
        ? new Date(jobListingItem.availableFrom)
        : new Date(),
      availableTo: jobListingItem?.availableTo
        ? new Date(jobListingItem.availableTo)
        : addDays(new Date(), 1),
      location: jobListingItem?.city.name ?? "",
      jobId: jobListingItem?.job.id.toString() ?? "",
      numberOfVacancies: jobListingItem?.numberOfVacancies ?? 1,
      contractType: jobListingItem?.contractType ?? ContractType["FullTime"],
      organizationId: orgId,
      categoryId: jobListingItem?.category?.id.toString() ?? "",
      recruiterId: jobListingItem?.recruiter?.id.toString() ?? "",
      workType: jobListingItem?.workType ?? WorkType.Hybrid,
    },
    validate: zodResolver(FormJobListingSchema),
  });

  const handleSubmit = async (values: (typeof form)["values"]) => {
    publishJob({
      JobListingInput: {
        ...values,
        categoryId: Number(values.categoryId),
        organizationId: Number(orgId),
        jobId: Number(values.jobId),
        availableFrom: format(
          values.availableFrom,
          "yyyy-MM-dd",
        ) as unknown as Date,
        availableTo: format(
          values.availableTo,
          "yyyy-MM-dd",
        ) as unknown as Date,
        formattedDescription: values.formattedDescription,
        recruiterId: Number(values.recruiterId),
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
        <MantineEditor
          label="Description"
          description="Fill in a job description for this listing"
          mt="md"
          withAsterisk
          {...form.getInputProps("formattedDescription")}
          initialValue={jobListingItem?.formattedDescription}
          onChange={(_v, editor) => {
            const data = editor.getData();
            const plainText = viewToPlainText(
              // @ts-expect-error("ckeditor types")
              editor.editing.view.document.getRoot(),
            );
            form.setFieldValue("formattedDescription", data);
            form.setFieldValue("description", plainText);
          }}
        />
        <Textarea
          className="hidden"
          label="Description"
          description="Fill in a job description for this listing"
          mt="md"
          withAsterisk
          minRows={6}
          icon={<ChatBubbleBottomCenterTextIcon width={18} />}
          {...form.getInputProps("description")}
        />
        <Group position="right">
          <Text
            size="xs"
            color={!form.errors.description ? "dimmed" : "red"}
            mt={4}
          >
            {form.values.description.length}/8.000
          </Text>
        </Group>
        <Select
          label="Category"
          description="The category of this job"
          mt="md"
          withAsterisk
          creatable
          searchable
          disabled={isJobCategoriesLoading || isAddJobCategoryLoading}
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
            form.setFieldValue("categoryId", val ?? "");
          }}
        />
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
        <Select
          label="Location"
          description="The place where this job will be held"
          searchable
          mt="md"
          withAsterisk
          disabled={isCountryListLoading}
          data={locations}
          icon={<MapPinIcon width={18} />}
          {...form.getInputProps("location")}
        />
        <Select
          label="Job"
          description="The base job type of this listing (e.g. Software Developer)"
          searchable
          mt="md"
          withAsterisk
          disabled={isJobsLoading}
          itemComponent={SelectItem}
          data={(jobs?.getAllJobs ?? [])?.map((j) => ({
            label: j?.name,
            value: j?.id.toString() ?? "",
            description: j?.description,
          }))}
          icon={<WrenchIcon width={18} />}
          {...form.getInputProps("jobId")}
        />
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
        <Select
          label="Organization"
          description="The recruiting company of this job"
          mt="md"
          withAsterisk
          disabled={isOrganizationsLoading}
          itemComponent={SelectItem}
          // readOnly
          data={(organizations?.getAllOrganizations ?? [])?.map((o) => ({
            label: o?.name,
            value: o?.id.toString() ?? "",
            image: o?.photography,
            description: o?.activitySector.name,
          }))}
          icon={<BuildingOffice2Icon width={18} />}
          {...form.getInputProps("organizationId")}
          value={orgId}
          onChange={(val) => {
            setOrgId(val);
            form.setFieldValue("organizationId", val as string);
          }}
        />
        <Select
          label="Recruiter"
          description="The recruiting person for this job publishing"
          mt="md"
          withAsterisk
          disabled={isRecruitersLoading}
          itemComponent={SelectItem}
          data={(
            recruitersData?.getAllRecruitersForOrganizationBySlug ?? []
          )?.map((r) => ({
            label:
              r?.user.firstName && r.user.lastName
                ? `${r.user.firstName} ${r.user.lastName}`
                : r?.user.username,
            value: r?.id.toString() ?? "",
            description: r?.user.userProfile.profileTitle,
            image:
              r?.user.userProfile.userProfileAvatarImage &&
              `${APP_API_BASE_URL}/${r.user.userProfile.userProfileAvatarImage.url}`,
          }))}
          icon={<UserIcon width={18} />}
          {...form.getInputProps("recruiterId")}
        />
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
}
