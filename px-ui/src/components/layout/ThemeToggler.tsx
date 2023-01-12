import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Menu, useMantineColorScheme } from "@mantine/core";

export default function ThemeToggler() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <SunIcon width={18} /> : <MoonIcon width={18} />}
    </ActionIcon>
  );
}

export function ThemeTogglerMenuItem() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Menu.Item
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      icon={
        dark ? (
          <SunIcon width={18} color="yellow" />
        ) : (
          <MoonIcon color="blue" width={18} />
        )
      }
    >
      Change theme
    </Menu.Item>
  );
}
