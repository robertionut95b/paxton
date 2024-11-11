import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Menu, useMantineColorScheme } from "@mantine/core";

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
