import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Bot, 
  Users, 
  Send, 
  FileText, 
  Link as LinkIcon, 
  BarChart, 
  Shield, 
  Settings,
  MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Bot Management", href: "/bots", icon: Bot },
  { name: "Subscribers", href: "/subscribers", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Send },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Webhooks", href: "/webhooks", icon: LinkIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white text-xl" size={20} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">TeleBot Pro</h1>
            <p className="text-sm text-gray-500">Marketing Suite</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3 px-2 py-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="text-gray-600 text-sm" size={16} />
              </div>
              <div className="flex-1 hidden lg:block">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">Pro Plan</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings size={16} />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
