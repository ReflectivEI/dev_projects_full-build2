import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Briefcase, MapPin, Calendar, Upload, Save, Settings, Bell, Palette } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  specialty: string;
  territory: string;
  bio: string;
  avatar: string;
  memberSince: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
  defaultCoachingSpecialty: string;
}

const STORAGE_KEYS = {
  PROFILE: 'user_profile',
  PREFERENCES: 'user_preferences',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sales Representative',
  email: 'rep@pharma.com',
  role: 'Pharmaceutical Sales Representative',
  specialty: 'Oncology',
  territory: 'Northeast Region',
  bio: '',
  avatar: '',
  memberSince: new Date().toISOString().split('T')[0],
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  emailNotifications: true,
  pushNotifications: true,
  dailyReminders: true,
  weeklyReports: true,
  achievementAlerts: true,
  defaultCoachingSpecialty: 'Oncology',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Load data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // Save avatar preview to profile if changed
    if (avatarPreview) {
      profile.avatar = avatarPreview;
    }

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const savePreferences = () => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    toast.success('Preferences saved successfully!');

    // Apply theme change
    if (preferences.theme !== 'system') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(preferences.theme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberDuration = () => {
    const start = new Date(profile.memberSince);
    const now = new Date();
    const months = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return 'Less than a month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return years === 1 ? '1 year' : `${years} years`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || profile.avatar} />
                    <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription className="text-base mt-1">{profile.role}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        Member for {getMemberDuration()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant={isEditingProfile ? "default" : "outline"}
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your professional details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    Specialty
                  </Label>
                  <Select
                    value={profile.specialty}
                    onValueChange={(value) => handleProfileChange('specialty', value)}
                    disabled={!isEditingProfile}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Immunology">Immunology</SelectItem>
                      <SelectItem value="Rare Diseases">Rare Diseases</SelectItem>
                      <SelectItem value="Primary Care">Primary Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="territory">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Territory
                  </Label>
                  <Input
                    id="territory"
                    value={profile.territory}
                    onChange={(e) => handleProfileChange('territory', e.target.value)}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Tell us about yourself and your experience..."
                    rows={4}
                  />
                </div>

                {isEditingProfile && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="avatar">
                      <Upload className="h-4 w-4 inline mr-2" />
                      Profile Picture
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">Upload a profile picture (JPG, PNG, max 5MB)</p>
                  </div>
                )}
              </div>

              {isEditingProfile && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Palette className="h-5 w-5 inline mr-2" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value: any) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Bell className="h-5 w-5 inline mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive updates and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminders">Daily Practice Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
                </div>
                <Switch
                  id="daily-reminders"
                  checked={preferences.dailyReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('dailyReminders', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly Progress Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly summaries</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={preferences.weeklyReports}
                  onCheckedChange={(checked) => handlePreferenceChange('weeklyReports', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you unlock achievements</p>
                </div>
                <Switch
                  id="achievement-alerts"
                  checked={preferences.achievementAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('achievementAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coaching Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Settings className="h-5 w-5 inline mr-2" />
                Coaching Preferences
              </CardTitle>
              <CardDescription>Customize your coaching experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-specialty">Default Coaching Specialty</Label>
                <Select
                  value={preferences.defaultCoachingSpecialty}
                  onValueChange={(value) => handlePreferenceChange('defaultCoachingSpecialty', value)}
                >
                  <SelectTrigger id="default-specialty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Immunology">Immunology</SelectItem>
                    <SelectItem value="Rare Diseases">Rare Diseases</SelectItem>
                    <SelectItem value="Primary Care">Primary Care</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Your preferred therapeutic area for coaching sessions</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={savePreferences}>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
