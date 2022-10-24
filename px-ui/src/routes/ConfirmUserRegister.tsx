import useConfirmRegisterUser from "@hooks/useConfirmRegisterUser";
import { Button, Container, Loader, Paper, Title } from "@mantine/core";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmUserRegister() {
  const [msg, setMsg] = useState<string>(
    "No valid registration was found for this link"
  );
  const [success, setSuccess] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLoading } = useConfirmRegisterUser(
    searchParams.get("token") || "",
    {
      onSuccess: () => {
        setMsg("Your account has been succesfully created, proceed to login");
        setSuccess(true);
        setTimeout(() => {
          navigate("/app/login", { replace: true });
        }, 2000);
      },
    }
  );

  if (isLoading) {
    return (
      <Container size={420} my={40}>
        <Loader />
      </Container>
    );
  }

  return (
    <Container size={420} my={40}>
      <Title align="center">
        {success !== true ? "Registration failed" : "Registration success"}
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <p className="text-center">{msg}</p>
        <Link to="/app/login">
          {success && (
            <Button type="button" fullWidth mt="xl">
              Log in
            </Button>
          )}
        </Link>
      </Paper>
    </Container>
  );
}
