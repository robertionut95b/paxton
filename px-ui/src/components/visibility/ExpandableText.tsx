import { Stack, Text, TextProps } from "@mantine/core";
import { useDarkMode } from "usehooks-ts";

interface ExpandableTextProps extends TextProps {
  expanded?: boolean;
}

export default function ExpandableText(props: ExpandableTextProps) {
  const { children, className, expanded = false, ...rest } = props;
  const { isDarkMode } = useDarkMode();
  return (
    <Stack className="px-expandable-container flex flex-col">
      <Text className={`px-expandable-text ${className}`} {...rest}>
        <pre
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            whiteSpace: "pre-wrap",
            color: isDarkMode ? "#C1C2C5" : "#000",
          }}
        >
          {children}
        </pre>
      </Text>
      <input
        className="px-expandable-text-expand-btn text-gray-400 text-sm tracking-wide cursor-pointer self-end"
        type={"checkbox"}
        title="Expand"
        defaultChecked={expanded}
      />
    </Stack>
  );
}
