import { useAuth } from "@auth/useAuth";
import { useEffect } from "react";

export default function Logout() {
  let mounted = false;
  const { signout } = useAuth();

  useEffect(() => {
    if (!mounted) {
      signout(() => (window.location.href = "/app"));
    }

    return () => {
      mounted = true;
    };
  }, []);

  return <></>;
}
