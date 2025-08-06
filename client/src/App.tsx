import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Bots from "@/pages/bots";
import BotDetail from "@/pages/bot-detail";
import Subscribers from "@/pages/subscribers";
import Campaigns from "@/pages/campaigns";
import Templates from "@/pages/templates";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/bots" component={Bots} />
          <Route path="/bots/:id" component={BotDetail} />
          <Route path="/subscribers" component={Subscribers} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/templates" component={Templates} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
