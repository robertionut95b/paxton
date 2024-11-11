import { APP_API_BASE_URL } from "@config/Properties";
import TransferItem from "@features/job-applications/components/TransferItem";
import {
  GetAllUsersQuery,
  GetOrganizationBySlugNameQuery,
  useAlterRecruitersInOrganizationMutation,
  useGetAllUsersQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Alert,
  Button,
  Modal,
  Text,
  Title,
  TransferList,
  TransferListData,
  TransferListItem,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { FormAlterRecruitersOrgSchema } from "@validator/FormAlterRecruitersOrgSchema";
import { useCallback, useState } from "react";
import { When } from "react-if";
import { useNavigate, useParams } from "react-router-dom";

const recrToTrsfItem = (
  recruiters: NonNullable<
    GetOrganizationBySlugNameQuery["getOrganizationBySlugName"]
  >["recruiters"],
): TransferListItem[] => {
  if (!recruiters) {
    return [];
  }
  return recruiters.map((r) => ({
    value: String(r?.id),
    label: `${r?.user.lastName} ${r?.user.firstName}`,
    key: r?.id,
    description: r?.user.userProfile.profileTitle,
    image:
      r?.user.userProfile.userProfileAvatarImage &&
      `${APP_API_BASE_URL}/${r?.user.userProfile.userProfileAvatarImage.url}`,
  }));
};

const usrToTrsfItem = (
  users: NonNullable<NonNullable<GetAllUsersQuery>["getAllUsers"]>,
): TransferListItem[] => {
  if (!users) return [];
  return users.map((u) => ({
    value: String(u?.id),
    label: `${u?.lastName} ${u?.firstName}`,
    key: u?.id,
    description: u?.userProfile.profileTitle,
    image:
      u?.userProfile.userProfileAvatarImage &&
      `${APP_API_BASE_URL}/${u?.userProfile.userProfileAvatarImage}`,
  }));
};

const filterExistingUsr = (
  usrs: NonNullable<NonNullable<GetAllUsersQuery>["getAllUsers"]>,
  recs: NonNullable<
    GetOrganizationBySlugNameQuery["getOrganizationBySlugName"]
  >["recruiters"],
) =>
  (recs?.length ?? 0) > 0
    ? usrs.filter((u) => !recs?.some((r) => r?.id === u?.id))
    : usrs;

const OrganizationRecruitersModal = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(true);
  const { organizationSlug } = useParams();
  const queryClient = useQueryClient();
  const closeModal = useCallback(() => {
    navigate(-1);
    setOpened(false);
  }, [navigate]);
  const [err, setErr] = useState<string | undefined>();

  const closeAlert = useCallback(() => setErr(undefined), []);

  const prevQueryUsers = queryClient.getQueryData<GetAllUsersQuery>(
    // eslint-disable-next-line react-compiler/react-compiler
    useGetAllUsersQuery.getKey({}),
  );
  const prevOrgQuery = queryClient.getQueryData<GetOrganizationBySlugNameQuery>(
    // eslint-disable-next-line react-compiler/react-compiler
    useGetOrganizationBySlugNameQuery.getKey({
      slugName: organizationSlug ?? "",
    }),
  );

  const [data, setData] = useState<TransferListData>([
    [
      ...recrToTrsfItem(
        prevOrgQuery?.getOrganizationBySlugName?.recruiters ?? [],
      ),
    ],
    [
      ...usrToTrsfItem(
        filterExistingUsr(
          prevQueryUsers?.getAllUsers ?? [],
          prevOrgQuery?.getOrganizationBySlugName?.recruiters ?? [],
        ),
      ),
    ],
  ]);

  const { data: organizationData } = useGetOrganizationBySlugNameQuery(
    graphqlRequestClient,
    {
      slugName: organizationSlug ?? "",
    },
    {
      enabled: !!organizationSlug,
      onSuccess: (respData) => {
        if (!respData.getOrganizationBySlugName) return;
        const { recruiters } = respData.getOrganizationBySlugName;
        const recArr = recrToTrsfItem(recruiters);
        setData([recArr, data[1]]);
      },
    },
  );

  const recruiters = organizationData?.getOrganizationBySlugName?.recruiters;

  const { data: usersData } = useGetAllUsersQuery(
    graphqlRequestClient,
    {},
    {
      onSuccess: (respData) => {
        if (!respData.getAllUsers) return;
        const tmp = filterExistingUsr(respData.getAllUsers, recruiters);
        const usrs = tmp.length > 0 ? tmp : respData.getAllUsers;
        const userArr = usrToTrsfItem(usrs);
        setData([data[0], userArr]);
      },
      enabled: !!recruiters,
    },
  );

  const { mutate } = useAlterRecruitersInOrganizationMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        showNotification({
          title: "Organization update",
          message: "Successfully updated users in organization",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
        closeModal();
        queryClient.invalidateQueries(
          useGetOrganizationBySlugNameQuery.getKey({
            slugName: organizationSlug ?? "",
          }),
        );
      },
      onError: (err: GraphqlApiResponse) => {
        if (err.response.errors) setErr(err.response.errors[0].message);
      },
    },
  );

  const submitChanges = useCallback(() => {
    const newValues = data[0];
    const input = {
      RecruiterInput: newValues.map((u) => ({
        id: Number(u.value),
      })),
      OrganizationId: organizationData?.getOrganizationBySlugName?.id ?? 0,
    };
    const result = FormAlterRecruitersOrgSchema.safeParse(input);
    if (!result.success) {
      const flatErrors = result.error.flatten().fieldErrors;
      setErr(
        flatErrors.OrganizationId?.toString() ??
          flatErrors.RecruiterInput?.toString(),
      );
    } else mutate(input);
  }, [data, organizationData?.getOrganizationBySlugName?.id]);

  if (!organizationData?.getOrganizationBySlugName || !usersData?.getAllUsers)
    return null;

  return (
    <Modal
      title="Recruiters"
      opened={opened}
      onClose={closeModal}
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
      size={680}
    >
      <Title order={5} mb="sm">
        Select the new users to be added
      </Title>
      <TransferList
        value={data}
        onChange={setData}
        searchPlaceholder="Search..."
        nothingFound="Nothing here"
        limit={10}
        listHeight={300}
        itemComponent={TransferItem}
        titles={[`Recruiters in organization`, "All users"]}
        breakpoint="sm"
        mb="md"
      />
      <When condition={err}>
        <Alert
          icon={<ExclamationTriangleIcon width={16} />}
          title="Invalid input"
          color="red"
          mb="sm"
          withCloseButton
          onClose={closeAlert}
        >
          <Text size="sm">{err}</Text>
        </Alert>
      </When>
      <Button fullWidth onClick={submitChanges} variant="filled">
        Submit changes
      </Button>
    </Modal>
  );
};

export default OrganizationRecruitersModal;
