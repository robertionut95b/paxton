import { Routes } from "@app/routes";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { TextInput, Title } from "@mantine/core";
import {
  SpotlightAction,
  SpotlightProvider,
  openSpotlight,
} from "@mantine/spotlight";
import { Link, useNavigate } from "react-router-dom";

let searchQuery = "";

export function LogoWithSearch() {
  const navigate = useNavigate();

  const actions: SpotlightAction[] = [
    {
      title: "Home",
      description: "Go back home",
      onTrigger: () => {
        console.log("home");
        console.log(searchQuery);
      },
      icon: <HomeIcon width={20} />,
    },
    {
      title: "Jobs",
      description: "Search jobs globally",
      onTrigger: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        searchQuery.length > 0
          ? navigate(Routes.Jobs.Search.buildSearch({ q: searchQuery }))
          : navigate(Routes.Jobs.path);
      },
      icon: <BriefcaseIcon width={20} />,
    },
    {
      title: "Posts",
      description:
        "Search in posts or announcements by other users or companies",
      onTrigger: () => console.log("Documentation"),
      icon: <ChatBubbleOvalLeftEllipsisIcon width={20} />,
    },
    {
      title: "People",
      description: "Search a user",
      onTrigger: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        searchQuery.length > 0
          ? navigate(Routes.People.Search.buildSearch({ q: searchQuery }))
          : navigate(Routes.People.Search.path);
      },
      icon: <UsersIcon width={20} />,
    },
    {
      title: "Companies",
      description: "Search a company",
      onTrigger: () => console.log("Documentation"),
      icon: <BuildingOfficeIcon width={20} />,
    },
    {
      title: "Events",
      description: "Search events or meetups",
      onTrigger: () => console.log("Documentation"),
      icon: <CalendarDaysIcon width={20} />,
    },
  ];

  return (
    <div className="px-logo flex items-center justify-center gap-x-2">
      <Link
        className="flex items-center justify-center gap-x-2"
        to={Routes.Feed.path}
      >
        <BriefcaseIcon width={32} color={"#7950f2"} />
        <Title className="tracking-wider" mt={4} order={4}>
          Paxton
        </Title>
      </Link>
      <SpotlightProvider
        actions={actions}
        searchIcon={<MagnifyingGlassIcon width={16} />}
        searchPlaceholder="Search..."
        nothingFoundMessage="Nothing found..."
        onQueryChange={(q) => {
          searchQuery = q;
        }}
        filter={() => actions}
      >
        <TextInput
          size="sm"
          ml="sm"
          placeholder="Search anything"
          icon={<MagnifyingGlassIcon width={16} />}
          onClick={() => openSpotlight()}
          readOnly
        />
      </SpotlightProvider>
    </div>
  );
}
