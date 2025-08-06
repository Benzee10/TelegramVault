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

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white text-xl" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeleBot Pro</h1>
            <p className="text-sm text-gray-500">Marketing Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg font-medium transition-colors",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <Users className="text-gray-600 text-sm" size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Demo User</p>
            <p className="text-xs text-gray-500">Pro Plan</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
