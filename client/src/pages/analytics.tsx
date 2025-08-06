import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Download, 
  Calendar,
  Activity,
  Target,
  Zap
} from "lucide-react";

export default function Analytics() {
  const [selectedBot, setSelectedBot] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");

  const { data: bots = [] } = useQuery({
    queryKey: ["/api/bots"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock analytics data - in a real app this would come from the API
  const analyticsData = {
    messageVolume: [
      { date: "Jan", sent: 1200, received: 890 },
      { date: "Feb", sent: 1500, received: 1100 },
      { date: "Mar", sent: 1800, received: 1300 },
      { date: "Apr", sent: 2100, received: 1600 },
      { date: "May", sent: 2400, received: 1800 },
      { date: "Jun", sent: 2800, received: 2100 },
    ],
    subscriberGrowth: [
      { month: "Jan", subscribers: 500 },
      { month: "Feb", subscribers: 750 },
      { month: "Mar", subscribers: 1200 },
      { month: "Apr", subscribers: 1800 },
      { month: "May", subscribers: 2500 },
      { month: "Jun", subscribers: 3200 },
    ],
    engagementRates: [
      { bot: "Support Bot", rate: 87.3 },
      { bot: "Newsletter Bot", rate: 82.1 },
      { bot: "Product Updates", rate: 79.5 },
    ],
    topPerformers: [
      { metric: "Highest Engagement", bot: "Support Bot", value: "87.3%" },
      { metric: "Most Active", bot: "Newsletter Bot", value: "2,341 msgs" },
      { metric: "Fastest Growing", bot: "Product Updates", value: "+24%" },
    ]
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, iconColor }: any) => {
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
              <p className="text-3xl font-bold text-gray-900">{value}</p>
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
  };

  const SimpleBarChart = ({ data, title }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2" size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.date || item.month || item.bot}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((item.sent || item.subscribers || item.rate) / Math.max(...data.map((d: any) => d.sent || d.subscribers || d.rate)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.sent?.toLocaleString() || item.subscribers?.toLocaleString() || `${item.rate}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Analyze your bot performance and subscriber engagement</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select bot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bots</SelectItem>
                {bots.map((bot: any) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Messages"
            value={stats ? stats.messagesSent.toLocaleString() : "0"}
            change="+12% vs last month"
            changeType="positive"
            icon={MessageSquare}
            iconColor="blue"
          />
          <MetricCard
            title="Active Subscribers"
            value={stats ? stats.totalSubscribers.toLocaleString() : "0"}
            change="+8% growth"
            changeType="positive"
            icon={Users}
            iconColor="green"
          />
          <MetricCard
            title="Avg Response Time"
            value="2.3s"
            change="-0.5s improvement"
            changeType="positive"
            icon={Zap}
            iconColor="purple"
          />
          <MetricCard
            title="Conversion Rate"
            value="15.7%"
            change="+2.3% increase"
            changeType="positive"
            icon={Target}
            iconColor="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleBarChart data={analyticsData.messageVolume} title="Message Volume (Last 6 Months)" />
          <SimpleBarChart data={analyticsData.subscriberGrowth} title="Subscriber Growth" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Rates */}
          <SimpleBarChart data={analyticsData.engagementRates} title="Bot Engagement Rates" />

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{performer.metric}</p>
                      <p className="text-xs text-gray-500">{performer.bot}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {performer.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2" size={20} />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages Today</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Subscribers</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Campaigns Sent</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Engagement</span>
                  <span className="font-medium">82.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-medium">67.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Bot Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bots.map((bot: any) => (
                    <tr key={bot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <MessageSquare className="text-white" size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                            <div className="text-sm text-gray-500">@{bot.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bot.subscriberCount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(Math.random() * 5000 + 1000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(Math.random() * 20 + 70).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{(Math.random() * 10 + 5).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={bot.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {bot.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
