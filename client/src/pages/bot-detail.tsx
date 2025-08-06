import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bot, Users, MessageSquare, BarChart3, Settings, Power } from "lucide-react";
import { AutoResponderManager } from "@/components/auto-responder-manager";
import { AiContentGenerator } from "@/components/ai-content-generator";

export default function BotDetail() {
  const params = useParams();
  const botId = params?.id;

  const { data: bot, isLoading } = useQuery({
    queryKey: ["/api/bots", botId],
    queryFn: () => fetch(`/api/bots/${botId}`).then(res => res.json()),
    enabled: !!botId,
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ["/api/bots", botId, "subscribers"],
    queryFn: () => fetch(`/api/bots/${botId}/subscribers`).then(res => res.json()),
    enabled: !!botId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/bots", botId, "messages"],
    queryFn: () => fetch(`/api/bots/${botId}/messages`).then(res => res.json()),
    enabled: !!botId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <Card>
            <CardContent className="text-center py-16">
              <Bot className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bot Not Found</h3>
              <p className="text-gray-500 mb-6">The bot you're looking for doesn't exist or has been removed.</p>
              <Link href="/bots">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Bots
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center space-x-4">
            <Link href="/bots">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bots
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                bot.status === 'online' ? 'bg-blue-600' : 
                bot.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}>
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{bot.name}</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600">@{bot.username}</p>
                  <Badge className={`text-xs ${getStatusColor(bot.status)}`}>
                    {bot.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant={bot.isActive ? "destructive" : "default"} 
              size="sm"
            >
              <Power className="h-4 w-4 mr-2" />
              {bot.isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages Today</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Responses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.filter((m: any) => m.metadata?.generatedBy === 'ai').length}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="auto-responders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="auto-responders">Auto-Responders</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="messages">Recent Messages</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="auto-responders" className="space-y-6">
            <AutoResponderManager botId={botId!} />
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AiContentGenerator type="campaign" />
              <Card>
                <CardHeader>
                  <CardTitle>AI Response Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AI Response Success Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User Satisfaction</span>
                      <span className="font-medium">4.7/5</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded">
                      🤖 Your bot is powered by Google Gemini for intelligent, context-aware responses.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  ) : (
                    messages.slice(0, 10).map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${message.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-sm p-3 rounded-lg ${
                            message.direction === 'inbound'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {new Date(message.sentAt).toLocaleTimeString()}
                            </p>
                            {message.metadata?.generatedBy === 'ai' && (
                              <Badge variant="outline" className="text-xs">AI</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No subscribers yet</p>
                    </div>
                  ) : (
                    subscribers.map((subscriber: any) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {subscriber.firstName} {subscriber.lastName}
                          </p>
                          <p className="text-sm text-gray-500">@{subscriber.username}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(subscriber.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}