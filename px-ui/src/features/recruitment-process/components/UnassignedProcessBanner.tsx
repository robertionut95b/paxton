import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Alert } from "@mantine/core";

const UnassignedProcessBanner = () => {
  return (
    <Alert
      icon={<ShieldExclamationIcon width={30} />}
      title="Process is unavailable"
      color="red"
      variant="filled"
      styles={{
        message: {
          lineHeight: 1.7,
        },
      }}
    >
      Hello recruiter! <br />
      Unfortunately this job listing does not have a recruitment process
      allocated! <br /> Please edit the job and select your process and
      it&apos;s respective steps. You can also set it as a default process for
      all further job postings.
    </Alert>
  );
};

export default UnassignedProcessBanner;
