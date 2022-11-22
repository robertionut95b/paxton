import { Text, TextProps } from "@mantine/core";

export default function ExpandableText(props: TextProps) {
  const { children, className, ...rest } = props;
  return (
    <div className="px-expandable-container flex flex-col">
      <Text className={`px-expandable-text ${className}`} {...rest}>
        <pre
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            whiteSpace: "pre-wrap",
          }}
        >
          {children}
        </pre>
      </Text>
      <input
        className="px-expandable-text-expand-btn text-gray-400 text-sm tracking-wide cursor-pointer self-end"
        type={"checkbox"}
        title="Expand"
      />
    </div>
  );
}
