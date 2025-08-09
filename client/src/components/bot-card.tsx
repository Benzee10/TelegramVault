import { Bot, Edit, Power, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BotCardProps {
  bot: {
    id: string;
    name: string;
    username: string;
    subscriberCount: number;
    status: "online" | "offline" | "maintenance";
    isActive: boolean;
  };
  onEdit: (botId: string) => void;
  onToggle: (botId: string) => void;
}

export default function BotCard({ bot, onEdit, onToggle }: BotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-600";
      case "offline": return "text-red-600";
      case "maintenance": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getBotIconColor = () => {
    switch (bot.status) {
      case "online": return "bg-blue-600";
      case "offline": return "bg-gray-400";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`w-10 h-10 ${getBotIconColor()} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Bot className="text-white" size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 truncate">{bot.name}</h4>
              <p className="text-sm text-gray-500 truncate">@{bot.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <Users size={14} className="mr-1" />
                <span className="hidden sm:inline">{bot.subscriberCount.toLocaleString()} subscribers</span>
                <span className="sm:hidden">{bot.subscriberCount.toLocaleString()}</span>
              </p>
              <p className={`text-xs capitalize ${getStatusColor(bot.status)}`}>
                {bot.status}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(bot.id)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(bot.id)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Power size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
