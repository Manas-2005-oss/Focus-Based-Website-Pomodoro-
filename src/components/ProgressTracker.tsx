
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, Zap } from 'lucide-react';

interface ProgressTrackerProps {
  user: any;
}

const ProgressTracker = ({ user }: ProgressTrackerProps) => {
  const getLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXPForNextLevel = (xp: number) => {
    const currentLevel = getLevel(xp);
    return currentLevel * 100;
  };

  const getXPProgress = (xp: number) => {
    return (xp % 100);
  };

  const level = getLevel(user.xp || 0);
  const nextLevelXP = getXPForNextLevel(user.xp || 0);
  const currentLevelProgress = getXPProgress(user.xp || 0);

  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', sessions: 4, xp: 80 },
    { day: 'Tue', sessions: 6, xp: 120 },
    { day: 'Wed', sessions: 3, xp: 60 },
    { day: 'Thu', sessions: 5, xp: 100 },
    { day: 'Fri', sessions: 7, xp: 140 },
    { day: 'Sat', sessions: 2, xp: 40 },
    { day: 'Sun', sessions: 4, xp: 80 },
  ];

  const totalSessions = weeklyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalWeeklyXP = weeklyData.reduce((sum, day) => sum + day.xp, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-teal-500 to-blue-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Current Level</p>
                <p className="text-3xl font-bold">{level}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total XP</p>
                <p className="text-3xl font-bold">{user.xp || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">This Week</p>
                <p className="text-3xl font-bold">{totalSessions}</p>
                <p className="text-purple-200 text-xs">sessions</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Current Streak</p>
                <p className="text-3xl font-bold">{user.streak || 0}</p>
                <p className="text-pink-200 text-xs">days</p>
              </div>
              <Calendar className="w-8 h-8 text-pink-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <Progress value={currentLevelProgress} className="h-3" />
          <p className="text-center text-sm text-gray-600">
            {100 - currentLevelProgress} XP until next level
          </p>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                <div 
                  className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    backgroundColor: day.sessions > 0 
                      ? `rgba(20, 184, 166, ${Math.min(day.sessions / 8, 1)})` 
                      : '#e5e7eb'
                  }}
                >
                  {day.sessions}
                </div>
                <div className="text-xs text-gray-500 mt-1">{day.xp} XP</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Total this week: <span className="font-semibold">{totalSessions} sessions</span> • <span className="font-semibold">{totalWeeklyXP} XP</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 text-center ${level >= 2 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-2xl mb-2">🥉</div>
              <h4 className="font-semibold">Getting Started</h4>
              <p className="text-sm text-gray-600">Reach Level 2</p>
              {level >= 2 && <p className="text-xs text-green-600 mt-1">Unlocked!</p>}
            </div>
            
            <div className={`p-4 rounded-lg border-2 text-center ${level >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-2xl mb-2">🥈</div>
              <h4 className="font-semibold">Focus Master</h4>
              <p className="text-sm text-gray-600">Reach Level 5</p>
              {level >= 5 && <p className="text-xs text-green-600 mt-1">Unlocked!</p>}
            </div>
            
            <div className={`p-4 rounded-lg border-2 text-center ${level >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-2xl mb-2">🥇</div>
              <h4 className="font-semibold">Productivity Legend</h4>
              <p className="text-sm text-gray-600">Reach Level 10</p>
              {level >= 10 && <p className="text-xs text-green-600 mt-1">Unlocked!</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
