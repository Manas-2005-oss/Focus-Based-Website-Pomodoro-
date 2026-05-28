
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PomodoroTimer from '@/components/PomodoroTimer';
import TaskList from '@/components/TaskList';
import ProgressTracker from '@/components/ProgressTracker';
import MotivationCenter from '@/components/MotivationCenter';
import MusicPlayer from '@/components/MusicPlayer';
import GameCenter from '@/components/GameCenter';
import StudyAssistant from '@/components/StudyAssistant';
import Notepad from '@/components/Notepad';
import StudyPlanner from '@/components/StudyPlanner';
import XPStore from '@/components/XPStore';
import CommunityWall from '@/components/CommunityWall';
import Settings from '@/components/Settings';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('timer');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <PomodoroTimer user={user} setUser={setUser} />;
      case 'tasks':
        return <TaskList user={user} setUser={setUser} />;
      case 'progress':
        return <ProgressTracker user={user} />;
      case 'motivation':
        return <MotivationCenter />;
      case 'music':
        return <MusicPlayer />;
      case 'games':
        return <GameCenter user={user} setUser={setUser} />;
      case 'assistant':
        return <StudyAssistant />;
      case 'notepad':
        return <Notepad />;
      case 'planner':
        return <StudyPlanner />;
      case 'store':
        return <XPStore user={user} setUser={setUser} />;
      case 'community':
        return <CommunityWall user={user} />;
      case 'settings':
        return <Settings user={user} setUser={setUser} />;
      default:
        return <PomodoroTimer user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
