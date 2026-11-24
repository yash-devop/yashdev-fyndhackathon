"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/components/common/sidebar-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebarHeader } from "./app-sidebar-header";
import { cn } from "@repo/ui/cn";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" className="duration-[0.175s] ease-out">
      <AppSidebarHeader />
      <SidebarContent className="mt-1.5 px-0 mx-0 gap-1">
        <SidebarGroup className="gap-1">
          <SidebarGroupLabel className="text-muted-foreground font-light text-[11px] uppercase">
            Catalogue
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={<Link href={href} />}
                    isActive={pathname === href}
                    tooltip={title}
                    className={cn(
                      "text-[13px] select-none h-9",
                      pathname === href
                        ? "text-sidebar-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 flex flex-row items-center">
        <p className="text-muted-foreground text-[11px] flex-wrap max-w-[150px]">
          built by yash-devop ·{" "}
          <a
            href="https://portfolio.emberbuild.in"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            website
          </a>{" "}
          ·{" "}
          <a
            href="https://x.com/yash_devop"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            twitter
          </a>
        </p>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
