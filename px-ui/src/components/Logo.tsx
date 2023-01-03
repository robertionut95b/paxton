import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { TextInput, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <div className="px-logo flex justify-center items-center gap-x-2">
      <Link className="flex justify-center items-center gap-x-2" to="/app">
        <BriefcaseIcon width={32} color={"#7950f2"} />
        <Title className="tracking-wider" mt={4} order={4}>
          Paxton
        </Title>
      </Link>
    </div>
  );
}

export function LogoWithSearch() {
  return (
    <div className="px-logo flex justify-center items-center gap-x-2">
      <Link className="flex justify-center items-center gap-x-2" to="/app">
        <BriefcaseIcon width={32} color={"#7950f2"} />
        <Title className="tracking-wider" mt={4} order={4}>
          Paxton
        </Title>
      </Link>
      <TextInput
        // className={classes.search}
        size="sm"
        ml="sm"
        placeholder="Search anything"
        icon={<MagnifyingGlassIcon width={16} />}
      />
    </div>
  );
}
