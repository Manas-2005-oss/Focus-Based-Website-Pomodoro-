
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Volume2, User, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sound' | 'avatar' | 'wallpaper';
  unlocked: boolean;
  icon: string;
}

interface XPStoreProps {
  user: any;
  setUser: (user: any) => void;
}

const XPStore = ({ user, setUser }: XPStoreProps) => {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Items', icon: ShoppingBag },
    { id: 'sound', label: 'Sounds', icon: Volume2 },
    { id: 'avatar', label: 'Avatars', icon: User },
    { id: 'wallpaper', label: 'Wallpapers', icon: Gift },
  ];

  const defaultItems: StoreItem[] = [
    { id: '4', name: 'Forest Sounds', description: 'Peaceful nature ambiance', price: 50, category: 'sound', unlocked: false, icon: '🌲' },
    { id: '5', name: 'Sci-Fi Sounds', description: 'Futuristic timer sounds', price: 70, category: 'sound', unlocked: false, icon: '🚀' },
    { id: '6', name: 'Wind Chimes', description: 'Relaxing chime sounds', price: 40, category: 'sound', unlocked: false, icon: '🎐' },
    { id: '7', name: 'Robot Avatar', description: 'Cool robotic companion', price: 120, category: 'avatar', unlocked: false, icon: '🤖' },
    { id: '8', name: 'Cat Avatar', description: 'Cute feline friend', price: 90, category: 'avatar', unlocked: false, icon: '🐱' },
    { id: '9', name: 'Space Wallpaper', description: 'Beautiful cosmic background', price: 150, category: 'wallpaper', unlocked: false, icon: '🌌' },
    { id: '10', name: 'Mountain Wallpaper', description: 'Serene mountain landscape', price: 100, category: 'wallpaper', unlocked: false, icon: '🏔️' },
  ];

  useEffect(() => {
    const savedItems = localStorage.getItem('storeItems');
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      // Filter out theme items from saved data
      const filteredItems = parsed.filter((item: StoreItem) => item.category !== 'theme');
      setStoreItems(filteredItems);
    } else {
      setStoreItems(defaultItems);
      localStorage.setItem('storeItems', JSON.stringify(defaultItems));
    }
  }, []);

  const purchaseItem = (item: StoreItem) => {
    if ((user.xp || 0) < item.price) {
      toast({
        title: "Not enough XP!",
        description: `You need ${item.price - (user.xp || 0)} more XP to purchase this item.`,
        variant: "destructive"
      });
      return;
    }

    const updatedUser = { ...user, xp: (user.xp || 0) - item.price };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const updatedItems = storeItems.map(storeItem =>
      storeItem.id === item.id ? { ...storeItem, unlocked: true } : storeItem
    );
    setStoreItems(updatedItems);
    localStorage.setItem('storeItems', JSON.stringify(updatedItems));

    toast({
      title: "Purchase successful! 🎉",
      description: `You've unlocked ${item.name}!`,
    });
  };

  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>XP Store</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              {user.xp || 0} XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Store Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`border-2 transition-all ${item.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{item.icon}</div>
                    <Badge 
                      className={item.unlocked ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    >
                      {item.unlocked ? 'Owned' : `${item.price} XP`}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  
                  {!item.unlocked && (
                    <Button 
                      onClick={() => purchaseItem(item)}
                      disabled={(user.xp || 0) < item.price}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                    >
                      Purchase
                    </Button>
                  )}
                  
                  {item.unlocked && (
                    <Button variant="outline" className="w-full" disabled>
                      <Gift className="w-4 h-4 mr-2" />
                      Gift to Friend
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XPStore;
