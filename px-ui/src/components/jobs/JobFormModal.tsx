import {
  FieldType,
  GetAllJobsPaginatedQuery,
  JobInputSchema,
  Operator,
  useGetAllJobsPaginatedQuery,
  usePublishJobMutation,
} from "@gql/generated";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Group, Modal, Text, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const JobFormModal = () => {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const queryFilters = {
    fieldType: FieldType.Long,
    key: "id",
    operator: Operator.Equal,
    value: jobId ?? "",
  };

  const prevJobQueryData = queryClient.getQueryData<GetAllJobsPaginatedQuery>(
    useGetAllJobsPaginatedQuery.getKey({
      searchQuery: { filters: [queryFilters] },
    })
  );

  const [desc, setDesc] = useState<string>(
    prevJobQueryData?.getAllJobsPaginated?.list?.[0]?.description ?? ""
  );

  const { data: jobData } = useGetAllJobsPaginatedQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [queryFilters],
      },
    },
    {
      enabled: !!jobId,
      onSuccess: (data) => {
        const jobElem = data.getAllJobsPaginated?.list?.[0];
        form.setValues({
          id: jobElem?.id ?? undefined,
          description: jobElem?.description ?? "",
          name: jobElem?.name ?? "",
        });
        setDesc(jobElem?.description ?? "");
      },
    }
  );

  const { mutate: publishJob } = usePublishJobMutation(graphqlRequestClient, {
    onSuccess: () => {
      showNotification({
        title: "Job update",
        message: "Successfully published base job update",
        autoClose: 5000,
        icon: <CheckCircleIcon width={20} />,
      });
      closeModal();
      queryClient.invalidateQueries(useGetAllJobsPaginatedQuery.getKey());
    },
    onError: (err: GraphqlApiResponse) => {
      showNotification({
        title: "Job update error",
        message: err.response.errors[0].message,
        autoClose: 5000,
        icon: <ExclamationTriangleIcon width={20} />,
      });
    },
  });

  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobItem = jobData?.getAllJobsPaginated?.list?.[0];

  const form = useForm({
    initialValues: {
      id: jobItem?.id ?? "",
      name: jobItem?.name ?? "",
      description: jobItem?.description ?? "",
    },
    validate: zodResolver(JobInputSchema()),
  });

  const changeDescCb = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(e.currentTarget.value);
      form.setFieldValue("description", e.currentTarget.value);
    },
    [form]
  );

  const handleSubmit = async (values: (typeof form)["values"]) => {
    publishJob({
      JobInput: {
        id: jobId ?? null,
        description: values.description,
        name: values.name,
      },
    });
  };

  return (
    <Modal
      title="Job"
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
            {desc.length}/250
          </Text>
        </Group>
        <Button type="submit" fullWidth mt="xl">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default JobFormModal;
