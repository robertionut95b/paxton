import { SelectItem } from "@components/select-items/SelectItem";
import {
  ProcessStepsInputSchema,
  Status,
  StepInputSchema,
} from "@gql/generated";
import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { z } from "zod";

type InputValuesProps = z.infer<ReturnType<typeof ProcessStepsInputSchema>>;

type InputValuesCreateProps = z.infer<ReturnType<typeof StepInputSchema>>;

type AlterStepModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  order: number;
  stepsData: {
    value: string;
    label: string;
    description: string;
  }[];
  onSubmitModal: (values: InputValuesProps) => void;
  onSubmitCreateModal: (
    values: InputValuesCreateProps & { order: number }
  ) => void;
  initialValues?: InputValuesProps;
};

const AlterStepModal = ({
  open: openedModal,
  setOpen: setOpenedModal,
  order,
  stepsData,
  onSubmitModal,
  onSubmitCreateModal,
  initialValues = {
    order: order,
    processId: 0,
    status: Status.Active,
    stepId: 0,
  },
}: AlterStepModalProps) => {
  const form = useForm({
    initialValues: {
      ...initialValues,
      order: order,
    },
    validate: zodResolver(
      ProcessStepsInputSchema().extend({
        stepId: z.coerce.number(),
      })
    ),
    transformValues: (values) => ({
      ...values,
      stepId: Number(values.stepId),
    }),
  });

  const formCreate = useForm({
    initialValues: {
      title: "",
      description: "",
      order: order,
    },
    validate: zodResolver(
      StepInputSchema().extend({ order: z.number().min(0).max(20) })
    ),
  });

  useEffect(() => {
    form.setFieldValue("order", order);
    formCreate.setFieldValue("order", order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  return (
    <Modal
      opened={openedModal}
      onClose={() => setOpenedModal(false)}
      title="Change recruitment process"
    >
      <form onSubmit={form.onSubmit((values) => onSubmitModal(values))}>
        <Text size="sm">
          Select a step from the existing ones or create a new one, depending on
          your business use-case.
        </Text>
        <Alert title="Notice" color="red" mt="sm">
          Make sure your process has a minimum of two steps: the starting point
          and an ending step.
        </Alert>
        <Select
          label="Process step"
          placeholder="Select step"
          description="One of the current states of the recruitment process in time"
          data={stepsData}
          itemComponent={SelectItem}
          withAsterisk
          mt="sm"
          defaultValue={String(initialValues.stepId)}
          {...form.getInputProps("stepId")}
        />
        <NumberInput
          label="Order"
          description="The order of the step in the process"
          withAsterisk
          readOnly
          min={0}
          max={20}
          mt="sm"
          defaultValue={order}
          {...form.getInputProps("order")}
        />
        <TextInput
          className="hidden"
          label="Status"
          description="Process steps are marked as Active by default"
          readOnly
          withAsterisk
          mt="sm"
          {...form.getInputProps("status")}
        />
        <TextInput
          label="Process"
          readOnly
          withAsterisk
          className="hidden"
          mt="sm"
          {...form.getInputProps("processId")}
        />
        <Group grow>
          <Button
            type="reset"
            mt="lg"
            onClick={() => setOpenedModal(false)}
            variant="default"
          >
            Cancel
          </Button>
          <Button type="submit" mt="lg" disabled={!form.isValid()}>
            Submit
          </Button>
        </Group>
      </form>
      <Divider my="md" label={"OR NEW"} labelPosition="center" />
      <form
        onSubmit={formCreate.onSubmit((values) => onSubmitCreateModal(values))}
      >
        <TextInput
          label="Name"
          description="A headline for this step"
          withAsterisk
          mt="sm"
          {...formCreate.getInputProps("title")}
        />
        <Textarea
          label="Description"
          description="A short description for this step"
          withAsterisk
          autosize
          mt="sm"
          {...formCreate.getInputProps("description")}
        />
        <NumberInput
          label="Order"
          description="The order of the step in the process"
          withAsterisk
          readOnly
          min={0}
          max={20}
          mt="sm"
          defaultValue={order}
          {...formCreate.getInputProps("order")}
        />
        <Group grow>
          <Button
            type="reset"
            mt="lg"
            onClick={() => setOpenedModal(false)}
            variant="default"
          >
            Cancel
          </Button>
          <Button type="submit" mt="lg" disabled={!formCreate.isValid()}>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AlterStepModal;
