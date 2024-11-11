import { Routes } from "@app/routes";
import { useForgotPasswordRequest } from "@features/auth/api/forgotPasswordRequest";
import ForgotPasswordForm from "@features/auth/components/ForgotPasswordForm";
import { FormForgotPasswordSchema } from "@features/auth/validators/ForgotPasswordSchema";
import { Anchor, Container, Paper, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function ForgotPassword() {
  const {
    isLoading,
    isSuccess,
    mutate: sendForgotPasswordRequest,
  } = useForgotPasswordRequest();

  const handleSubmit = async (
    values: z.infer<typeof FormForgotPasswordSchema>,
  ) => {
    const { email } = values;
    sendForgotPasswordRequest({ email });
  };

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Reset password</Title>
      <Paper withBorder shadow="md" p={30} my={30} radius="md">
        <p className="text-center">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password
        </p>
        <ForgotPasswordForm
          handleSubmit={handleSubmit}
          submitIsDisabled={isLoading || isSuccess}
          submitIsLoading={isLoading}
        />
      </Paper>
      <p className="text-center">
        Don&apos;t have an account?{" "}
        <Anchor component={Link} to={Routes.SignUp.path}>
          Sign Up
        </Anchor>
      </p>
    </Container>
  );
}
