import { LoadingOverlay } from "@mantine/core";

export default function ApplicationSpinner() {
  return (
    <div className="px-app-loading">
      <LoadingOverlay visible={true} overlayBlur={2} />
    </div>
  );
}
