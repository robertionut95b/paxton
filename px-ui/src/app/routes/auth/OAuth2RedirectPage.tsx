import { Routes } from "@app/routes";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Container, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Balancer from "react-wrap-balancer";
import { useReadLocalStorage, useTimeout } from "usehooks-ts";

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signInByToken } = useAuth();
  const from =
    useReadLocalStorage("redirUrl") ??
    location.state?.from?.pathname ??
    Routes.Feed.path;

  const triggerLogin = () => {
    const accessToken = searchParams.get("token");
    if (accessToken) {
      signInByToken(
        {
          token: accessToken,
        },
        () => navigate(from, { replace: true }),
      );
    }
  };

  useTimeout(triggerLogin, 1000);

  return (
    <Container className="flex h-screen" size="xs" py={40}>
      <Group className="m-auto" spacing="xs">
        <Paper p="md" shadow="xs">
          <Stack p="md" justify="center" align="center">
            <Loader variant="dots" size={"md"} />
            <Text size="sm">
              <Balancer>
                Please wait ... redirecting you back to the app
              </Balancer>
            </Text>
          </Stack>
        </Paper>
      </Group>
    </Container>
  );
};

export default OAuth2RedirectPage;
