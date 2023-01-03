import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function AccessDenied() {
  return (
    <Container p={0}>
      <Paper shadow={"xs"} p="md" className="px-acess-denied">
        <Stack align="center" spacing={4}>
          <ActionIcon color={"red.8"} size={56}>
            <ShieldExclamationIcon />
          </ActionIcon>
          <Title order={5} color="red.9">
            Access Denied
          </Title>
          <Text>You are not allowed to access this resource</Text>
          <Text size="sm" color="dimmed">
            Insufficient roles or permissions
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
