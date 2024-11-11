import { useSignUpUser } from "@features/auth/api/signupUser";
import SignUpForm from "@features/auth/components/SignUpForm";
import FormSignupSchema from "@features/auth/validators/FormSignupSchema";
import { Anchor, Container, Paper, Title } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isLoading, isSuccess, mutate: signUpUser } = useSignUpUser(navigate);
  const handleSubmit = async (values: z.infer<typeof FormSignupSchema>) =>
    signUpUser(values);

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Register to Paxton</Title>
      <Paper withBorder shadow="md" p={30} my={26} radius="md">
        <SignUpForm
          handleSubmit={handleSubmit}
          submitIsDisabled={isSuccess}
          submitIsLoading={isLoading}
        />
      </Paper>
      <p className="text-center">
        Already have an account?{" "}
        <Anchor component={Link} to="/login">
          Log in
        </Anchor>
      </p>
    </Container>
  );
}
