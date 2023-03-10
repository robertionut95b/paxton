import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { TextInput, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Logo() {
  return (
    <div className="px-logo flex items-center justify-center gap-x-2">
      <Link className="flex items-center justify-center gap-x-2" to="/app">
        <BriefcaseIcon width={32} color={"#7950f2"} />
        <Title className="tracking-wider" mt={4} order={4}>
          Paxton
        </Title>
      </Link>
    </div>
  );
}

export function LogoWithSearch() {
  const [q, setQ] = useState<string>("");
  const navigate = useNavigate();

  const changeQueryCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.currentTarget.value),
    []
  );

  const submitQueryCb = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        navigate(`/app/search/results/all?keywords=${q}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q]
  );

  return (
    <div className="px-logo flex items-center justify-center gap-x-2">
      <Link className="flex items-center justify-center gap-x-2" to="/app">
        <BriefcaseIcon width={32} color={"#7950f2"} />
        <Title className="tracking-wider" mt={4} order={4}>
          Paxton
        </Title>
      </Link>
      <TextInput
        size="sm"
        ml="sm"
        placeholder="Search anything"
        icon={<MagnifyingGlassIcon width={16} />}
        value={q}
        onChange={changeQueryCb}
        onKeyDown={submitQueryCb}
      />
    </div>
  );
}
