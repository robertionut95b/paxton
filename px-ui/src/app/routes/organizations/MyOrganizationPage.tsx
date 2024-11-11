import { Routes } from "@app/routes";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import {
  GetRecruiterByIdQuery,
  useGetRecruiterByIdQuery,
} from "@gql/generated";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";

export default function MyOrganizationPage() {
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const prevQuery = queryClient.getQueryData<GetRecruiterByIdQuery>(
    // eslint-disable-next-line react-compiler/react-compiler
    useGetRecruiterByIdQuery.getKey({
      recruiterId: user?.userId ?? 0,
    }),
  );

  useGetRecruiterByIdQuery(
    graphqlRequestClient,
    {
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

  if (prevQuery?.getRecruiterById && isAuthorized([Roles.ROLE_RECRUITER])) {
    return (
      <Navigate
        to={Routes.Organizations.Details.buildPath({
          organizationSlug: prevQuery.getRecruiterById.organization.slugName,
        })}
      />
    );
  } else return <Navigate to={Routes.Feed.path} />;
}
