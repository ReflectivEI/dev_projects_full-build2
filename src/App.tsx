import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/CookieBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationCenter } from "@/components/notification-center";
import { ApiStatusBanner, ApiStatusBadge } from "@/components/api-status";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat";
import RolePlayPage from "@/pages/roleplay";
import ModulesPage from "@/pages/modules";
import FrameworksPage from "@/pages/frameworks";
import KnowledgePage from "@/pages/knowledge";
import EIMetricsPage from "@/pages/ei-metrics";
import ExercisesPage from "@/pages/exercises";
import DataReportsPage from "@/pages/data-reports";
import HelpPage from "@/pages/help";
import ProfilePage from "@/pages/profile";
import WorkerProbePage from "@/pages/worker-probe";

// Get base path from Vite config (for GitHub Pages deployment)
const basePath = import.meta.env.BASE_URL || '/';

function Router() {
  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/roleplay" component={RolePlayPage} />
        <Route path="/exercises" component={ExercisesPage} />
        <Route path="/modules" component={ModulesPage} />
        <Route path="/frameworks" component={FrameworksPage} />
        <Route path="/ei-metrics" component={EIMetricsPage} />
        <Route path="/data-reports" component={DataReportsPage} />
        <Route path="/knowledge" component={KnowledgePage} />
        <Route path="/help" component={HelpPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/worker-probe" component={WorkerProbePage} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-4 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ApiStatusBadge />
                  </div>
                  <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <ThemeToggle />
                  </div>
                </header>
                <ApiStatusBanner />
                <main className="flex-1 overflow-hidden">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
          <SonnerToaster />
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;