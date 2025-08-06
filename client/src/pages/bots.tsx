import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, Edit, Power, Users, MessageSquare, Settings, ExternalLink } from "lucide-react";
import AddBotModal from "@/components/modals/add-bot-modal";

export default function Bots() {
  const [showAddBotModal, setShowAddBotModal] = useState(false);

  const { data: bots = [], isLoading } = useQuery({
    queryKey: ["/api/bots"],
  });

  const handleEditBot = (botId: string) => {
    console.log("Edit bot:", botId);
  };

  const handleToggleBot = (botId: string) => {
    console.log("Toggle bot:", botId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "offline": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bot Management</h1>
            <p className="text-gray-600">Manage your Telegram bots and their settings</p>
          </div>
          <Button 
            onClick={() => setShowAddBotModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2" size={16} />
            Add Bot
          </Button>
        </div>
      </header>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bots.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Bot className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bots Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Get started by adding your first Telegram bot. You'll need a bot token from @BotFather.
              </p>
              <Button 
                onClick={() => setShowAddBotModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2" size={16} />
                Add Your First Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot: any) => (
              <Card key={bot.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        bot.status === 'online' ? 'bg-blue-600' : 
                        bot.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        <Bot className="text-white" size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <p className="text-sm text-gray-500">@{bot.username}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subscribers</span>
                      <span className="font-medium flex items-center">
                        <Users size={14} className="mr-1" />
                        {bot.subscriberCount.toLocaleString()}
                      </span>
                    </div>
                    
                    {bot.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {bot.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Link href={`/bots/${bot.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            Manage
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBot(bot.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBot(bot.id)}
                        className={`${bot.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                      >
                        <Power size={14} className="mr-1" />
                        {bot.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddBotModal open={showAddBotModal} onOpenChange={setShowAddBotModal} />
    </div>
  );
}
