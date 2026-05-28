
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, User } from 'lucide-react';

const MotivationCenter = () => {
  const motivationalContent = [
    {
      quote: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      tip: "Start with the smallest task on your list. Momentum builds from action, not planning."
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      tip: "Every Pomodoro session is a small victory. Celebrate your consistent efforts."
    },
    {
      quote: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      tip: "Focus on the process, not the time. Quality work happens when you're fully present."
    },
    {
      quote: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
      tip: "Choose your three most important tasks for today and tackle them first."
    },
    {
      quote: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
      tip: "Small, consistent actions compound over time. Your future self will thank you."
    },
    {
      quote: "What we fear doing most is usually what we most need to do.",
      author: "Tim Ferriss",
      tip: "That task you've been avoiding? Start with just 5 minutes on it today."
    }
  ];

  const successStories = [
    {
      title: "Sarah's Study Success",
      story: "Sarah used Pomodoro Race to prepare for her medical exams. By breaking study sessions into focused 25-minute blocks, she increased her retention by 40% and felt less overwhelmed.",
      achievement: "Passed all exams with honors"
    },
    {
      title: "Mark's Creative Breakthrough",
      story: "As a freelance designer, Mark struggled with creative blocks. Using the focus timer and motivation center, he developed a consistent creative routine and doubled his productivity.",
      achievement: "Launched successful design studio"
    },
    {
      title: "Lisa's Work-Life Balance",
      story: "Lisa, a working mom, used the app to carve out focused time for her side business. The gamification kept her motivated during busy periods.",
      achievement: "Built a 6-figure online business"
    }
  ];

  const [currentContent, setCurrentContent] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);

  const getNewContent = () => {
    setCurrentContent((prev) => (prev + 1) % motivationalContent.length);
  };

  const getNewStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Daily Motivation */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-between">
            <span>Daily Motivation ✨</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={getNewContent}
              className="text-teal-600 hover:text-teal-700"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="text-lg italic text-gray-700 leading-relaxed">
            "{motivationalContent[currentContent].quote}"
          </blockquote>
          <p className="text-sm text-gray-600 font-medium">
            — {motivationalContent[currentContent].author}
          </p>
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">💡 Pro Tip:</h4>
            <p className="text-gray-700">{motivationalContent[currentContent].tip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Success Stories</span>
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={getNewStory}
              className="text-gray-600 hover:text-gray-700"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {successStories[currentStory].title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {successStories[currentStory].story}
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                🎉 Achievement: {successStories[currentStory].achievement}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Tips */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Focus Enhancement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">🧠 Mental Preparation</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Take 3 deep breaths before starting</li>
                <li>• Set a clear intention for each session</li>
                <li>• Remove distractions from your workspace</li>
                <li>• Use the "2-minute rule" for quick tasks</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">⚡ Energy Management</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Take breaks every 25 minutes</li>
                <li>• Stay hydrated throughout the day</li>
                <li>• Do light stretching during breaks</li>
                <li>• Avoid heavy meals before focus sessions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Corner */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mindfulness Corner 🧘‍♀️
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Take a moment to center yourself with this quick breathing exercise:
          </p>
          <div className="bg-white/70 p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">🌸</div>
            <p className="text-gray-700 mb-4">
              Breathe in for 4 counts, hold for 4, breathe out for 6.
            </p>
            <p className="text-sm text-gray-600">
              Repeat this cycle 3 times before your next focus session.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationCenter;
