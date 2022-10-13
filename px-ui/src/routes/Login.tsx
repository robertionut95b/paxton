import useLoginUser from "@hooks/useLoginUser";
import api from "@lib/axiosClient";
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
import FormLoginSchema from "@validator/FormLoginSchema";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useLoginUser();

  const signUser = useMutation(async (body) => {
    const resp = await api.post("/auth/token", {
      ...body,
    });
    return resp.data;
  });

  useEffect(() => {
    api.get("/").then((resp) => console.log(resp));
  }, []);

  const from = location.state?.from?.pathname || "/";

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(FormLoginSchema),
  });

  const handleSubmit = async (values: typeof form["values"]) => {
    const username = values.username;
    const password = values.password;

    signUser.mutate({ username, password });

    // auth.signin(username, () => {
    //   // Send them back to the page they tried to visit when they were
    //   // redirected to the login page. Use { replace: true } so we don't create
    //   // another entry in the history stack for the login page.  This means that
    //   // when they get to the protected page and click the back button, they
    //   // won't end up back on the login page, which is also really nice for the
    //   // user experience.
    //   navigate(from, { replace: true });
    // });
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Welcome to Paxton</Title>
      <p className="text-center">
        Do not have an account yet?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => event.preventDefault()}
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
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
