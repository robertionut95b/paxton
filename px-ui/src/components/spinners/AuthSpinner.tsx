import { LoadingOverlay } from "@mantine/core";

export default function AuthSpinner() {
  return (
    <div className="px-auth-loading">
      <LoadingOverlay visible={true} overlayBlur={2} />
    </div>
  );
}
