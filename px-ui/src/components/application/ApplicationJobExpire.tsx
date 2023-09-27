import {
  ContractType,
  FieldType,
  GetAllJobListingsQuery,
  Operator,
  SearchQueryInput,
  useGetAllJobListingsQuery,
  usePublishJobListingMutation,
  WorkType,
} from "@gql/generated";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Group,
  Loader,
  Popover,
  PopoverProps,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { FormJobListingSchema } from "@validator/FormJobListingSchema";
import { addDays, format } from "date-fns";
import { useParams } from "react-router-dom";

type OrganizationJobExtendExpireProps = {
  children: React.ReactNode;
  popoverProps?: PopoverProps;
};

const ApplicationJobExpire = ({
  children,
  popoverProps,
}: OrganizationJobExtendExpireProps) => {
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const searchQuery = {
    searchQuery: {
      filters: [
        {
          key: "id",
          fieldType: FieldType.Long,
          operator: Operator.Equal,
          value: jobId?.toString() as string,
        },
      ],
    },
  };

  const prevJobListing = queryClient.getQueryData<GetAllJobListingsQuery>(
    useGetAllJobListingsQuery.getKey({
      searchQuery: searchQuery as SearchQueryInput,
    })
  );

  const { data: jobListing, isInitialLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    searchQuery,
    {
      enabled: !!jobId,
    }
  );

  const { mutate: publishJob } = usePublishJobListingMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Job update",
          message: "Successfully updated job listing",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        queryClient.invalidateQueries(
          useGetAllJobListingsQuery.getKey({
            ...searchQuery,
          })
        );
      },
    }
  );

  const jobListingItem =
    prevJobListing?.getAllJobListings?.list?.[0] ??
    jobListing?.getAllJobListings?.list?.[0];

  const form = useForm({
    initialValues: {
      id: Number(jobId) ?? null,
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
      jobId: jobListingItem?.job.id ?? 0,
      numberOfVacancies: jobListingItem?.numberOfVacancies ?? 1,
      contractType: jobListingItem?.contractType ?? ContractType["FullTime"],
      organizationId: jobListingItem?.organization.id ?? "",
      categoryId: jobListingItem?.category?.id ?? 0,
      recruiterId: jobListingItem?.recruiter?.id ?? 0,
      workType: jobListingItem?.workType ?? WorkType.Hybrid,
    },
    validate: zodResolver(FormJobListingSchema),
  });

  const handleSubmit = async (values: (typeof form)["values"]) => {
    publishJob({
      JobListingInput: {
        ...values,
        organizationId: jobListingItem?.organization.id ?? 0,
        availableFrom: format(
          values.availableFrom,
          "yyyy-MM-dd"
        ) as unknown as Date,
        availableTo: format(new Date(), "yyyy-MM-dd") as unknown as Date,
      },
    });
  };

  if (isInitialLoading) return <Loader size="xs" />;

  return (
    <Popover
      width={300}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      {...popoverProps}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <form
          className="px-mantine-form"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <Text size="sm">Stop applications for this job posting?</Text>
          <Group mt="sm" grow>
            <Button size="xs" type="submit">
              Confirm
            </Button>
            <Button size="xs" type="reset" variant="default">
              Cancel
            </Button>
          </Group>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ApplicationJobExpire;
