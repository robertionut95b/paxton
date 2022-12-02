import { PencilIcon } from "@heroicons/react/24/outline";
import { Indicator } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function ProfileBanner({
  coverPhoto,
  editable = false,
}: {
  coverPhoto?: string;
  editable?: boolean;
}) {
  if (editable)
    return (
      <div className="px-profile-banner relative">
        <NavLink to={"update/banner"}>
          <Indicator
            classNames={{
              indicator: "cursor-pointer",
            }}
            size={30}
            position="bottom-end"
            withBorder
            label={<PencilIcon width={16} />}
          >
            <img
              className="px-profile-banner-img h-60 w-full object-cover rounded-md"
              src={coverPhoto}
              loading="lazy"
            />
          </Indicator>
        </NavLink>
      </div>
    );
  else
    return (
      <div className="px-profile-banner relative">
        <img
          className="px-profile-banner-img h-60 w-full object-cover rounded-md"
          src={coverPhoto}
          loading="lazy"
        />
      </div>
    );
}
