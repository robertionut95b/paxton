import {
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import useResetPassword from "@hooks/useResetPassword";
import {
  Anchor,
  Button,
  Container,
  Divider,
  List,
  Paper,
  PasswordInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import FormResetPasswordSchema from "@validator/FormResetPasswordSchema";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ForgotPasswordReset() {
  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zodResolver(FormResetPasswordSchema),
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLoading, mutate: reset } = useResetPassword({
    onSuccess: () => {
      showNotification({
        title: "Password was changed",
        message: "Successfully changed your password, you may proceed to login",
        autoClose: 5000,
        icon: <EnvelopeIcon width={20} />,
      });
      setTimeout(() => {
        navigate("/app/login", { replace: true });
      }, 6000);
    },
    onError: () => {
      showNotification({
        title: "Something went wrong",
        message:
          "Unfortunately we could not change your password, please try again later",
        autoClose: 5000,
        icon: <ExclamationTriangleIcon width={20} />,
      });
    },
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;
    reset({
      newPassword,
      confirmPassword,
      token: searchParams.get("token") || "",
    });
  };

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Reset password</Title>
      <Paper withBorder shadow="md" p={30} my={30} radius="md">
        <p className="text-center">
          Enter a new password combination. Make sure it follows:
          <Divider my="sm" variant="dashed" />
        </p>
        <List size={14} spacing={6} listStyleType={"initial"}>
          <List.Item>Is longer than 8 characters</List.Item>
          <List.Item>
            Does not match or significantly contains your username, e.g. do not
            use &apos;username123&apos;
          </List.Item>
          <List.Item>At least one uppercase character</List.Item>
          <List.Item>At least one numerical character</List.Item>
          <List.Item>At least one special character</List.Item>
        </List>
        <form
          className="px-mantine-form mt-4"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <PasswordInput
            label="New password"
            placeholder="secret"
            withAsterisk
            {...form.getInputProps("newPassword")}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="secret"
            mt={10}
            withAsterisk
            {...form.getInputProps("confirmPassword")}
          />
          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Continue
          </Button>
        </form>
      </Paper>
      <p className="text-center">
        Already have an account?{" "}
        <Anchor component={Link} to="/app/login">
          Log in
        </Anchor>
      </p>
    </Container>
  );
}
