import { useAuth } from "@auth/useAuth";
import { Button, Center, Group } from "@mantine/core";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signInByToken } = useAuth();

  const from = location.state?.from?.pathname || "/app";

  const triggerLogin = () => {
    const accessToken = searchParams.get("token");
    if (accessToken) {
      signInByToken(
        {
          token: accessToken,
        },
        () => navigate(from, { replace: true })
      );
    }
  };

  return (
    <Center>
      <Group spacing="xs">
        <Button onClick={triggerLogin}>Go back to Paxton</Button>
      </Group>
    </Center>
  );
};

export default OAuth2RedirectPage;
