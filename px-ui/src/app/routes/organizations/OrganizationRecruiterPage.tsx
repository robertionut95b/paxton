import { Routes } from "@app/routes";
import { APP_API_BASE_URL } from "@config/Properties";
import { useGetRecruiterByIdQuery } from "@gql/generated";
import {
  AtSymbolIcon,
  CalendarDaysIcon,
  CogIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  BackgroundImage,
  Box,
  Divider,
  Drawer,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { differenceInYears } from "date-fns";
import { useCallback, useState } from "react";
import { When } from "react-if";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const OrganizationRecruiterPage = () => {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();
  const { recruiterId, organizationSlug } = useParams();

  const { data: recruiterData } = useGetRecruiterByIdQuery(
    graphqlRequestClient,
    {
      recruiterId: Number(recruiterId ?? 0),
    },
  );

  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
  }, [navigate]);

  if (!recruiterData?.getRecruiterById) {
    return (
      <Navigate
        to={Routes.Organizations.Details.Settings.Recruiters.buildPath({
          organizationSlug: organizationSlug as string,
        })}
      />
    );
  }

  const { firstName, lastName, email, userProfile, username, birthDate } =
    recruiterData.getRecruiterById.user;
  const { registeredAt } = recruiterData.getRecruiterById;

  return (
    <Drawer
      opened={opened}
      onClose={() => closeModal()}
      title="User information"
      position="right"
      size="xl"
      styles={{
        header: {
          padding: "15px",
          marginBottom: "0px",
          borderBottom: "1px solid silver",
        },
      }}
    >
      <Stack p="md" spacing={40}>
        <When condition={!!userProfile.userProfileBannerImage}>
          <BackgroundImage
            p="xs"
            radius="sm"
            src={
              userProfile.userProfileBannerImage
                ? `${APP_API_BASE_URL}/${userProfile.userProfileBannerImage.url}`
                : "/images/bg-profile.jpg"
            }
          >
            <Avatar
              radius="lg"
              size={100}
              src={`${APP_API_BASE_URL}/${userProfile.userProfileAvatarImage?.url}`}
              style={{ border: "2px solid white" }}
            >
              {username[0].toUpperCase()}
            </Avatar>
          </BackgroundImage>
        </When>
        <Stack spacing={"xs"}>
          <Box>
            <Title order={5} mb={0}>
              Basic information
            </Title>
            <Text size="sm" color="dimmed">
              Basic information about the user
            </Text>
            <Divider my="sm" />
          </Box>
          <Group noWrap>
            <TextInput
              label="First name"
              readOnly
              defaultValue={firstName}
              icon={<UserIcon width={16} />}
            />
            <TextInput
              label="Last name"
              readOnly
              defaultValue={lastName}
              icon={<UserIcon width={16} />}
            />
          </Group>
          {birthDate && (
            <NumberInput
              readOnly
              defaultValue={differenceInYears(new Date(), new Date(birthDate))}
            />
          )}
          <TextInput
            label="Email address"
            readOnly
            defaultValue={email}
            icon={<AtSymbolIcon width={16} />}
          />
          {registeredAt && (
            <Box>
              <DatePicker
                label="Joined organization"
                defaultValue={new Date(registeredAt)}
                readOnly
                icon={<CalendarDaysIcon width={16} />}
              />
            </Box>
          )}
        </Stack>
        <Stack spacing={"xs"}>
          <Box>
            <Title order={5}>Profile information</Title>
            <Text size="sm" color="dimmed">
              Profile information about the user
            </Text>
            <Divider my="sm" />
          </Box>
          <TextInput
            label="Current title"
            readOnly
            defaultValue={userProfile.profileTitle}
            icon={<CogIcon width={16} />}
          />
          {userProfile.description && (
            <Textarea
              label="Description"
              maxRows={9}
              autosize
              defaultValue={userProfile.description}
              icon={<DocumentTextIcon width={16} />}
            />
          )}
          {userProfile.city && (
            <TextInput
              label="Location"
              defaultValue={`${userProfile.city?.name}, ${userProfile.city?.country.name}`}
              icon={<MapPinIcon width={16} />}
            />
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default OrganizationRecruiterPage;
