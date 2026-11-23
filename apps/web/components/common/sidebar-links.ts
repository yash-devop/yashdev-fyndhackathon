import {
  IconClipboardList,
  IconFileDescription,
  IconPackage,
  IconPlus,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

export type SidebarLink = {
  title: string;
  href: string;
  icon: TablerIcon;
};

export const sidebarLinks: SidebarLink[] = [
  {
    title: "Products",
    href: "/products",
    icon: IconPackage,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: IconClipboardList,
  },
  {
    title: "Create Order",
    href: "/orders/new",
    icon: IconPlus,
  },
  {
    title: "Order Details",
    href: "/orders/ORD-DEMO",
    icon: IconFileDescription,
  },
];
