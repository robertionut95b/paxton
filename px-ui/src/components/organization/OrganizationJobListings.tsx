import JobListingItem from "@components/jobs/JobListing";
import { JobListing } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Divider } from "@mantine/core";
import { MouseEventHandler } from "react";
import { NavLink } from "react-router-dom";

type OrganizationJobListingsProps = {
  jobs: (JobListing | null)[];
  compactItems?: boolean;
  editableItems?: boolean;
  itemClickCb?: (item: JobListing) => MouseEventHandler<Element> | undefined;
};

const OrganizationJobListings = ({
  jobs,
  compactItems = false,
  editableItems = false,
  itemClickCb,
}: OrganizationJobListingsProps) => {
  return (
    <>
      {jobs.map(
        (jl, idx) =>
          jl && (
            <div
              key={jl.id}
              onClick={() => itemClickCb?.(jl)}
              className={itemClickCb && "cursor-pointer"}
            >
              <div className="flex items-center">
                <div className="grow overflow-auto">
                  <JobListingItem
                    compact={compactItems}
                    data={jl}
                    navigable={!itemClickCb}
                  />
                </div>
                {editableItems && (
                  <NavLink
                    className="self-start"
                    to={`jobs/publish-job/form/${jl.id}/update`}
                  >
                    <ActionIcon mt={"md"} color="violet">
                      <PencilIcon width={16} />
                    </ActionIcon>
                  </NavLink>
                )}
              </div>
              {idx !== jobs.length - 1 && <Divider />}
            </div>
          ),
      )}
    </>
  );
};

export default OrganizationJobListings;
