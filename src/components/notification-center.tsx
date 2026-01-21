import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  Trophy,
  Target,

  TrendingUp,
  BookOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'report' | 'module' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const STORAGE_KEY = 'notifications';

const notificationIcons = {
  achievement: Trophy,
  reminder: Bell,
  milestone: Target,
  report: TrendingUp,
  module: BookOpen,
  general: Bell,
};

const notificationColors = {
  achievement: 'text-yellow-600',
  reminder: 'text-blue-600',
  milestone: 'text-purple-600',
  report: 'text-green-600',
  module: 'text-orange-600',
  general: 'text-gray-600',
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    } else {
      // Initialize with sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'reminder',
          title: 'Daily Practice Reminder',
          message: 'Time for your daily coaching session!',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: 'You completed 10 coaching sessions',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-8 text-xs text-destructive hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const iconColor = notificationColors[notification.type];

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors relative group",
                      !notification.read && "bg-accent/30"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={cn("p-2 rounded-full bg-background", iconColor)}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 mt-2 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Utility function to add a notification
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const notifications: Notification[] = stored ? JSON.parse(stored) : [];

  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(newNotification);

  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

  // Dispatch custom event to update UI
  window.dispatchEvent(new CustomEvent('notification-added'));

  return newNotification;
}
