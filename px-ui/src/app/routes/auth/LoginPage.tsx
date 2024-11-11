import { Routes } from "@app/routes";
import { APP_API_BASE_URL, APP_API_VERSION } from "@config/Properties";
import LoginForm from "@features/auth/components/LoginForm";
import { useAuth } from "@features/auth/hooks/useAuth";
import FormLoginSchema from "@features/auth/validators/FormLoginSchema";
import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();
  const isMutating = useIsMutating(["loginUser"]);
  const [from, setFrom] = useLocalStorage(
    "redirUrl",
    location.state?.from?.pathname ?? Routes.Feed.path,
  );

  const handleSubmit = async (values: z.infer<typeof FormLoginSchema>) => {
    const { username, password } = values;
    signIn({ username, password }, () => navigate(from, { replace: true }));
  };

  useEffect(() => {
    if (location.state?.from?.pathname) setFrom(location.state?.from?.pathname);
  }, [location.state?.from?.pathname, setFrom]);

  if (user) return Navigate({ to: Routes.Feed.path });

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Welcome to Paxton!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm
          handleSubmit={handleSubmit}
          submitIsLoading={isMutating > 0}
        />
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
