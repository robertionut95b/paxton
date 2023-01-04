import { RoleType } from "@auth/permission.types";
import { RequirePermission } from "@auth/RequirePermission";
import JobListingItem from "@components/jobs/JobListing";
import { JobListing } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Divider } from "@mantine/core";
import { NavLink } from "react-router-dom";

type OrganizationJobListingsProps = {
  jobs: (JobListing | null)[];
};

const OrganizationJobListings = ({ jobs }: OrganizationJobListingsProps) => {
  return (
    <div>
      {jobs.map(
        (jl, idx) =>
          jl && (
            <div key={jl.id}>
              <div className="flex items-center">
                <div className="grow">
                  <JobListingItem data={jl} />
                </div>
                <RequirePermission
                  permission={RoleType.ROLE_RECRUITER}
                  returnValue="null"
                >
                  <NavLink
                    className="self-start"
                    to={`jobs/publish-job/form/${jl.id}/update`}
                  >
                    <ActionIcon mt={"md"} color="violet">
                      <PencilIcon width={16} />
                    </ActionIcon>
                  </NavLink>
                </RequirePermission>
              </div>
              {idx !== jobs.length - 1 && <Divider />}
            </div>
          )
      )}
    </div>
  );
};

export default OrganizationJobListings;
