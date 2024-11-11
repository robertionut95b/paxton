import {
  Avatar,
  Checkbox,
  Group,
  Text,
  TransferListItemComponent,
} from "@mantine/core";

const TransferItem: TransferListItemComponent = ({ data, selected }) => {
  return (
    <Group noWrap>
      <Avatar src={data.image} radius="xl" size="sm" />
      <div style={{ flex: 1 }}>
        <Text size="xs" weight={400}>
          {data.label}
        </Text>
        <Text size="xs" color="dimmed" weight={400}>
          {data.description}
        </Text>
      </div>
      <Checkbox
        checked={selected}
        onChange={() => {}}
        tabIndex={-1}
        size="xs"
        sx={{ pointerEvents: "none" }}
      />
    </Group>
  );
};

export default TransferItem;
