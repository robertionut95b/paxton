import { Routes } from "@app/routes";
import { useConfirmSignupUser } from "@features/auth/api/confirmSignupUser";
import { Button, Container, Paper, Title } from "@mantine/core";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function SignupConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isError, error } = useConfirmSignupUser(
    searchParams.get("token") ?? "",
    navigate,
  );

  return (
    <Container size={420} my={40}>
      <Title align="center">
        {isError && "An error occured during signup"}
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <p className="text-center">{error?.message}</p>
        <Link to={Routes.Login.path}>
          {!isError && (
            <Button type="button" fullWidth mt="xl">
              Log in
            </Button>
          )}
        </Link>
      </Paper>
    </Container>
  );
}
