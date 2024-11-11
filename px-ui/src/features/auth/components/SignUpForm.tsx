import FormSignupSchema from "@features/auth/validators/FormSignupSchema";
import { Button, PasswordInput, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

type SignUpFormProps = {
  handleSubmit: (values: z.infer<typeof FormSignupSchema>) => void;
  submitIsLoading: boolean;
  submitIsDisabled: boolean;
};

const SignUpForm = ({
  handleSubmit,
  submitIsDisabled,
  submitIsLoading,
}: SignUpFormProps) => {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(FormSignupSchema),
  });
  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Title order={4}>Personal information</Title>
      <TextInput
        label="First name"
        placeholder="John"
        description="In order for others to recognize you, we need some personal details"
        mt="md"
        withAsterisk
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Last name"
        placeholder="Doe"
        description="Your last name is just as important as your surname"
        mt="md"
        withAsterisk
        {...form.getInputProps("lastName")}
      />
      <TextInput
        label="Email"
        placeholder="johndoe@example.org"
        mt="md"
        description="We will never use your e-mail address for any other scopes than security-wise"
        withAsterisk
        {...form.getInputProps("email")}
      />
      <Title mt="lg" order={4}>
        Security details
      </Title>
      <TextInput
        label="Username"
        placeholder="johndoe"
        description="This is your primary login information, mark it down!"
        mt="md"
        withAsterisk
        {...form.getInputProps("username")}
      />
      <PasswordInput
        label="Password"
        placeholder="secret"
        mt="md"
        withAsterisk
        {...form.getInputProps("password")}
      />
      <PasswordInput
        label="Confirm password"
        placeholder="same secret"
        mt="md"
        withAsterisk
        {...form.getInputProps("confirmPassword")}
      />
      <Button
        type="submit"
        fullWidth
        mt="xl"
        loading={submitIsLoading}
        disabled={submitIsDisabled}
      >
        Register
      </Button>
    </form>
  );
};

export default SignUpForm;
