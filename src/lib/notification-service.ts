/**
 * Notification Service
 * 
 * Handles notification creation, scheduling, and management.
 * Integrates with user preferences to respect notification settings.
 */

import { addNotification, type Notification } from "@/components/notification-center";
import { toast } from "sonner";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
}

const PREFERENCES_KEY = 'user_preferences';

/**
 * Get user notification preferences
 */
function getPreferences(): UserPreferences {
  const stored = localStorage.getItem(PREFERENCES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse preferences:', error);
    }
  }
  // Default preferences
  return {
    emailNotifications: true,
    pushNotifications: true,
    dailyReminders: true,
    weeklyReports: true,
    achievementAlerts: true,
  };
}

/**
 * Send a notification (respects user preferences)
 */
export function sendNotification(
  type: Notification['type'],
  title: string,
  message: string,
  options?: {
    actionUrl?: string;
    showToast?: boolean;
    requirePermission?: keyof UserPreferences;
  }
) {
  const preferences = getPreferences();

  // Check if user has enabled this type of notification
  if (options?.requirePermission && !preferences[options.requirePermission]) {
    return;
  }

  // Add to notification center
  const notification = addNotification({
    type,
    title,
    message,
    actionUrl: options?.actionUrl,
  });

  // Show toast if enabled
  if (options?.showToast !== false && preferences.pushNotifications) {
    toast(title, {
      description: message,
      duration: 5000,
    });
  }

  return notification;
}

/**
 * Achievement notification
 */
export function notifyAchievement(title: string, message: string, actionUrl?: string) {
  return sendNotification('achievement', title, message, {
    actionUrl,
    showToast: true,
    requirePermission: 'achievementAlerts',
  });
}

/**
 * Daily reminder notification
 */
export function notifyDailyReminder(message: string = 'Time for your daily coaching session!') {
  return sendNotification('reminder', 'Daily Practice Reminder', message, {
    actionUrl: '/chat',
    showToast: true,
    requirePermission: 'dailyReminders',
  });
}

/**
 * Milestone notification
 */
export function notifyMilestone(title: string, message: string, actionUrl?: string) {
  return sendNotification('milestone', title, message, {
    actionUrl,
    showToast: true,
  });
}

/**
 * Weekly report notification
 */
export function notifyWeeklyReport(message: string = 'Your weekly progress report is ready!') {
  return sendNotification('report', 'Weekly Progress Report', message, {
    actionUrl: '/data-reports',
    showToast: true,
    requirePermission: 'weeklyReports',
  });
}

/**
 * New module notification
 */
export function notifyNewModule(moduleName: string, actionUrl?: string) {
  return sendNotification(
    'module',
    'New Module Available',
    `Check out the new module: ${moduleName}`,
    {
      actionUrl: actionUrl || '/modules',
      showToast: true,
    }
  );
}

/**
 * General notification
 */
export function notifyGeneral(title: string, message: string, actionUrl?: string) {
  return sendNotification('general', title, message, {
    actionUrl,
    showToast: true,
  });
}

/**
 * Schedule daily reminders (call this on app load)
 */
export function scheduleDailyReminders() {
  const preferences = getPreferences();
  if (!preferences.dailyReminders) return;

  // Check if reminder was already sent today
  const lastReminder = localStorage.getItem('last_daily_reminder');
  const today = new Date().toDateString();

  if (lastReminder === today) return;

  // Send reminder
  notifyDailyReminder();
  localStorage.setItem('last_daily_reminder', today);
}

/**
 * Check for achievements based on activity
 */
export function checkAchievements() {
  // This would integrate with your scoring/activity tracking system
  // For now, it's a placeholder for future integration
  
  // Example: Check if user completed 10 sessions
  const sessionCount = parseInt(localStorage.getItem('session_count') || '0');
  const achievementUnlocked = localStorage.getItem('achievement_10_sessions');

  if (sessionCount >= 10 && !achievementUnlocked) {
    notifyAchievement(
      'Achievement Unlocked!',
      'You completed 10 coaching sessions. Keep up the great work!',
      '/dashboard'
    );
    localStorage.setItem('achievement_10_sessions', 'true');
  }

  // Add more achievement checks here
}

/**
 * Initialize notification service (call on app load)
 */
export function initNotificationService() {
  // Schedule daily reminders
  scheduleDailyReminders();

  // Check for achievements
  checkAchievements();

  // Request browser notification permission if enabled
  const preferences = getPreferences();
  if (preferences.pushNotifications && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

/**
 * Send browser push notification (if permission granted)
 */
export function sendBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
    });
  }
}
