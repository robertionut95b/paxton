import { useAuth } from "@auth/useAuth";
import { useEffect } from "react";

export default function Logout() {
  const { signout } = useAuth();

  useEffect(() => {
    signout(() => (window.location.href = "/app"));
  }, []);

  return <></>;
}
