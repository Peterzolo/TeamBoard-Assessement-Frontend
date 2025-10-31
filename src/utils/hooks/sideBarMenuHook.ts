import { useState } from "react";

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  items?: { label: string; href: string }[];
}

export const useSidebarMenu = (menuItems: MenuItem[]) => {
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (label: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isDropdownOpen = (label: string) => dropdownStates[label] || false;

  return { menuItems, toggleDropdown, isDropdownOpen };
};
