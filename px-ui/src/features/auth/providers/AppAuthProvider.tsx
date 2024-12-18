import { UserManager } from "oidc-client-ts";
import React from "react";
import { AuthProvider } from "react-oidc-context";

export const userManager = new UserManager({
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}${window.location.pathname}`,
  post_logout_redirect_uri: window.location.origin,
  monitorSession: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
});

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

type AppAuthProviderProps = {
  children: React.ReactElement;
};

const AppAuthProvider = ({ children }: AppAuthProviderProps) => {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      {children}
    </AuthProvider>
  );
};

export default AppAuthProvider;
