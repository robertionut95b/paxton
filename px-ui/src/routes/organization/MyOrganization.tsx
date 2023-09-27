import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
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
    useGetRecruiterByIdQuery.getKey({
      recruiterId: user?.userId ?? 0,
    })
  );

  const { isInitialLoading } = useGetRecruiterByIdQuery(
    graphqlRequestClient,
    {
      recruiterId: user?.userId ?? 0,
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
          message: "You are not assigned recruiter to any organization",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
        navigate(`/app`);
      },
    }
  );

  if (isInitialLoading) return <ApplicationSpinner />;
  if (prevQuery?.getRecruiterById && isAuthorized([RoleType.ROLE_RECRUITER])) {
    return (
      <Navigate
        to={`/app/organizations/${prevQuery.getRecruiterById.organization.slugName}/`}
      />
    );
  } else return <Navigate to={`/app`} />;
}
