import AccessDenied from "@components/errors/AccessDenied";
import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouteError } from "react-router-dom";

interface ErrorProps {
  statusText: string;
  message: string;
}

export default function ErrorPage() {
  const error = useRouteError();
  const errors = error as ErrorProps;

  console.error(errors.statusText, errors.message);

  if (errors.message === "Access denied") return <AccessDenied />;

  return (
    <Center>
      <Stack spacing={"xs"}>
        <Image src={"images/error-broken.svg"} alt="broken" />
        <Title align="center">Something is wrong here ...</Title>
        <Stack mt="xs" align="center" spacing={"md"}>
          <Box>
            <Text align="center">
              Sorry, we&apos;re having some technical issues
            </Text>
            <Text align="center">Try one of the options</Text>
          </Box>
          <Group>
            <Button
              onClick={() => window.location.assign(window.location.origin)}
              mt={"xs"}
            >
              Refresh
            </Button>
            <Button onClick={() => window.location.assign("/")} mt={"xs"}>
              Go home
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Center>
  );
}
