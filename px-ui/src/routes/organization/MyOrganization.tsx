import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import { useGetRecruiterByIdQuery } from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";

export default function MyOrganizationPage() {
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useGetRecruiterByIdQuery(
    graphqlRequestClient,
    {
      recruiterId: user?.userId as string,
    },
    {
      onSuccess: async (data) => {
        const organizationSlug = data.getRecruiterById?.organization.slugName;
        if (organizationSlug && isAuthorized([RoleType.ROLE_RECRUITER])) {
          navigate(`/app/organizations/${organizationSlug}/`);
        }
      },
      onError: () => {
        showNotification({
          title: "Data error",
          message: "You are not assigned to any organization",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
        navigate(`/app`);
      },
    }
  );

  useEffectOnce(() => {
    if (
      data &&
      data.getRecruiterById?.organization.id &&
      isAuthorized([RoleType.ROLE_RECRUITER])
    ) {
      const organizationSlug = data.getRecruiterById?.organization?.slugName;
      navigate(`/app/organizations/${organizationSlug}/`);
    } else navigate(`/app`);
  });

  if (isLoading) return <GenericLoadingSkeleton />;

  return null;
}
