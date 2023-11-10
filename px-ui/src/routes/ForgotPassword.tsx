import { EnvelopeIcon } from "@heroicons/react/24/outline";
import useForgotPasswordRequest from "@hooks/useForgotPasswordReq";
import {
  Anchor,
  Button,
  Container,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function ForgotPassword() {
  const [blockButton, setBlockButton] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: zodResolver(
      z.object({
        email: z
          .string()
          .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid e-mail format")
          .min(1, { message: "Email must be filled" }),
      }),
    ),
  });

  const { isLoading, mutate: recover } = useForgotPasswordRequest({
    onSuccess: () => {
      setBlockButton(true);
      showNotification({
        title: "An email was sent",
        message:
          "Please check your inbox and follow the instructions from our message",
        autoClose: 5000,
        icon: <EnvelopeIcon width={20} />,
      });
    },
    onError: (err) => {
      setBlockButton(true);
      if (err?.response?.status === 404) {
        showNotification({
          title: "E-mail was not found",
          message: "We cannot find the required e-mail address",
          autoClose: 5000,
          icon: <EnvelopeIcon width={20} />,
        });
      } else if (
        err?.response?.status === 400 &&
        // @ts-expect-error("types-error")
        err?.response?.data?.message ===
          "Valid token already exists for this user"
      ) {
        showNotification({
          title: "An e-mail was sent already",
          message: "Please check your inbox, an e-mail was sent already to you",
          autoClose: 5000,
          icon: <EnvelopeIcon width={20} />,
        });
      }
    },
  });

  const handleSubmit = async (values: (typeof form)["values"]) => {
    const email = values.email;
    recover({ email });
  };

  return (
    <Container size={"xs"} py={40}>
      <Title align="center">Reset password</Title>
      <Paper withBorder shadow="md" p={30} my={30} radius="md">
        <p className="text-center">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password
        </p>
        <form
          className="px-mantine-form mt-4"
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <TextInput
            label="Email"
            placeholder="johndoe@example.org"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <Button
            type="submit"
            fullWidth
            mt="xl"
            loading={isLoading}
            disabled={blockButton}
          >
            Continue
          </Button>
        </form>
      </Paper>
      <p className="text-center">
        Don&apos;t have an account?{" "}
        <Anchor component={Link} to="/signup">
          Sign Up
        </Anchor>
      </p>
    </Container>
  );
}
