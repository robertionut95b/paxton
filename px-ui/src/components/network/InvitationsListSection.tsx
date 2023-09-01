import ShowIfElse from "@components/visibility/ShowIfElse";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Balancer from "react-wrap-balancer";
import UserInvitation from "./UserInvitation";

type InvitationListProps = {
  length: number;
  children?: ReactNode;
};

const InvitationsListSection = ({ length, children }: InvitationListProps) => {
  const [parent] = useAutoAnimate();
  return (
    <Stack>
      <Group position="apart">
        <Title order={5} weight="normal">
          Connection requests
        </Title>
        <ActionIcon
          component={NavLink}
          to="manage-invitations"
          title="Administer invitations"
        >
          <Cog6ToothIcon width={24} />
        </ActionIcon>
      </Group>
      <ShowIfElse
        if={length > 0}
        else={
          <Center>
            <Stack align="center">
              <Image src="/images/user-social.svg" width={86} height={86} />
              <Balancer>
                <Text size="sm" align="center">
                  No connection requests found
                </Text>
              </Balancer>
              <Button variant="outline">Follow or add users</Button>
            </Stack>
          </Center>
        }
      >
        <Stack ref={parent}>{children}</Stack>
      </ShowIfElse>
    </Stack>
  );
};

const InvitationsListSectionItem = (
  props: React.ComponentProps<typeof UserInvitation>
) => {
  return <UserInvitation {...props} />;
};

InvitationsListSection.Item = InvitationsListSectionItem;

export default InvitationsListSection;
