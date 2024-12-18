import { Routes } from "@app/routes";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import { useGetRecruiterByIdQuery } from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { Navigate, useNavigate } from "react-router-dom";

export default function MyOrganizationPage() {
  const { isAuthorized, user } = useAuth();
  const navigate = useNavigate();

  const { data: recruiterData } = useGetRecruiterByIdQuery(
    graphqlRequestClient,
    {
      // TODO: fix this
      recruiterId: user?.userId ?? 0,
    },
    {
      onSuccess: (data) => {
        const organizationSlug = data.getRecruiterById?.organization.slugName;
        if (organizationSlug && isAuthorized([Roles.ROLE_RECRUITER])) {
          navigate(
            Routes.Organizations.Details.buildPath({
              organizationSlug: organizationSlug,
            }),
          );
        }
      },
      onError: () => {
        showNotification({
          title: "Data error",
          message: "You are not assigned recruiter to any organization",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
        navigate(Routes.Feed.path);
      },
      suspense: true,
    },
  );

  if (recruiterData?.getRecruiterById && isAuthorized([Roles.ROLE_RECRUITER])) {
    return (
      <Navigate
        to={Routes.Organizations.Details.buildPath({
          organizationSlug:
            recruiterData.getRecruiterById.organization.slugName,
        })}
      />
    );
  } else return <Navigate to={Routes.Feed.path} />;
}
