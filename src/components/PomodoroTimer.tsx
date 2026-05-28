
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  user: any;
  setUser: (user: any) => void;
}

const PomodoroTimer = ({ user, setUser }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [customTimes, setCustomTimes] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const { toast } = useToast();

  const sessionTimes = {
    focus: customTimes.focus * 60,
    shortBreak: customTimes.shortBreak * 60,
    longBreak: customTimes.longBreak * 60,
  };

  const sessionLabels = {
    focus: 'Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const motivationalQuotes = [
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "The future depends on what you do today. - Mahatma Gandhi",
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    const savedCustomTimes = localStorage.getItem('customTimerSettings');
    if (savedCustomTimes) {
      const parsed = JSON.parse(savedCustomTimes);
      setCustomTimes(parsed);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    // Play sound effect
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (settings.soundEnabled !== false) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj');
      audio.play().catch(() => {}); // Ignore errors
    }

    if (sessionType === 'focus') {
      const sessionDuration = Math.floor(customTimes.focus / 5); // XP based on session length
      const baseXP = 25;
      const bonusXP = sessionDuration * 2;
      const totalXP = baseXP + bonusXP;
      
      const currentLevel = Math.floor((user.xp || 0) / 100) + 1;
      const newXP = (user.xp || 0) + totalXP;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      const updatedUser = { ...user, xp: newXP };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (newLevel > currentLevel) {
        toast({
          title: `🎉 LEVEL UP! You're now Level ${newLevel}!`,
          description: `You earned ${totalXP} XP! Keep up the great work!`,
        });
      } else {
        toast({
          title: "Focus session completed! 🎉",
          description: `You earned ${totalXP} XP! Time for a break.`,
        });
      }

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('Focus session completed!', {
          body: `Great job! You earned ${totalXP} XP.`,
          icon: '/favicon.ico'
        });
      }
    } else {
      toast({
        title: "Break time over!",
        description: "Ready to get back to work?",
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionTimes[sessionType]);
  };

  const switchSession = (type: 'focus' | 'shortBreak' | 'longBreak') => {
    setSessionType(type);
    setTimeLeft(sessionTimes[type]);
    setIsActive(false);
  };

  const saveCustomTimes = () => {
    localStorage.setItem('customTimerSettings', JSON.stringify(customTimes));
    setTimeLeft(sessionTimes[sessionType]);
    setShowCustomSettings(false);
    toast({
      title: "Timer settings saved!",
      description: "Your custom durations have been applied.",
    });
  };

  const progress = ((sessionTimes[sessionType] - timeLeft) / sessionTimes[sessionType]) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Custom Timer Settings */}
      {showCustomSettings && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Custom Timer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="focus-time">Focus (minutes)</Label>
                <Input
                  id="focus-time"
                  type="number"
                  min="1"
                  max="120"
                  value={customTimes.focus}
                  onChange={(e) => setCustomTimes({...customTimes, focus: parseInt(e.target.value) || 25})}
                />
              </div>
              <div>
                <Label htmlFor="short-break">Short Break (minutes)</Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  max="30"
                  value={customTimes.shortBreak}
                  onChange={(e) => setCustomTimes({...customTimes, shortBreak: parseInt(e.target.value) || 5})}
                />
              </div>
              <div>
                <Label htmlFor="long-break">Long Break (minutes)</Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  max="60"
                  value={customTimes.longBreak}
                  onChange={(e) => setCustomTimes({...customTimes, longBreak: parseInt(e.target.value) || 15})}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveCustomTimes} className="flex-1">Save Settings</Button>
              <Button variant="outline" onClick={() => setShowCustomSettings(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timer Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {sessionLabels[sessionType]}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomSettings(!showCustomSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Circular Progress */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
              <circle
                cx="128"
                cy="128"
                r="112"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200"
              />
              <circle
                cx="128"
                cy="128"
                r="112"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 112}`}
                strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-in-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="rounded-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-8"
            >
              {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              onClick={() => switchSession('focus')}
              variant={sessionType === 'focus' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              Focus ({customTimes.focus}m)
            </Button>
            <Button
              onClick={() => switchSession('shortBreak')}
              variant={sessionType === 'shortBreak' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              Short Break ({customTimes.shortBreak}m)
            </Button>
            <Button
              onClick={() => switchSession('longBreak')}
              variant={sessionType === 'longBreak' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              Long Break ({customTimes.longBreak}m)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-0 shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            "{currentQuote}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
