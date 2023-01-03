import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import { useGetUserProfileQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOrganizationPage() {
  const { user } = useAuth();
  const { data: userProfile } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: user?.profileSlugUrl,
  });

  const lastOrganization =
    userProfile?.getUserProfile?.experiences?.[0]?.organization;

  const navigate = useNavigate();

  useEffect(() => {
    if (lastOrganization) {
      const permissions = user?.permissions ?? [];
      if (permissions.includes(RoleType.ROLE_RECRUITER)) {
        navigate(`/app/organizations/${lastOrganization?.id}/`);
      } else navigate(`/app/organizations/${lastOrganization?.id}/`);
    }
  }, [lastOrganization, navigate, user?.permissions]);

  return <></>;
}
