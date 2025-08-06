import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Send, AlertTriangle, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  bot: string;
}

export default function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_subscriber":
        return <UserPlus className="text-green-600" size={16} />;
      case "message_sent":
        return <Send className="text-blue-600" size={16} />;
      case "warning":
        return <AlertTriangle className="text-orange-600" size={16} />;
      case "settings_update":
        return <Settings className="text-purple-600" size={16} />;
      default:
        return <Settings className="text-gray-600" size={16} />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "new_subscriber":
        return "bg-green-100";
      case "message_sent":
        return "bg-blue-100";
      case "warning":
        return "bg-orange-100";
      case "settings_update":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 1440) {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: Activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${getActivityBgColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
