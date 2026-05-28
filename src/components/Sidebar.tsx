
import React from 'react';
import { Timer, List, TrendingUp, User, Settings, Music, Gamepad2, Bot, FileText, Calendar, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: List },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'store', label: 'XP Store', icon: ShoppingBag },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'motivation', label: 'Motivation', icon: User },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'assistant', label: 'Study Assistant', icon: Bot },
    { id: 'notepad', label: 'Notepad', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-gray-200/50">
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Pomodoro Race
          </span>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    activeTab === item.id
                      ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  )}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
