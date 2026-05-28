
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Trophy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  user: string;
  content: string;
  type: 'achievement' | 'streak' | 'general';
  timestamp: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: number;
}

interface CommunityWallProps {
  user: any;
}

const CommunityWall = ({ user }: CommunityWallProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [dailyPrompt] = useState("What are you focusing on today?");
  const { toast } = useToast();

  const mockPosts: Post[] = [
    {
      id: '1',
      user: 'FocusNinja',
      content: 'Just completed a 7-day focus streak! 🔥 Feeling unstoppable!',
      type: 'streak',
      timestamp: Date.now() - 3600000,
      likes: 12,
      likedBy: ['StudyBuddy', 'TaskMaster'],
      comments: [
        { id: '1', user: 'StudyBuddy', content: 'Amazing! Keep it up! 💪', timestamp: Date.now() - 1800000 }
      ]
    },
    {
      id: '2',
      user: 'TaskMaster',
      content: 'Reached Level 5 today! The XP grind is real 💎',
      type: 'achievement',
      timestamp: Date.now() - 7200000,
      likes: 8,
      likedBy: ['FocusNinja'],
      comments: []
    },
    {
      id: '3',
      user: 'PomodoroKing',
      content: 'Working on my thesis today. Anyone else tackling big projects?',
      type: 'general',
      timestamp: Date.now() - 10800000,
      likes: 5,
      likedBy: [],
      comments: [
        { id: '2', user: 'ResearchQueen', content: 'Yes! Writing my research paper too 📚', timestamp: Date.now() - 9000000 }
      ]
    }
  ];

  useEffect(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(mockPosts);
      localStorage.setItem('communityPosts', JSON.stringify(mockPosts));
    }
  }, []);

  const createPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      user: user.name || 'Anonymous',
      content: newPost,
      type: 'general',
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: []
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    setNewPost('');

    toast({
      title: "Post shared!",
      description: "Your post has been added to the community wall.",
    });
  };

  const likePost = (postId: string) => {
    const userName = user.name || 'Anonymous';
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(userName);
        
        if (hasLiked) {
          // Unlike the post
          return {
            ...post,
            likes: post.likes - 1,
            likedBy: post.likedBy.filter(name => name !== userName)
          };
        } else {
          // Like the post
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...post.likedBy, userName]
          };
        }
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'streak': return '🔥';
      default: return '💭';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const hasUserLiked = (post: Post) => {
    return post.likedBy.includes(user.name || 'Anonymous');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Daily Prompt */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-0 shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">💡 {dailyPrompt}</p>
          <div className="flex space-x-2">
            <Input
              placeholder="Share your focus goals..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPost()}
              className="flex-1"
            />
            <Button onClick={createPost} className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            <MessageSquare className="w-5 h-5" />
            <span>Community Wall</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {post.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.user}</p>
                    <p className="text-xs text-gray-500">{formatTime(post.timestamp)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getPostIcon(post.type)} {post.type}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-3">{post.content}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likePost(post.id)}
                  className={`flex items-center space-x-1 ${hasUserLiked(post) ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 ${hasUserLiked(post) ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </Button>
              </div>
              
              {post.comments.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <span className="font-semibold text-gray-700">{comment.user}</span>
                      <span className="text-gray-600 ml-2">{comment.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityWall;
