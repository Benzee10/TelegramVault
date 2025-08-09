import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Dashboard from "@/pages/dashboard";
import Bots from "@/pages/bots";
import BotDetail from "@/pages/bot-detail";
import Subscribers from "@/pages/subscribers";
import Campaigns from "@/pages/campaigns";
import Templates from "@/pages/templates";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";
import AppSidebar from "@/components/sidebar";

function Router() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white lg:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold">TeleBot Pro</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
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
