
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Moon, Sun, Bell, Volume2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  user: any;
  setUser: (user: any) => void;
}

const Settings = ({ user, setUser }: SettingsProps) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailReminders: true,
    focusLock: false,
    soundEnabled: true,
    reminderTime: '19:00'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      
      // Apply dark mode on load
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.body.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #dbeafe 50%, #faf5ff 100%)';
      }
    }

    // Show reminder notification
    if (key === 'notifications' && value) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      const now = new Date();
      const [hours, minutes] = newSettings.reminderTime.split(':');
      const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
      if (reminderTime > now) {
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('Focus Reminder', {
              body: 'Time for your daily focus session!',
              icon: '/favicon.ico'
            });
          }
        }, timeUntilReminder);
      }
    }
    
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Sun className="w-5 h-5" />
              <span>Appearance</span>
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Browser Notifications</Label>
                <p className="text-sm text-gray-500">Get notified about session reminders</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-reminders">Email Reminders</Label>
                <p className="text-sm text-gray-500">Receive email notifications for missed sessions</p>
              </div>
              <Switch
                id="email-reminders"
                checked={settings.emailReminders}
                onCheckedChange={(checked) => updateSetting('emailReminders', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Daily Reminder Time</Label>
              <Select value={settings.reminderTime} onValueChange={(value) => updateSetting('reminderTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Audio</span>
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound-enabled">Sound Effects</Label>
                <p className="text-sm text-gray-500">Play sounds when timer starts/stops</p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </div>

          {/* Focus */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Focus</span>
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="focus-lock">Focus Lock Mode</Label>
                <p className="text-sm text-gray-500">Prevent tab switching during focus sessions</p>
              </div>
              <Switch
                id="focus-lock"
                checked={settings.focusLock}
                onCheckedChange={(checked) => updateSetting('focusLock', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <Button variant="destructive" className="w-full">
              Reset All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
