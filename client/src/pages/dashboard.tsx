import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import StatsCard from "@/components/stats-card";
import BotCard from "@/components/bot-card";
import ActivityFeed from "@/components/activity-feed";
import CampaignTable from "@/components/campaign-table";
import AddBotModal from "@/components/modals/add-bot-modal";
import CreateCampaignModal from "@/components/modals/create-campaign-modal";
import { Bot, Users, Send, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [showAddBotModal, setShowAddBotModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<{
    activeBots: number;
    totalSubscribers: number;
    messagesSent: number;
    engagementRate: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: bots = [], isLoading: botsLoading } = useQuery<Array<{
    id: string;
    name: string;
    username: string;
    isActive: boolean;
    subscriberCount: number;
    status: string;
  }>>({
    queryKey: ["/api/bots"],
  });

  const handleEditBot = (botId: string) => {
    console.log("Edit bot:", botId);
  };

  const handleToggleBot = (botId: string) => {
    console.log("Toggle bot:", botId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Monitor your bot performance and subscriber engagement</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button 
              onClick={() => setShowAddBotModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="mr-2" size={16} />
              <span className="hidden sm:inline">Add Bot</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : stats ? (
            <>
              <StatsCard
                title="Active Bots"
                value={stats.activeBots}
                change="+2 this week"
                changeType="positive"
                icon={Bot}
                iconColor="blue"
              />
              <StatsCard
                title="Total Subscribers"
                value={stats.totalSubscribers}
                change="+15% this month"
                changeType="positive"
                icon={Users}
                iconColor="green"
              />
              <StatsCard
                title="Messages Sent"
                value={stats.messagesSent}
                change="+8% vs last week"
                changeType="positive"
                icon={Send}
                iconColor="purple"
              />
              <StatsCard
                title="Engagement Rate"
                value={`${stats.engagementRate}%`}
                change="+3.2% improvement"
                changeType="positive"
                icon={Heart}
                iconColor="orange"
              />
            </>
          ) : null}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Bot Management & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bot Management Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Bots</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {botsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="animate-pulse space-y-4">
                            <div className="h-12 bg-gray-200 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : bots.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No bots configured yet</p>
                    <Button onClick={() => setShowAddBotModal(true)}>
                      Add Your First Bot
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bots.slice(0, 3).map((bot: any) => (
                      <BotCard
                        key={bot.id}
                        bot={bot}
                        onEdit={handleEditBot}
                        onToggle={handleToggleBot}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <ActivityFeed />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowCreateCampaignModal(true)}
                >
                  <Send className="mr-2" size={16} />
                  Create Campaign
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2" size={16} />
                  Add Template
                </Button>
                <Button variant="outline" className="w-full">
                  <Bot className="mr-2" size={16} />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compliance Status</CardTitle>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GDPR Compliance</span>
                  <span className="text-sm font-medium text-green-600">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Opt-in Tracking</span>
                  <span className="text-sm font-medium text-green-600">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate Limiting</span>
                  <span className="text-sm font-medium text-green-600">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Audit Logging</span>
                  <span className="text-sm font-medium text-green-600">✓ Enabled</span>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Full Report
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">API Usage</span>
                    <span className="text-sm font-medium text-gray-900">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Webhook Health</span>
                    <span className="text-sm font-medium text-gray-900">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium text-gray-900">142ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Campaign Management Section */}
        <CampaignTable onCreateCampaign={() => setShowCreateCampaignModal(true)} />
      </div>

      {/* Modals */}
      <AddBotModal open={showAddBotModal} onOpenChange={setShowAddBotModal} />
      <CreateCampaignModal open={showCreateCampaignModal} onOpenChange={setShowCreateCampaignModal} />
    </div>
  );
}
