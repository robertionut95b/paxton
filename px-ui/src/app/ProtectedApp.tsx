import ProtectedAppError from "@components/errors/ProtectedAppError";
import { useAuthStore } from "@features/auth/stores/authStore";
import {
  setAuthenticationByAccessToken,
  setUserByToken,
} from "@features/auth/utils/authUtils";
import { Fragment, type ReactNode, useEffect, useState } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";

interface ProtectedAppProps {
  children: ReactNode;
}

export const ProtectedApp: React.FC<ProtectedAppProps> = ({ children }) => {
  const auth = useAuth();
  const { userLoading } = useAuthStore();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  useEffect(() => {
    if (
      !(
        hasAuthParams() ||
        auth.isAuthenticated ||
        auth.activeNavigator ||
        auth.isLoading ||
        hasTriedSignin
      )
    ) {
      void auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  useEffect(() => {
    if (auth.user?.access_token) {
      const loadAuthenticationByToken = (accessToken: string) => {
        setAuthenticationByAccessToken(accessToken);
        setUserByToken(accessToken);
      };
      loadAuthenticationByToken(auth.user.access_token);
    }
  }, [auth.user?.access_token]);

  return (
    <>
      {auth.error ? (
        <ProtectedAppError error={auth.error} />
      ) : auth.isLoading || userLoading ? null : auth.isAuthenticated ? (
        children
      ) : (
        <Fragment>
          <h1>Oops, an error ocurred</h1>
          <div>Unable to sign in</div>
        </Fragment>
      )}
    </>
  );
};
