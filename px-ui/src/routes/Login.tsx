import { useAuth } from "@auth/useAuth";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useIsMutating } from "@tanstack/react-query";
import FormLoginSchema from "@validator/FormLoginSchema";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signin } = useAuth();
  const isMutating = useIsMutating(["loginUser"]);

  const from = location.state?.from?.pathname || "/app";

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(FormLoginSchema),
  });

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  const handleSubmit = async (values: typeof form["values"]) => {
    const username = values.username;
    const password = values.password;
    form.setValues({
      username,
      password,
    });
    signin({ username, password }, () => navigate(from, { replace: true }));
  };

  if (user) return null;

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Welcome to Paxton</Title>
      <p className="text-center">
        Do not have an account yet?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            navigate("/app/signup");
          }}
        >
          Create account
        </Anchor>
      </p>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          className="px-mantine-form"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <TextInput
            label="Username"
            placeholder="johndoe"
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
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" />
            <Anchor<"a">
              onClick={(event) => {
                event.preventDefault();
                navigate("/app/forgot-password/request");
              }}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" loading={isMutating > 0}>
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
