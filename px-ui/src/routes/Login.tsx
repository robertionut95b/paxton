import { useAuth } from "@auth/useAuth";
import { APP_API_BASE_URL, APP_API_VERSION } from "@constants/Properties";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useIsMutating } from "@tanstack/react-query";
import FormLoginSchema from "@validator/FormLoginSchema";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signin } = useAuth();
  const isMutating = useIsMutating(["loginUser"]);
  const [from, setFrom] = useLocalStorage(
    "redirUrl",
    location.state?.from?.pathname ?? "/app"
  );

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(FormLoginSchema),
  });

  const handleSubmit = async (values: (typeof form)["values"]) => {
    const username = values.username;
    const password = values.password;
    form.setValues({
      username,
      password,
    });
    signin({ username, password }, () => navigate(from, { replace: true }));
  };

  useEffectOnce(() => {
    if (location.state?.from?.pathname) setFrom(location.state?.from?.pathname);
  });

  if (user) return null;

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Welcome to Paxton!</Title>
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
            <Anchor
              size="sm"
              component={NavLink}
              to={"/forgot-password/request"}
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" loading={isMutating > 0}>
            Log in
          </Button>
        </form>
        <Divider label="OR" labelPosition="center" my="sm" />
        <Group>
          <Anchor
            component={NavLink}
            to={`${APP_API_BASE_URL}/api/v${APP_API_VERSION}/auth/login/oauth2/github`}
          >
            <Button
              leftIcon={
                <Image
                  src={"/images/github-icon.svg"}
                  width={24}
                  color="white"
                />
              }
              loading={isMutating > 0}
              color="gray"
              variant="outline"
            >
              Continue with Github
            </Button>
          </Anchor>
          <Button
            leftIcon={
              <Image src={"/images/google-icon.svg"} width={20} color="white" />
            }
            loading={isMutating > 0}
            color="blue.7"
            variant="outline"
            disabled
          >
            Continue with Google
          </Button>
        </Group>
        <Text mt="sm" size="sm" className="text-center">
          Don&apos;t have an account yet?{" "}
          <Anchor component={NavLink} to="/signup">
            Sign up
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
