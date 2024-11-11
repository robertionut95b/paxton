import { FormForgotPasswordSchema } from "@features/auth/validators/ForgotPasswordSchema";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

type ForgotPasswordFormProps = {
  handleSubmit: (values: z.infer<typeof FormForgotPasswordSchema>) => void;
  submitIsLoading: boolean;
  submitIsDisabled: boolean;
};

const ForgotPasswordForm = ({
  handleSubmit,
  submitIsLoading,
  submitIsDisabled,
}: ForgotPasswordFormProps) => {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: zodResolver(FormForgotPasswordSchema),
  });

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <TextInput
        mt="xs"
        label="Email"
        placeholder="johndoe@example.org"
        withAsterisk
        {...form.getInputProps("email")}
      />
      <Button
        type="submit"
        fullWidth
        mt="xl"
        loading={submitIsLoading}
        disabled={submitIsDisabled}
      >
        Send email
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
