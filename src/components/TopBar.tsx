
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TopBarProps {
  user: any;
}

const TopBar = ({ user }: TopBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user.name || 'Focuser'}! 👋
          </h1>
          <p className="text-gray-600">Ready to conquer your goals today?</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* XP and Level Display */}
          <div className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg px-4 py-2">
            <div className="text-sm font-medium text-gray-700">
              Level {getLevel(user.xp || 0)} • {user.xp || 0} XP
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${((user.xp || 0) % 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* User Avatar */}
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
              {getInitials(user.name || 'User')}
            </AvatarFallback>
          </Avatar>
          
          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
