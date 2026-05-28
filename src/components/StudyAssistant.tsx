
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, BookOpen, Brain, Calculator, FileText } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const StudyAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your study assistant. I can help you with study techniques, time management, subject explanations, and productivity tips. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    { text: "How to improve focus?", icon: Brain },
    { text: "Study techniques for exams", icon: BookOpen },
    { text: "Time management tips", icon: Calculator },
    { text: "Note-taking strategies", icon: FileText }
  ];

  const getAssistantResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('focus') || message.includes('concentration')) {
      return "Here are some effective focus techniques:\n\n1. **Pomodoro Technique**: Work for 25 minutes, then take a 5-minute break\n2. **Remove distractions**: Put your phone in another room\n3. **Single-tasking**: Focus on one thing at a time\n4. **Environment**: Create a dedicated study space\n5. **Meditation**: Practice mindfulness for 5-10 minutes daily\n\nWould you like me to elaborate on any of these techniques?";
    }
    
    if (message.includes('study') && (message.includes('technique') || message.includes('method'))) {
      return "Effective study techniques include:\n\n**Active Learning:**\n- Summarize information in your own words\n- Teach concepts to someone else\n- Create mind maps and diagrams\n\n**Spaced Repetition:**\n- Review material at increasing intervals\n- Use flashcards for key concepts\n\n**Practice Testing:**\n- Take practice quizzes regularly\n- Explain concepts without looking at notes\n\n**The Feynman Technique:**\n1. Choose a concept\n2. Explain it simply\n3. Identify gaps in knowledge\n4. Review and simplify further\n\nWhich technique interests you most?";
    }
    
    if (message.includes('time') && message.includes('management')) {
      return "Time management strategies for students:\n\n**Planning:**\n- Use a daily/weekly planner\n- Set specific study goals\n- Break large tasks into smaller ones\n\n**Prioritization:**\n- Use the Eisenhower Matrix (urgent/important)\n- Tackle difficult subjects when energy is highest\n\n**Time Blocking:**\n- Assign specific time slots for each subject\n- Include breaks and buffer time\n\n**Avoid Procrastination:**\n- Use the 2-minute rule (if it takes <2 min, do it now)\n- Start with the easiest part of a task\n- Use accountability partners\n\nWould you like help creating a study schedule?";
    }
    
    if (message.includes('note') || message.includes('notes')) {
      return "Effective note-taking strategies:\n\n**Cornell Method:**\n- Divide page into notes, cues, and summary sections\n\n**Mind Mapping:**\n- Visual representation of information\n- Great for seeing connections\n\n**Outline Method:**\n- Hierarchical structure with main topics and subtopics\n\n**Charting Method:**\n- Tables for comparing information\n\n**Digital vs. Handwritten:**\n- Handwritten: Better for retention\n- Digital: Better for searching and organizing\n\n**Key Tips:**\n- Use abbreviations and symbols\n- Review and revise notes within 24 hours\n- Use colors to categorize information\n\nWhat type of subjects do you need to take notes for?";
    }
    
    if (message.includes('motivation') || message.includes('motivated')) {
      return "Staying motivated while studying:\n\n**Set Clear Goals:**\n- SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n- Celebrate small wins\n\n**Find Your Why:**\n- Connect studies to personal goals\n- Visualize success\n\n**Create Rewards:**\n- Small rewards for completing tasks\n- Bigger rewards for major milestones\n\n**Study Groups:**\n- Accountability and support\n- Different perspectives\n\n**Track Progress:**\n- Use apps or journals\n- Visual progress indicators\n\n**Maintain Balance:**\n- Regular exercise and sleep\n- Social activities and hobbies\n\nWhat specific areas do you struggle with motivation?";
    }
    
    if (message.includes('exam') || message.includes('test')) {
      return "Exam preparation strategies:\n\n**Before the Exam:**\n- Create a study schedule 2-3 weeks prior\n- Practice with past papers\n- Form study groups\n- Get adequate sleep\n\n**Day of the Exam:**\n- Eat a good breakfast\n- Arrive early\n- Bring all necessary materials\n- Stay calm and positive\n\n**During the Exam:**\n- Read all instructions carefully\n- Plan your time allocation\n- Start with easier questions\n- Review answers if time permits\n\n**Managing Exam Anxiety:**\n- Deep breathing exercises\n- Positive self-talk\n- Progressive muscle relaxation\n- Visualization techniques\n\nWhat type of exam are you preparing for?";
    }
    
    // Default response
    return "I'd be happy to help you with that! I can assist with:\n\n• Study techniques and methods\n• Time management and planning\n• Focus and concentration tips\n• Note-taking strategies\n• Exam preparation\n• Motivation and goal setting\n• Subject-specific study advice\n\nCould you be more specific about what you'd like help with?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: getAssistantResponse(inputMessage),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputMessage('');
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Bot className="w-6 h-6 text-teal-600" />
            <span>🤖 Study Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Questions:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickQuestions.map((question, index) => {
                const IconComponent = question.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question.text)}
                    className="p-3 h-auto flex flex-col items-center space-y-1 text-xs"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-center">{question.text}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="border rounded-lg p-4 h-96 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about studying..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyAssistant;
