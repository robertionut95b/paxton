import { CheckIcon } from "@heroicons/react/24/outline";
import useRegisterUser from "@hooks/useRegisterUser";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import FormSignupSchema from "@validator/FormSignupSchema";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
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
  const navigate = useNavigate();

  const {
    mutate: registerUser,
    isLoading,
    isSuccess,
  } = useRegisterUser({
    onSuccess: () => {
      showNotification({
        title: "Successfully registered",
        message:
          "Before logging in, please check your e-mail inbox and follow the instructions from our message",
        autoClose: 3000,
        icon: <CheckIcon width={20} />,
      });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    },
  });

  const handleSubmit = async (values: (typeof form)["values"]) =>
    registerUser(values);

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Register to Paxton</Title>
      <Paper withBorder shadow="md" p={30} my={26} radius="md">
        <form
          className="px-mantine-form"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
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
            loading={isLoading}
            disabled={isSuccess}
          >
            Register
          </Button>
        </form>
      </Paper>
      <p className="text-center">
        Already have an account?{" "}
        <Anchor component={Link} to="/login">
          Log in
        </Anchor>
      </p>
    </Container>
  );
}
