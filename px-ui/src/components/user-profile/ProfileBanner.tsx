import { PencilIcon } from "@heroicons/react/24/outline";
import { Indicator } from "@mantine/core";

export default function ProfileBanner({ coverPhoto }: { coverPhoto?: string }) {
  return (
    <div className="px-profile-banner relative">
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
          src={coverPhoto ?? "/bg-profile.jpg"}
          loading="lazy"
        />
      </Indicator>
    </div>
  );
}
