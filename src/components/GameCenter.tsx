
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Trophy, Zap, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GameCenterProps {
  user: any;
  setUser: (user: any) => void;
}

const GameCenter = ({ user, setUser }: GameCenterProps) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Memory Game State
  const [cards, setCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  // Reaction Game State
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [reactionStartTime, setReactionStartTime] = useState(0);

  const games = [
    { id: 'memory', name: 'Memory Match', description: 'Match pairs of cards to improve focus', icon: '🧠' },
    { id: 'reaction', name: 'Reaction Test', description: 'Test your reaction speed', icon: '⚡' },
    { id: 'focus', name: 'Focus Challenge', description: 'Click the targets as fast as possible', icon: '🎯' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    setScore(0);
    setGameStarted(true);
    
    if (gameId === 'memory') {
      setTimeLeft(60);
      initializeMemoryGame();
    } else if (gameId === 'reaction') {
      setTimeLeft(30);
      startReactionGame();
    } else if (gameId === 'focus') {
      setTimeLeft(45);
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setActiveGame(null);
    
    // Award XP based on score
    const xpGained = Math.floor(score / 10) + 5;
    const newXP = (user.xp || 0) + xpGained;
    const updatedUser = { ...user, xp: newXP };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast({
      title: "Game Complete! 🎮",
      description: `Score: ${score} | You earned ${xpGained} XP!`,
    });
  };

  const initializeMemoryGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    const shuffledCards = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setScore(prev => prev + 10);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const startReactionGame = () => {
    setWaitingForClick(false);
    setShowTarget(false);
    
    const randomDelay = Math.random() * 3000 + 1000; // 1-4 seconds
    setTimeout(() => {
      setShowTarget(true);
      setWaitingForClick(true);
      setReactionStartTime(Date.now());
    }, randomDelay);
  };

  const handleReactionClick = () => {
    if (!waitingForClick) return;
    
    const reactionTime = Date.now() - reactionStartTime;
    const points = Math.max(100 - Math.floor(reactionTime / 10), 10);
    setScore(prev => prev + points);
    setWaitingForClick(false);
    setShowTarget(false);
    
    setTimeout(() => startReactionGame(), 1000);
  };

  const renderGame = () => {
    if (!activeGame) return null;

    switch (activeGame) {
      case 'memory':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-lg text-xl font-bold transition-all ${
                    flippedCards.includes(index) || matchedCards.includes(index)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {flippedCards.includes(index) || matchedCards.includes(index) ? card : '?'}
                </button>
              ))}
            </div>
          </div>
        );

      case 'reaction':
        return (
          <div className="text-center space-y-4">
            <div
              onClick={handleReactionClick}
              className={`w-32 h-32 mx-auto rounded-full transition-all cursor-pointer ${
                showTarget ? 'bg-green-500 scale-110' : 'bg-gray-300'
              }`}
            />
            <p className="text-gray-600">
              {waitingForClick ? 'Click the green circle!' : 'Wait for it...'}
            </p>
          </div>
        );

      case 'focus':
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Focus challenge coming soon!</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            🎮 Focus Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeGame ? (
            <div className="grid md:grid-cols-3 gap-4">
              {games.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => startGame(game.id)}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{game.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{game.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Game Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold">{games.find(g => g.id === activeGame)?.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{score}</span>
                  </div>
                  <Button variant="outline" onClick={() => setActiveGame(null)}>
                    Exit Game
                  </Button>
                </div>
              </div>

              {/* Game Area */}
              <div className="min-h-96 flex items-center justify-center">
                {renderGame()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameCenter;
