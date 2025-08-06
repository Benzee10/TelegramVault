import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "blue",
}: StatsCardProps) {
  const getIconBgColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100";
      case "green": return "bg-green-100";
      case "purple": return "bg-purple-100";
      case "orange": return "bg-orange-100";
      default: return "bg-gray-100";
    }
  };

  const getIconTextColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600";
      case "green": return "text-green-600";
      case "purple": return "text-purple-600";
      case "orange": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            {change && (
              <p className={`text-sm mt-1 ${getChangeColor(changeType)}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconBgColor(iconColor)}`}>
            <Icon className={`text-xl ${getIconTextColor(iconColor)}`} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
