import { Loader, LoaderProps, LoadingOverlay } from "@mantine/core";

type ApplicationSpinnerProps = {
  variant?: LoaderProps["variant"];
};

export default function ApplicationSpinner({
  variant = "dots",
}: Readonly<ApplicationSpinnerProps>) {
  return (
    <div className="px-app-loading">
      <LoadingOverlay
        visible={true}
        overlayBlur={2}
        loader={<Loader variant={variant} />}
      />
    </div>
  );
}
