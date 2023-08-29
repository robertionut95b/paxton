import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetConnectionInvitationsForUserQuery } from "@gql/generated";
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
import { NavLink } from "react-router-dom";
import Balancer from "react-wrap-balancer";
import Invitation from "./Invitation";

type InvitationItemData = NonNullable<
  NonNullable<
    NonNullable<
      GetConnectionInvitationsForUserQuery["getConnectionInvitationsForUser"]
    >["list"]
  >[number]
>;

type InvitationListProps = {
  invitations: NonNullable<
    NonNullable<
      GetConnectionInvitationsForUserQuery["getConnectionInvitationsForUser"]
    >["list"]
  >;
  onAcceptInvitation: (data: InvitationItemData) => void;
  onDeclineInvitation: (data: InvitationItemData) => void;
};

const InvitationsList = ({
  invitations,
  onAcceptInvitation,
  onDeclineInvitation,
}: InvitationListProps) => {
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
        if={invitations.length > 0}
        else={
          <Center>
            <Stack align="center">
              <Image src="/images/user-social.svg" width={102} height={102} />
              <Balancer>
                <Text size="sm" align="center">
                  No connection requests were found. Review some suggestions
                  based on your profile
                </Text>
              </Balancer>
              <Button>Follow or add users</Button>
            </Stack>
          </Center>
        }
      >
        <Stack>
          {invitations.map(
            (i) =>
              i && (
                <div key={i.id}>
                  <Invitation
                    data={i}
                    onAccept={onAcceptInvitation}
                    onDecline={onDeclineInvitation}
                  />
                </div>
              )
          )}
        </Stack>
      </ShowIfElse>
    </Stack>
  );
};

export default InvitationsList;
