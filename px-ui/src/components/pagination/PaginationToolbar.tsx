import ShowIf from "@components/visibility/ShowIf";
import { Group, Pagination, Select, Text } from "@mantine/core";
import { useState } from "react";

type PaginationToolbarProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalElements: number;
};

const pageSizes = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
];

export default function PaginationToolbar({
  page = 1,
  setPage,
  pageSize = 5,
  setPageSize,
  totalPages = 0,
  totalElements = 0,
}: PaginationToolbarProps) {
  const [p, setP] = useState(page ?? 1);
  const [ps, setPs] = useState(pageSize ?? 5);

  return (
    <Group position="apart" mt={"md"}>
      <Group>
        <Select
          data={pageSizes}
          size="sm"
          styles={{
            root: {
              display: "flex",
              alignItems: "center",
            },
            label: {
              marginRight: "10px",
            },
            input: {
              width: "5rem",
            },
          }}
          label="Page size"
          defaultValue={ps.toString()}
          value={ps.toString()}
          onChange={(v) => {
            setPs(parseInt(v ?? "10"));
            setPageSize(parseInt(v ?? "10"));
            setP(1);
            setPage(1);
          }}
        />
        <ShowIf if={totalElements > 0}>
          <Text size={"sm"}>
            {totalElements} result<ShowIf if={totalElements > 1}>s</ShowIf>
          </Text>
        </ShowIf>
      </Group>
      <Pagination
        total={totalPages}
        page={p}
        onChange={(p) => {
          setP(p);
          setPage(p);
        }}
        initialPage={0}
        position="right"
        grow
      />
    </Group>
  );
}
