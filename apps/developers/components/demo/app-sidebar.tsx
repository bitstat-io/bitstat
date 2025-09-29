"use client";

import {
  IconAdjustmentsDollar,
  IconCards,
  IconDashboard,
  IconListDetails,
  IconMoneybag,
  IconSettings,
  IconTrendingUp,
  IconUserCheck,
  IconZoomCheck,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavMisc } from "./nav-misc";
import { IconLogo } from "@workspace/ui/components/logo";

const data = {
  user: {
    name: "Johny",
    email: "johny@bistat.io",
    avatar:
      "https://www.fmt.se/wp-content/uploads/2023/02/logo-placeholder-image.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Realtime Monitoring",
      url: "#",
      icon: IconListDetails,
    },

    {
      title: "Engagement Tracking",
      url: "#",
      icon: IconZoomCheck,
    },

    {
      title: "Player Progression",
      url: "#",
      icon: IconTrendingUp,
    },
    {
      title: "Advertising Metrics",
      url: "#",
      icon: IconCards,
    },
    {
      title: "User Acquisition",
      url: "#",
      icon: IconUserCheck,
    },
    {
      title: "Monetization",
      url: "#",
      icon: IconMoneybag,
    },
    {
      title: "Resource Economy",
      url: "#",
      icon: IconAdjustmentsDollar,
    },
  ],
  navSecondary: [],
  misc: [
    {
      title: "Tools & Extension",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <IconLogo className="text-primary" width={30} />
                <span className="text-base font-mono font-semibold">
                  bitstat
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={data.navMain} />
        <NavMisc items={data.misc} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
