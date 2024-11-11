import NotFoundPage from "@app/routes/NotFoundPage";
import AlterStepModal from "@features/recruitment-process/components/AlterStepModal";
import {
  FieldType,
  GetAllProcessesQuery,
  GetAllStepsQuery,
  Operator,
  ProcessInputCreateSchema,
  ProcessSteps,
  ProcessStepsInputCreateSchema,
  Status,
  Step,
  StepInputSchema,
  useCreateStepMutation,
  useGetAllProcessesQuery,
  useGetAllStepsQuery,
  useGetOrganizationBySlugNameQuery,
  useUpdateProcessForOrganizationIdMutation,
} from "@gql/generated";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  JsonInput,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Timeline,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import compose from "lodash/fp/compose";
import differenceWith from "lodash/fp/differenceWith";
import isEmpty from "lodash/fp/isEmpty";
import isEqual from "lodash/fp/isEqual";
import map from "lodash/fp/map";
import React, { useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { NavLink, useParams } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";
import { z } from "zod";

const addAfter = <T,>(array: T[], index: number, newItem: T) => {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
};

const isArrayEqual = <T,>(x: T[], y: T[]): boolean => {
  return isEmpty(compose(map(x), differenceWith(isEqual, y))(x, y));
};

type StepProps = (z.infer<ReturnType<typeof ProcessStepsInputCreateSchema>> &
  Omit<ProcessSteps, "process">) & { newVal?: boolean };

const OrganizationProcessPage = () => {
  const { isDarkMode } = useDarkMode();
  const [openedModal, setOpenedModal] = useState(false);
  const [order, setOrder] = useState<number>(1);
  const { organizationSlug } = useParams();
  const queryClient = useQueryClient();
  const [showWarn, setShowWarn] = useState<boolean>(true);

  const { data: organizationData, isLoading: isOrgLoading } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        onSuccess: (data) => {
          form.setFieldValue(
            "organizationId",
            data?.getOrganizationBySlugName?.id ?? 0,
          );
        },
      },
    );
  const { data: processData, isLoading: isProcLoading } =
    useGetAllProcessesQuery(
      graphqlRequestClient,
      {
        searchQuery: {
          filters: [
            {
              key: "id",
              fieldType: FieldType.Long,
              operator: Operator.Equal,
              value:
                organizationData?.getOrganizationBySlugName?.recruitmentProcess.id.toString() ??
                "",
            },
          ],
        },
      },
      {
        enabled:
          !!organizationData?.getOrganizationBySlugName?.recruitmentProcess.id,
        onSuccess: (data) => {
          const process = data.getAllProcesses?.list?.[0];
          const processSteps = process?.processSteps;
          if (processSteps) {
            setUpdPs(
              // @ts-expect-error("types-to-fix")
              processSteps.map((ps) => ({
                ...ps,
                id: ps?.id ?? 0,
                stepId: ps?.step.id ?? 0,
                order: ps?.order ?? 1,
                status: ps?.status as Status,
                step: ps?.step as Step,
              })),
            );
          }
          form.setValues({
            id: process?.id,
            name: process?.name,
            description: process?.description,
          });
        },
      },
    );
  const { data: stepsData, isLoading: isStepsLoading } = useGetAllStepsQuery(
    graphqlRequestClient,
    undefined,
    {
      onError: (err: GraphqlApiResponse) => {
        if (err.response.errors) {
          showNotification({
            title: "Steps loading error",
            message: "Unknown error occurred while loading process steps data",
            autoClose: 5000,
            icon: <ExclamationTriangleIcon width={20} />,
          });
        }
      },
    },
  );

  const prevProcessData = queryClient.getQueryData<GetAllProcessesQuery>(
    // eslint-disable-next-line react-compiler/react-compiler
    useGetAllProcessesQuery.getKey({
      searchQuery: {
        filters: [
          {
            key: "id",
            fieldType: FieldType.Long,
            operator: Operator.Equal,
            value:
              organizationData?.getOrganizationBySlugName?.recruitmentProcess.id.toString() ??
              "",
          },
        ],
      },
    }),
  );

  const [updPs, setUpdPs] = useState<StepProps[]>(
    (prevProcessData?.getAllProcesses?.list?.[0]
      ?.processSteps as StepProps[]) ?? [],
  );

  const stepsSelectionData = useMemo(
    () =>
      stepsData?.getAllSteps?.map((ps) => ({
        value: ps?.id.toString() ?? "",
        label: ps?.title ?? "unknown",
        description: ps?.description ?? "unknown",
      })) ?? [],
    [stepsData],
  );

  const { mutate: updateProcess } = useUpdateProcessForOrganizationIdMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        showNotification({
          title: "Recruitment process updated",
          message: "Successfully updated recruitment process information",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        if (data.updateProcessForOrganizationId) {
          const ps = data.updateProcessForOrganizationId.processSteps;
          queryClient.setQueryData<GetAllProcessesQuery>(
            useGetAllProcessesQuery.getKey({
              searchQuery: {
                filters: [
                  {
                    key: "id",
                    fieldType: FieldType.Long,
                    operator: Operator.Equal,
                    value:
                      organizationData?.getOrganizationBySlugName?.recruitmentProcess.id.toString(),
                  },
                ],
              },
            }),
            // @ts-expect-error(types-check)
            (prev) =>
              prev
                ? {
                    ...prev,
                    getAllProcesses: {
                      ...prev.getAllProcesses,
                      list: [
                        {
                          ...prev.getAllProcesses?.list?.[0],
                          processSteps: ps,
                        },
                      ],
                    },
                  }
                : prev,
          );
        }
      },
    },
  );

  const { mutateAsync: addStep } = useCreateStepMutation(graphqlRequestClient, {
    onSuccess: (data) => {
      if (data.createStep) {
        queryClient.setQueryData<GetAllStepsQuery>(
          useGetAllStepsQuery.getKey(),
          (prev) =>
            prev
              ? // @ts-expect-error(types-erro)
                { ...prev, getAllSteps: [...prev.getAllSteps, data.createStep] }
              : prev,
        );
        return showNotification({
          title: "Steps update",
          message: "Successfully created new step",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      }
    },
    onError: (err: GraphqlApiResponse) => {
      if (err.response.errors) {
        showNotification({
          title: "Steps update error",
          message: "Unknown error occurred while creating step",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      }
    },
  });

  const form = useForm({
    initialValues: {
      id: processData?.getAllProcesses?.list?.[0]?.id ?? 0,
      name: processData?.getAllProcesses?.list?.[0]?.name ?? "",
      description: processData?.getAllProcesses?.list?.[0]?.description ?? "",
      organizationId: organizationData?.getOrganizationBySlugName?.id ?? 0,
      processSteps:
        (updPs as z.infer<
          ReturnType<typeof ProcessStepsInputCreateSchema>
        >[]) ?? [],
    },
    validate: zodResolver(ProcessInputCreateSchema()),
  });

  const onSubmitModal = (
    values: z.infer<ReturnType<typeof ProcessStepsInputCreateSchema>>,
  ) => {
    const order = values.order;
    const step = stepsData?.getAllSteps?.filter(
      (s) => s?.id === values.stepId,
    )?.[0];

    setUpdPs((prev) =>
      addAfter(prev, order, {
        id: Math.random(),
        status: values.status,
        order: values.order,
        stepId: values.stepId,
        newVal: true,
        // @ts-expect-error("types-to-fix")
        step: {
          ...(step as NonNullable<typeof step>),
        },
      })
        .sort((a, b) => a.order - b.order)
        .map((p, idx) => ({ ...p, order: idx + 1 })),
    );
    setOpenedModal(false);
  };

  const deleteItem = (ps: (typeof updPs)[number]) => {
    if (updPs.length < 3) {
      showNotification({
        title: "Steps update",
        message:
          "Cannot have a process with less than two steps: a starting and end step",
        autoClose: 5000,
        icon: <ExclamationTriangleIcon width={20} />,
      });
      return;
    }
    setUpdPs((prev) =>
      prev
        .filter((sp) => sp.id !== ps.id)
        .sort((a, b) => a.order - b.order)
        .map((sp, idx) => ({ ...sp, order: idx + 1 })),
    );
  };

  const onSubmitForm = (values: (typeof form)["values"]) => {
    const initialSteps = (
      processData?.getAllProcesses?.list?.[0]?.processSteps ?? []
    ).map((u) => {
      if (u) {
        const { step, id, ...rest } = u;
        return { ...rest, stepId: step.id };
      }
    });
    const inputSteps = values.processSteps.map((iu) => {
      const { id, step, ...rest } = iu as StepProps;
      return rest;
    });

    if (isArrayEqual(initialSteps, inputSteps)) {
      return showNotification({
        title: "Process update error",
        message: "There is nothing to change",
        autoClose: 5000,
        icon: <ExclamationTriangleIcon width={20} />,
      });
    }

    const input = {
      ...values,
      processSteps: inputSteps.map((ps) => {
        const { newVal, ...rest } = ps as StepProps;
        return rest;
      }),
    };

    const { id, ...restInput } = input;

    updateProcess({
      organizationId: organizationData?.getOrganizationBySlugName?.id ?? 0,
      processInput: restInput,
    });
  };

  const onSubmitModalCreate = async (
    values: z.infer<ReturnType<typeof StepInputSchema>> & { order: number },
  ) => {
    const order = values.order;
    const step = await addStep({
      stepInput: {
        description: values.description,
        title: values.title,
      },
    });
    if (step.createStep) {
      setUpdPs((prev) =>
        addAfter(prev, order, {
          id: Math.random(),
          status: Status.Active,
          order: values.order,
          stepId: step.createStep?.id ?? 0,
          newVal: true,
          // @ts-expect-error("types-to-fix")
          step: {
            ...(step.createStep as NonNullable<(typeof step)["createStep"]>),
          },
        })
          .sort((a, b) => a.order - b.order)
          .map((p, idx) => ({ ...p, order: idx + 1 })),
      );
      setOpenedModal(false);
    }
  };

  useEffect(
    () =>
      form.setFieldValue(
        "processSteps",
        updPs.map((u) => {
          const { step, ...rest } = u;
          return { ...rest, stepId: u.step.id };
        }),
      ),

    [updPs],
  );

  if (isOrgLoading || isProcLoading || isStepsLoading)
    return (
      <Paper p="md" shadow="xs">
        <Center>
          <Loader size="sm" variant="dots" />
        </Center>
      </Paper>
    );

  if (
    !processData?.getAllProcesses ||
    processData?.getAllProcesses?.totalElements === 0
  )
    return (
      <Paper p="md" shadow="xs">
        <Stack spacing={5}>
          <Title order={5}>No process found</Title>
          <Text size="sm">
            Define a recruitment process for this organization
          </Text>
          <Anchor component={NavLink} to="new" mt="sm">
            <Button variant="filled">Create process</Button>
          </Anchor>
        </Stack>
      </Paper>
    );

  if (!organizationData?.getOrganizationBySlugName)
    return (
      <Paper p="md" shadow="xs">
        <NotFoundPage />
      </Paper>
    );

  const organization = organizationData.getOrganizationBySlugName;
  const process =
    prevProcessData?.getAllProcesses?.list?.[0] ??
    processData.getAllProcesses?.list?.[0];

  return (
    <React.Fragment>
      <Paper p="md" shadow="xs">
        <Stack spacing="lg">
          <Flex gap={4} direction="column">
            <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}>
              <Box>
                <Title order={5}>Recruitment process</Title>
                <Text size="sm" color="dimmed">
                  The workflow of every recruitment application for this
                  organization
                </Text>
                <Divider my="sm" />
              </Box>
              <Group spacing={5}>
                {organization.photography && (
                  <Avatar size="md" src={organization.photography} />
                )}
                <Text size="sm" weight="bold" ml="xs">
                  {organization.name}
                </Text>
              </Group>
              <TextInput
                label="Process name"
                mt="xs"
                size="sm"
                withAsterisk
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Process description"
                mt="xs"
                size="sm"
                withAsterisk
                {...form.getInputProps("description")}
              />
              <TextInput
                className="hidden"
                {...form.getInputProps("organizationId")}
              />
              <JsonInput
                className="hidden"
                {...form.getInputProps("processSteps")}
              />
              <When condition={showWarn}>
                <Alert
                  icon={<ExclamationTriangleIcon width={24} />}
                  title="Important"
                  color="orange"
                  withCloseButton
                  mt="xs"
                  onClose={() => setShowWarn(false)}
                >
                  <Text size="sm">
                    Any changes to the recruitment process will revert existing
                    user applications to the new starting step.
                  </Text>
                </Alert>
              </When>
              <Button type="submit" mt="sm" fullWidth>
                Submit changes
              </Button>
            </form>
          </Flex>
          {process && (
            <Stack spacing={"xs"}>
              <Divider />
              <Title order={6} mb={0}>
                Process builder
              </Title>
              <Button
                onClick={() => {
                  setOrder(0);
                  setOpenedModal(true);
                }}
                variant="light"
              >
                Add start step
              </Button>
              <Timeline active={updPs.length} bulletSize={20} lineWidth={3}>
                {updPs.map(
                  (ps) =>
                    ps && (
                      <Timeline.Item
                        className="p-1"
                        key={crypto.randomUUID()}
                        title={ps.step.title}
                        bg={
                          !isDarkMode
                            ? ps.newVal
                              ? "green.0"
                              : "transparent"
                            : ps.newVal
                              ? "#113514"
                              : "transparent"
                        }
                        mt={0}
                      >
                        <Text color="dimmed" size="sm">
                          {ps.step.description}
                        </Text>
                        <Group mt="xs" spacing={2}>
                          <ActionIcon
                            variant="light"
                            color="violet"
                            onClick={() => {
                              setOrder(ps.order);
                              setOpenedModal(true);
                            }}
                          >
                            <PlusIcon width={20} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="violet"
                            onClick={() => deleteItem(ps)}
                          >
                            <XMarkIcon width={20} />
                          </ActionIcon>
                        </Group>
                      </Timeline.Item>
                    ),
                )}
              </Timeline>
              <Button
                onClick={() => {
                  setOrder(updPs.length + 1);
                  setOpenedModal(true);
                }}
                variant="light"
              >
                Add end step
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
      <AlterStepModal
        open={openedModal}
        setOpen={setOpenedModal}
        order={order}
        stepsData={stepsSelectionData}
        onSubmitModal={onSubmitModal}
        onSubmitCreateModal={onSubmitModalCreate}
        initialValues={{
          processId: process?.id ?? 0,
          status: Status.Active,
          order: order,
          stepId: 0,
        }}
      />
    </React.Fragment>
  );
};

export default OrganizationProcessPage;
