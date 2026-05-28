
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroBlock {
  id: string;
  duration: number;
  task: string;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

interface ScheduledBlock {
  id: string;
  day: string;
  timeSlot: string;
  block: PomodoroBlock;
}

const StudyPlanner = () => {
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<PomodoroBlock | null>(null);
  const { toast } = useToast();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

  const availableBlocks: PomodoroBlock[] = [
    { id: '1', duration: 25, task: 'Focus Session', type: 'focus' },
    { id: '2', duration: 5, task: 'Short Break', type: 'shortBreak' },
    { id: '3', duration: 15, task: 'Long Break', type: 'longBreak' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('studyPlanner');
    if (saved) {
      setScheduledBlocks(JSON.parse(saved));
    }
  }, []);

  const saveSchedule = (blocks: ScheduledBlock[]) => {
    setScheduledBlocks(blocks);
    localStorage.setItem('studyPlanner', JSON.stringify(blocks));
  };

  const handleDrop = (day: string, timeSlot: string) => {
    if (!draggedBlock) return;

    const newBlock: ScheduledBlock = {
      id: Date.now().toString(),
      day,
      timeSlot,
      block: { ...draggedBlock, id: Date.now().toString() }
    };

    const updatedBlocks = [...scheduledBlocks, newBlock];
    saveSchedule(updatedBlocks);
    setDraggedBlock(null);

    toast({
      title: "Block scheduled!",
      description: `${draggedBlock.task} scheduled for ${day} at ${timeSlot}`,
    });
  };

  const removeBlock = (blockId: string) => {
    const updatedBlocks = scheduledBlocks.filter(block => block.id !== blockId);
    saveSchedule(updatedBlocks);
    
    toast({
      title: "Block removed",
      description: "The scheduled block has been removed",
    });
  };

  const getBlockForSlot = (day: string, timeSlot: string) => {
    return scheduledBlocks.find(block => block.day === day && block.timeSlot === timeSlot);
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'focus': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'shortBreak': return 'bg-green-100 border-green-300 text-green-800';
      case 'longBreak': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            <Calendar className="w-5 h-5" />
            <span>Study Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Available Blocks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Available Blocks</h3>
            <div className="flex space-x-4">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => setDraggedBlock(block)}
                  className={`p-3 rounded-lg border-2 cursor-move transition-all hover:shadow-md ${getBlockColor(block.type)}`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{block.duration}m</span>
                  </div>
                  <p className="text-sm mt-1">{block.task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-8 gap-2">
            <div className="p-2"></div>
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-700">
                {day.slice(0, 3)}
              </div>
            ))}
            
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot}>
                <div className="p-2 text-center font-medium text-gray-600">
                  {timeSlot}
                </div>
                {weekDays.map(day => {
                  const scheduledBlock = getBlockForSlot(day, timeSlot);
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="p-2 border-2 border-dashed border-gray-200 rounded-lg min-h-[60px] transition-colors hover:border-gray-300"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(day, timeSlot)}
                    >
                      {scheduledBlock && (
                        <div className={`p-2 rounded text-xs ${getBlockColor(scheduledBlock.block.type)} relative group`}>
                          <div className="flex items-center justify-between">
                            <span>{scheduledBlock.block.duration}m</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlock(scheduledBlock.id)}
                              className="opacity-0 group-hover:opacity-100 h-4 w-4 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="truncate">{scheduledBlock.block.task}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanner;
