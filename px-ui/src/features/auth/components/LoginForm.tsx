import { Routes } from "@app/routes";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import FormLoginSchema from "../validators/FormLoginSchema";

type LoginFormProps = {
  handleSubmit: (values: z.infer<typeof FormLoginSchema>) => void;
  submitIsLoading: boolean;
};

const LoginForm = ({ handleSubmit, submitIsLoading }: LoginFormProps) => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(FormLoginSchema),
  });

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
          to={Routes.ForgotPassRequest.path}
        >
          Forgot password?
        </Anchor>
      </Group>
      <Button type="submit" fullWidth mt="xl" loading={submitIsLoading}>
        Log in
      </Button>
    </form>
  );
};

export default LoginForm;
