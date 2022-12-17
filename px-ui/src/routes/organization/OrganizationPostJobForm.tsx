import { useAuth } from "@auth/useAuth";
import { SelectItem } from "@components/select-items/SelectItem";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  ContractType,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
} from "@gql/generated";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentIcon,
  CubeIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Loader,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "@utils/capitalizeString";
import { FormJobListingSchema } from "@validator/FormJobListingSchema";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizationPostJobForm() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // const prevData = queryClient.getQueryData<GetUserProfileQuery>([
  //   "GetUserProfile",
  //   {
  //     profileSlugUrl: user?.profileSlugUrl,
  //   },
  // ]);

  // const initialExperienceSelected = prevData?.getUserProfile?.experiences?.find(
  //   (e) => e?.id === organizationId
  // );

  const [desc, setDesc] = useState<string>("");

  const [startDate, setStartDate] = useState<Date>(new Date());

  const { data: countries, isLoading: isCountryListLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient, undefined, {});

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useGetAllOrganizationsQuery(graphqlRequestClient, undefined, {});

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
      availableFrom: new Date(),
      availableTo: new Date(),
      location: "",
      jobId: null,
      numberOfVacancies: 1,
      contractType: "",
      organizationId: organizationId,
      categoryId: null,
    },
    validate: zodResolver(FormJobListingSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    console.log(values);
  };

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
        <DatePicker
          withAsterisk
          mt="md"
          label="From"
          description="The starting date of employment"
          clearable={false}
          icon={<CalendarIcon width={18} />}
          maxDate={new Date()}
          {...form.getInputProps("availableFrom")}
          value={startDate}
          onChange={(d) => {
            if (d) {
              setStartDate(d);
              form.setFieldValue("startDate", d);
            } else new Date();
          }}
        />
        <DatePicker
          mt="md"
          label="Until"
          description="The ending date of employment"
          icon={<CalendarIcon width={18} />}
          withAsterisk
          minDate={startDate}
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
          if={!isCountryListLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Job"
            description="The base job type of this listing (e.g. Software Developer)"
            searchable
            mt="md"
            withAsterisk
            data={[]}
            icon={<MapPinIcon width={18} />}
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
            label: capitalizeFirstLetter(
              value.toLowerCase().split("_").join(" ")
            ),
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
          if={!isOrganizationsLoading}
          else={<Loader mt="md" size="sm" variant="dots" />}
        >
          <Select
            label="Category"
            description="The category of this job"
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
            {...form.getInputProps("categoryId")}
          />
        </ShowIfElse>
      </form>
    </Modal>
  );
}
