import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Title } from "@mantine/core";

export default function AccessDenied() {
  return (
    <div className="px-acess-denied flex flex-col justify-center items-center gap-2">
      <ShieldExclamationIcon width={32} />
      <Title order={5}>Access Denied</Title>
      <p className="text-sm">You are not allowed to access this resource</p>
    </div>
  );
}
