import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ExpandableText from "@components/visibility/ExpandableText";
import { useGetOrganizationByIdQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Avatar, Container, Group, Modal, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrganizationDetailsPage() {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { organizationId } = useParams();

  const { data: organization, isLoading } = useGetOrganizationByIdQuery(
    graphqlRequestClient,
    {
      organizationId: organizationId as string,
    },
    {
      enabled: !!organizationId,
    }
  );

  const organizationItem = organization?.getOrganizationById;

  const closeModal = () => {
    navigate(-1);
    setOpened(false);
  };

  if (isLoading) return <ApplicationSpinner />;

  return (
    <Modal
      title={"Organization details"}
      opened={opened}
      onClose={closeModal}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      size={620}
    >
      <Container className="flex flex-col gap-6" px={0}>
        <Group>
          <Avatar src={organizationItem?.photography}>
            {organizationItem?.name}
          </Avatar>
          <Title order={5}>{organizationItem?.name}</Title>
        </Group>
        <Group spacing={"xs"}>
          <Text size={"sm"}>{organizationItem?.industry}</Text> -{" "}
          <Text size={"sm"}>N employees</Text>
        </Group>
        <Group>
          <ExpandableText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
            ornare velit, sit amet ornare nunc. Nulla sit amet mattis ante. Cras
            imperdiet rhoncus lectus eget egestas. Nulla at purus tristique,
            scelerisque sapien a, pellentesque est. Aliquam molestie nunc
            condimentum risus sodales pretium. Vestibulum rutrum neque sed elit
            tincidunt hendrerit. Nam finibus urna eget mauris vestibulum, quis
            sagittis risus tempus. Praesent pulvinar tortor faucibus commodo
            vulputate. Ut maximus ipsum nec lacus facilisis tempor. Fusce
            placerat justo efficitur massa condimentum, et feugiat turpis
            aliquet. Maecenas id dictum dui. Praesent malesuada, nunc eget
            convallis scelerisque, justo ex venenatis lorem, sed dignissim ante
            magna id ligula. In ut lorem nec magna commodo porttitor. Sed
            consectetur dui est, quis auctor enim finibus cursus. Quisque
            sodales pulvinar dui vitae mattis.
          </ExpandableText>
        </Group>
      </Container>
    </Modal>
  );
}
