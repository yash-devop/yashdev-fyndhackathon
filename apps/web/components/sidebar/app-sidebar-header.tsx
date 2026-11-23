import { SidebarHeader } from "@repo/ui";
import { DummyLogo } from "../icons";
import { AppSidebarTrigger } from "./app-sidebar-trigger";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="h-12 flex flex-row items-center gap-2.5 border-b px-3">
      <DummyLogo className="shrink-0" />
      <span className="truncate text-sm font-semibold">yash-fynd</span>
      <div className="ml-auto">
        <AppSidebarTrigger />
      </div>
    </SidebarHeader>
  );
};
