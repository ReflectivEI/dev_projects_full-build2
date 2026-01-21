import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/notification-center";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Database,
  Library,
  Users,
  Brain,

  Activity,
  Dumbbell,
  Loader2,
  RotateCcw,
  HelpCircle,
  User,

  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Logo removed - using text instead
import { getSessionId, SESSION_ID_EVENT } from "@/lib/queryClient";

interface DailyFocus {
  title: string;
  focus: string;
  microTask: string;
  reflection: string;
}

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "AI Coach",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Role Play Simulator",
    url: "/roleplay",
    icon: Users,
  },
  {
    title: "Exercises",
    url: "/exercises",
    icon: Dumbbell,
  },
  {
    title: "Coaching Modules",
    url: "/modules",
    icon: BookOpen,
  },
];

const customizationsNavItems = [
  {
    title: "Behavioral Metrics",
    url: "/ei-metrics",
    icon: Activity,
  },
  {
    title: "Selling and Coaching Frameworks",
    url: "/frameworks",
    icon: Brain,
  },
  {
    title: "Data and Reports",
    url: "/data-reports",
    icon: Database,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge",
    icon: Library,
  },
  {
    title: "Help Center",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const [sessionId, setSessionId] = useState<string>(() => getSessionId() || "anon");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setSessionId(getSessionId() || "anon");
    window.addEventListener(SESSION_ID_EVENT, handler);
    return () => window.removeEventListener(SESSION_ID_EVENT, handler);
  }, []);

  const { data: dailyFocus, isLoading: isFocusLoading, refetch: refetchFocus, isFetching: isFocusFetching } = useQuery<DailyFocus>({
    queryKey: ["/api/daily-focus"],
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours (changes daily)
    refetchOnWindowFocus: false,
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-end mb-3">
          <NotificationCenter />
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Link href="/" className="flex flex-col items-center gap-2">
            <img 
              src="/assets/reflectivai-logo.jpeg" 
              alt="ReflectivAI Logo" 
              className="h-12 w-auto"
            />
            <span className="text-sm font-medium text-foreground">Sales Enablement</span>
          </Link>
        </div>
      </SidebarHeader>

      {/* User Profile - Moved above Main section */}
      <div className="px-4 py-3 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">SR</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">Sales Rep</div>
                <div className="text-xs text-muted-foreground">rep@pharma.com</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Customizations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customizationsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* Daily Focus */}
        <div className="rounded-md bg-muted p-3" data-testid="card-daily-focus">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Today's Focus</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => refetchFocus()}
              disabled={isFocusFetching}
              data-testid="button-refresh-focus"
            >
              <RotateCcw className={`h-3 w-3 ${isFocusFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          {isFocusLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-2" data-testid="text-daily-focus">
              <div className="text-xs font-medium text-foreground">
                {dailyFocus?.title || "Today's Focus"}
              </div>
              <p className="text-xs text-muted-foreground">
                {dailyFocus?.focus || "Unable to load today's focus. Tap refresh."}
              </p>
              {dailyFocus?.microTask ? (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Micro-task:</span> {dailyFocus.microTask}
                </p>
              ) : null}
              {dailyFocus?.reflection ? (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Reflection:</span> {dailyFocus.reflection}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
