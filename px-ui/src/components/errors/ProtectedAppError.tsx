import { Box, Center, Image, Space, Stack, Text, Title } from "@mantine/core";
import { AuthState } from "react-oidc-context";

const ProtectedAppError = ({ error }: { error: AuthState["error"] }) => {
  console.error(error);
  return (
    <Center>
      <Stack spacing={"xs"}>
        <Image src={"images/error-broken.svg"} alt="broken" />
        <Title align="center">Something is wrong here ...</Title>
        <Stack mt="xs" align="center" spacing={"md"}>
          <Box>
            <Text align="center">
              Sorry, we&apos;re having issues when contacting the authentication
              server
            </Text>
            <Space h={"xl"} />
            <Text align="center">
              If this issue persists, contact our administrative team
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Center>
  );
};

export default ProtectedAppError;
